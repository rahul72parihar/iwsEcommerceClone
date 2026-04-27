import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;
import dotenv from "dotenv";

import Category from "./models/Category.js";
import Subcategory from "./models/Subcategory.js";
import Product from "./models/Product.js";

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    
    const tshirts = await Subcategory.findOne({ name: "T-Shirts" });
    console.log("T SHIRT -> ", tshirts);
    
    const menCategory = await Category.findOne({ name: "MEN" });
    console.log("MEN CATEGORY -> ", menCategory);

    await Product.updateMany(
      { category: menCategory._id },
      { $set: { subcategory: tshirts._id } },
    );

    console.log(await Product.updateMany(
      { category: menCategory._id },
      { $set: { subcategory: tshirts._id } },
    ))

    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedDB();
