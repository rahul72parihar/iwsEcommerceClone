import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";

const router = express.Router();

// Get products - supports ?category=&subCategory=&limit=
router.get("/", async (req, res) => {
  try {
    const { category, subCategory, limit = 999 } = req.query;

    let query = {};

    if (category) {
      const categoryDoc = await Category.findOne({
        name: category.toUpperCase(),
      });

      if (!categoryDoc) return res.json({ products: [] });

      query.category = categoryDoc._id;

      if (subCategory) {
        const subCatDoc = await Subcategory.findOne({
          name: subCategory,
          category: categoryDoc._id,
        });

        if (!subCatDoc) return res.json({ products: [] });

        query.subcategory = subCatDoc._id;
      }
    }

    const products = await Product.find(query)
      .sort({ trending: -1 })
      .limit(parseInt(limit))
      .populate("category", "name")
      .populate("subcategory", "name");

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET trending
router.get("/trending", async (req, res) => {
  try {
    const products = await Product.find({ trending: true })
      .limit(8)
      .populate("category", "name")
      .populate("subcategory", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET product by custom id field
router.get("/id/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id })
      .populate("category", "name")
      .populate("subcategory", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dynamic /:slug - category if MEN/WOMEN/SHOES, else product id
router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const limit = parseInt(req.query.limit) || 12;

    const categoryDoc = await Category.findOne({ name: slug.toUpperCase() });

    if (categoryDoc) {
      const products = await Product.find({
        category: categoryDoc._id,
      }).limit(limit);

      return res.json({ products });
    } else {
      const product = await Product.findOne({ id: slug })
        .populate("category", "name")
        .populate("subcategory", "name");
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

