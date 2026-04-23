import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

/* =========================
   MEN (20)
========================= */
const menShirts = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `men-${i + 1}`,
    title: `Men's Premium Shirt ${i + 1}`,
    price: (29.99 + i).toFixed(2),
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "MEN",
    description: `High-quality men's shirt ${i + 1} made with breathable cotton, modern fit, and durable stitching. Perfect for casual and formal wear.`,
  }))
];

/* =========================
   WOMEN (20)
========================= */
const womenDresses = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `women-${i + 1}`,
    title: `Women's Dress ${i + 1}`,
    price: (49.99 + i).toFixed(2),
    image: "https://plus.unsplash.com/premium_photo-1675186049409-f9f8f60ebb5e",
    category: "WOMEN",
    description: `Elegant women's dress ${i + 1} with modern design, lightweight fabric, and perfect fit for all occasions.`,
  }))
];

/* =========================
   SHOES (20)
========================= */
const shoes = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `shoes-${i + 1}`,
    title: `Premium Shoes ${i + 1}`,
    price: (79.99 + i).toFixed(2),
    image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b",
    category: "SHOES",
    description: `Premium shoes ${i + 1} with durable sole, breathable material, and stylish design. Built for comfort and everyday wear.`,
  }))
];

/* =========================
   COMBINED DATA
========================= */
const hardcodedProductsData = [
  ...menShirts,
  ...womenDresses,
  ...shoes,
];

/* =========================
   SEED FUNCTION
========================= */
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({});

    // Admin user
    const adminUser = {
      name: 'Admin User',
      email: 'admin@ecom.com',
      password: 'admin',
      role: 'admin'
    };

    await User.deleteMany({});
    await User.create(adminUser);
    console.log("✅ Admin user seeded: admin@ecom.com / admin");

    await Product.insertMany(hardcodedProductsData);

    console.log("✅ Seeded 60 products (20 MEN + 20 WOMEN + 20 SHOES)");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedDB();