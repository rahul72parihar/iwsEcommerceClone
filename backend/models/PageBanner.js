import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
  link: {
    type: String, 
    default: "/",
  },
  order: {
    type: Number,
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
  banners: [bannerSchema],
}, { timestamps: true });

export default mongoose.model("PageBanner", pageBannerSchema);