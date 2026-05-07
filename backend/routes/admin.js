import express from 'express';
import Product from '../models/Product.js';
import PageBanner from '../models/PageBanner.js';
import Category from '../models/Category.js';
import Cart from '../models/Cart.js';
import Subcategory from '../models/Subcategory.js';
import Order from '../models/Orders.js';
import OrderItem from '../models/OrderItem.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/* =========================
   ASYNC HANDLER
========================= */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* =========================
   ADMIN MIDDLEWARE (FIXED)
========================= */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

/* =========================
   PRODUCT ROUTES
========================= */

// Get all products
router.get('/products', auth, requireAdmin, asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: products
  });
}));

// Toggle trending
router.patch('/products/:id/toggle-trending', auth, requireAdmin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  product.trending = !product.trending;
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
}));

// Update product
router.put('/products/:id', auth, requireAdmin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  Object.assign(product, req.body);
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
}));

// Create product
router.post('/addProduct', auth, requireAdmin, asyncHandler(async (req, res) => {
  const {
    id,
    title,
    price,
    image,
    images,
    sizes,
    category,
    subcategory,
    description,
    trending,
  } = req.body || {};

  const missing = [];
  if (!id) missing.push('id');
  if (!title) missing.push('title');
  if (!price) missing.push('price');
  if (!image) missing.push('image');
  if (!category) missing.push('category');
  if (!subcategory) missing.push('subcategory');

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      missing,
    });
  }

  const product = new Product({
    id,
    title,
    price,
    image,
    images: images || [],
    sizes: sizes || [],
    category,
    subcategory,
    description,
    trending: typeof trending === 'boolean' ? trending : false,
  });

  await product.save();

  res.status(201).json({
    success: true,
    data: product
  });
}));

// Delete product
router.delete('/products/:id', auth, requireAdmin, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  await Cart.deleteMany({ product: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Product deleted'
  });
}));

/* =========================
   BANNER ROUTES
========================= */

// Get banners
router.get('/banners', auth, requireAdmin, asyncHandler(async (req, res) => {
  const pageBanners = await PageBanner.find({}).sort({ page: 1 });

  res.status(200).json({
    success: true,
    data: pageBanners
  });
}));

// Add banner
router.post('/banners', auth, requireAdmin, asyncHandler(async (req, res) => {
  const { page, title, image, link, order, isActive } = req.body;

  let pageBanner = await PageBanner.findOne({ page });

  if (!pageBanner) {
    pageBanner = new PageBanner({ page, banners: [] });
  }

  pageBanner.banners.push({ title, image, link, order, isActive });
  await pageBanner.save();

  res.status(201).json({
    success: true,
    data: pageBanner
  });
}));

// Update banner
router.put('/banners/:page/:index', auth, requireAdmin, asyncHandler(async (req, res) => {
  const { page, index } = req.params;

  const pageBanner = await PageBanner.findOne({ page });

  if (!pageBanner || !pageBanner.banners[index]) {
    return res.status(404).json({
      success: false,
      message: 'Banner not found'
    });
  }

  Object.assign(pageBanner.banners[index], req.body);
  await pageBanner.save();

  res.status(200).json({
    success: true,
    data: pageBanner
  });
}));

// Toggle banner
router.patch('/banners/:page/:index/toggle', auth, requireAdmin, asyncHandler(async (req, res) => {
  const { page, index } = req.params;

  const pageBanner = await PageBanner.findOne({ page });

  if (!pageBanner || !pageBanner.banners[index]) {
    return res.status(404).json({
      success: false,
      message: 'Banner not found'
    });
  }

  pageBanner.banners[index].isActive = !pageBanner.banners[index].isActive;
  await pageBanner.save();

  res.status(200).json({
    success: true,
    data: pageBanner
  });
}));

// Delete banner
router.delete('/banners/:page/:index', auth, requireAdmin, asyncHandler(async (req, res) => {
  const { page, index } = req.params;

  const pageBanner = await PageBanner.findOne({ page });

  if (!pageBanner || !pageBanner.banners[index]) {
    return res.status(404).json({
      success: false,
      message: 'Banner not found'
    });
  }

  pageBanner.banners.splice(index, 1);
  await pageBanner.save();

  res.status(200).json({
    success: true,
    message: 'Banner deleted'
  });
}));

/* =========================
   CATEGORY ROUTES
========================= */

router.get('/categories', auth, requireAdmin, asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });
  const subcategories = await Subcategory.find({}).populate('category', 'name');

  const data = categories.map(cat => ({
    ...cat.toObject(),
    subcategories: subcategories.filter(
      sub => sub.category && sub.category._id.toString() === cat._id.toString()
    )
  }));

  res.status(200).json({
    success: true,
    data
  });
}));

router.post('/categories', auth, requireAdmin, asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = new Category({ name: name.toUpperCase() });
  await category.save();

  res.status(201).json({
    success: true,
    data: category
  });
}));

router.put('/categories/:id', auth, requireAdmin, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  if (req.body.name) category.name = req.body.name.toUpperCase();

  await category.save();

  res.status(200).json({
    success: true,
    data: category
  });
}));

router.delete('/categories/:id', auth, requireAdmin, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

   const categoryProducts = await Product.findOne({ category: req.params.id });

  if (categoryProducts) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete: Category has products'
    });
  }


  await Subcategory.deleteMany({ category: category._id });
  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Category and its subcategories deleted'
  });
}));

/* =========================
   SUBCATEGORY ROUTES
========================= */

router.get('/subcategories', auth, requireAdmin, asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.find({})
    .populate('category', 'name')
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    data: subcategories
  });
}));

router.post('/subcategories', auth, requireAdmin, asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subcategory = new Subcategory({ name, category });
  await subcategory.save();

  const populated = await Subcategory.findById(subcategory._id)
    .populate('category', 'name');

  res.status(201).json({
    success: true,
    data: populated
  });
}));

router.put('/subcategories/:id', auth, requireAdmin, asyncHandler(async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);

  if (!subcategory) {
    return res.status(404).json({
      success: false,
      message: 'Subcategory not found'
    });
  }

  if (req.body.name) subcategory.name = req.body.name;
  if (req.body.category) subcategory.category = req.body.category;

  await subcategory.save();

  const populated = await Subcategory.findById(subcategory._id)
    .populate('category', 'name');

  res.status(200).json({
    success: true,
    data: populated
  });
}));

router.delete('/subcategories/:id', auth, requireAdmin, asyncHandler(async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);

  if (!subcategory) {
    return res.status(404).json({
      success: false,
      message: 'Subcategory not found'
    });
  }

  const existingProduct = await Product.findOne({ subcategory: req.params.id });

  if (existingProduct) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete: Subcategory has products'
    });
  }


  await Subcategory.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Subcategory deleted'
  });
}));

/* =========================
   ADMIN ORDER ROUTES
========================= */

// Get all orders
router.get(
  '/orders',
  auth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const orderIds = orders.map((o) => o._id);

    const orderItems = await OrderItem.find({
      order: { $in: orderIds },
    }).populate('product', 'title image');

    const itemsByOrderId = orderItems.reduce(
      (acc, item) => {
        const key = item.order.toString();

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(item);

        return acc;
      },
      {},
    );

    const normalizedOrders = orders.map((o) => {
      const items =
        itemsByOrderId[o._id.toString()] || [];

      return {
        ...o.toObject(),

        items: items.map((it) => ({
          _id: it._id,
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          image:
            it.image || it.product?.image,
        })),
      };
    });

    res.status(200).json({
      success: true,
      data: normalizedOrders,
    });
  }),
);

// Update order status
router.put(
  '/orders/:id/status',
  auth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { deliveryStatus } = req.body;

    const order = await Order.findById(
      req.params.id,
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.deliveryStatus =
      deliveryStatus;

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  }),
);

export default router;