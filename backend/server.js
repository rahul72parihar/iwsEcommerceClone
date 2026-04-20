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
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Routes
app.get("/", (req, res) => {
  res.send("API running");
});
import productRoutes from './routes/products.js';
app.use('/api/products', productRoutes);

import bannerRoutes from './routes/banners.js';
app.use('/api/banners', bannerRoutes)
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
