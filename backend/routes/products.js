import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products (trending first)
router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await Product.find().sort({ trending: -1 });
    res.json(products.slice(0, limit || 999));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET trending
router.get('/trending', async (req, res) => {
  try {
    const products = await Product.find({ trending: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category
router.get('/:category', async (req, res) => {
  console.log("CATEGORY")
  try {
    const products = await Product.find({ category: req.params.category.toUpperCase() });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product by product ID (after categories) - add console.log
router.get('/id/:id', async (req, res) => {
  console.log('Product route hit:', req.params.id);
  try {
    const product = await Product.findOne({ id: req.params.id });
    console.log(product)
    // res.status(200).json(product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
