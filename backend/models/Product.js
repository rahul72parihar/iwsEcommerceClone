import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  trending: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
