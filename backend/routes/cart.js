import express from 'express';
import auth from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.use(auth);

// GET    /api/cart                → Get user cart
router.get('/', getCart);

// PUT    /api/cart/add            → Add item to cart (atomic upsert)
router.put('/add', addToCart);

// PATCH  /api/cart/:productId     → Update item quantity
router.patch('/:productId', updateCartItem);

// DELETE /api/cart/:productId     → Remove item from cart
router.delete('/:productId', removeFromCart);

// DELETE /api/cart                → Clear entire cart
router.delete('/', clearCart);

export default router;

