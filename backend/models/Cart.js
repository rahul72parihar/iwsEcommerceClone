import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required']
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'Quantity cannot be less than 1']
  }
}, { timestamps: true });

// Compound index to prevent duplicate cart items for the same user + product
cartSchema.index({ user: 1, product: 1 }, { unique: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;

