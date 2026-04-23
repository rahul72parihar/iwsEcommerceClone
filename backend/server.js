import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend server running!' });
});

// DB Connect (update MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {})
  .catch(err => {});

// Routes
app.get("/", (req, res) => {
  res.send("API running");
});

import productRoutes from './routes/products.js';
app.use('/api/products', productRoutes);

import bannerRoutes from './routes/banners.js';
app.use('/api/banners', bannerRoutes);

import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);

import cartRoutes from './routes/cart.js';
app.use('/api/cart', cartRoutes);

import adminRoutes from './routes/admin.js';
app.use('/api/admin', adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
