import express from 'express';
import Product from '../models/Product.js';
import PageBanner from '../models/PageBanner.js';
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
    console.log(product);
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

export default router;

