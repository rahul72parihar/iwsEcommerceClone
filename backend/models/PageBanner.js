import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL or Cloudinary link
    required: true,
  },
  link: {
    type: String, // where banner redirects
    default: "/",
  },
  order: {
    type: Number, // for sorting banners
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { _id: false });

const pageBannerSchema = new mongoose.Schema({
  page: {
    type: String,
    enum: ["main", "men", "women", "shoes"],
    required: true,
  },
  banners: [bannerSchema], // array of banners (you can have 34 here)
}, { timestamps: true });

export default mongoose.model("PageBanner", pageBannerSchema);