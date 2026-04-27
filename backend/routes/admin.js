import express from 'express';
import Product from '../models/Product.js';
import PageBanner from '../models/PageBanner.js';
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Middleware for admin only
const requireAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// @desc Get all products for admin
router.get('/products', auth, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Toggle product trending
router.patch('/products/:id/toggle-trending', auth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.trending = !product.trending;
    await product.save();
    res.json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update product
router.put('/products/:id', auth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    Object.assign(product, req.body);
    await product.save();
    res.json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Create new product
router.post('/addProduct', auth, requireAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Delete product
router.delete('/products/:id', auth, requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get all banners for admin
router.get('/banners', auth, requireAdmin, async (req, res) => {
  try {
    const pageBanners = await PageBanner.find({}).sort({ page: 1 });
    res.json({ status: 'success', data: pageBanners });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Add a banner to a page
router.post('/banners', auth, requireAdmin, async (req, res) => {
  try {
    const { page, title, image, link, order, isActive } = req.body;
    let pageBanner = await PageBanner.findOne({ page });
    if (!pageBanner) {
      pageBanner = new PageBanner({ page, banners: [] });
    }
    pageBanner.banners.push({ title, image, link, order, isActive });
    await pageBanner.save();
    res.status(201).json({ status: 'success', data: pageBanner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update a banner
router.put('/banners/:page/:index', auth, requireAdmin, async (req, res) => {
  try {
    const { page, index } = req.params;
    const pageBanner = await PageBanner.findOne({ page });
    if (!pageBanner || !pageBanner.banners[index]) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    Object.assign(pageBanner.banners[index], req.body);
    await pageBanner.save();
    res.json({ status: 'success', data: pageBanner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Toggle banner active status
router.patch('/banners/:page/:index/toggle', auth, requireAdmin, async (req, res) => {
  try {
    const { page, index } = req.params;
    const pageBanner = await PageBanner.findOne({ page });
    if (!pageBanner || !pageBanner.banners[index]) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    pageBanner.banners[index].isActive = !pageBanner.banners[index].isActive;
    await pageBanner.save();
    res.json({ status: 'success', data: pageBanner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Delete a banner
router.delete('/banners/:page/:index', auth, requireAdmin, async (req, res) => {
  try {
    const { page, index } = req.params;
    const pageBanner = await PageBanner.findOne({ page });
    if (!pageBanner || !pageBanner.banners[index]) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    pageBanner.banners.splice(index, 1);
    await pageBanner.save();
    res.json({ status: 'success', message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================
// CATEGORY ADMIN ENDPOINTS
// ========================

// @desc Get all categories (with subcategories populated)
router.get('/categories', auth, requireAdmin, async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    const subcategories = await Subcategory.find({}).populate('category', 'name');
    const data = categories.map(cat => ({
      ...cat.toObject(),
      subcategories: subcategories.filter(sub => sub.category && sub.category._id.toString() === cat._id.toString())
    }));
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Create category
router.post('/categories', auth, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name: name.toUpperCase() });
    await category.save();
    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update category
router.put('/categories/:id', auth, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (req.body.name) category.name = req.body.name.toUpperCase();
    await category.save();
    res.json({ status: 'success', data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Delete category (cascade delete subcategories)
router.delete('/categories/:id', auth, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await Subcategory.deleteMany({ category: category._id });
    await Category.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Category and its subcategories deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================
// SUBCATEGORY ADMIN ENDPOINTS
// ============================

// @desc Get all subcategories
router.get('/subcategories', auth, requireAdmin, async (req, res) => {
  try {
    const subcategories = await Subcategory.find({}).populate('category', 'name').sort({ name: 1 });
    res.json({ status: 'success', data: subcategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Create subcategory
router.post('/subcategories', auth, requireAdmin, async (req, res) => {
  try {
    const { name, category } = req.body;
    const subcategory = new Subcategory({ name, category });
    await subcategory.save();
    const populated = await Subcategory.findById(subcategory._id).populate('category', 'name');
    res.status(201).json({ status: 'success', data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update subcategory
router.put('/subcategories/:id', auth, requireAdmin, async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    if (req.body.name) subcategory.name = req.body.name;
    if (req.body.category) subcategory.category = req.body.category;
    await subcategory.save();
    const populated = await Subcategory.findById(subcategory._id).populate('category', 'name');
    res.json({ status: 'success', data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Delete subcategory
router.delete('/subcategories/:id', auth, requireAdmin, async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    await Subcategory.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Subcategory deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

