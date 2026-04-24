import express from "express";
import PageBanner from "../models/PageBanner.js";

const router = express.Router();

// Get main page banners (for homepage carousel)
router.get("/", async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const pageBanner = await PageBanner.findOne({ page: 'main' });
    const activeBanners = pageBanner
      ? pageBanner.banners.filter(b => b.isActive).sort((a, b) => a.order - b.order)
      : [];
    res.json(activeBanners.slice(0, limit));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:category', async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    const pageBanner = await PageBanner.findOne({ page: req.params.category.toLowerCase() });
    const activeBanners = pageBanner ? pageBanner.banners.filter(b => b.isActive).sort((a, b) => a.order - b.order) : [];
    res.json(activeBanners.slice(0, limit));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
