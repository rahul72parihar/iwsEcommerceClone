import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get products - supports ?category=&limit=
router.get('/', async (req, res) => {
  try {
    const { category, limit } = req.query;
    let query = {};
    if (category) query.category = category.toUpperCase();
    const products = await Product.find(query).sort({ trending: -1 }).limit(parseInt(limit) || 999);
    res.json(products);
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

// Dynamic /:slug - category if MEN/WOMEN/SHOES, else product id
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const { limit = 12 } = req.query;
    const categories = ['MEN', 'WOMEN', 'SHOES'];
    
    if (categories.includes(slug)) {
      // Category
      const products = await Product.find({ category: slug }).limit(parseInt(limit));
      res.json(products);
    } else {
      // Product detail
      const product = await Product.findOne({ id: slug });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

