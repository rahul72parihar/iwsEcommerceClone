import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
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
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true,
    index: true
  },
  items: {
    type: [cartItemSchema],
    default: []
  }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;

