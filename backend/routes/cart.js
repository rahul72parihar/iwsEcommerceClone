import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

router.use(auth);

// GET cart
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // 🔒 Safety check
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!productId) {
      return res.status(400).json({ message: 'Product ID required' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 🔍 Check if product already exists in cart
    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // ➕ Update quantity
      user.cart[itemIndex].quantity += quantity;
    } else {
      // 🆕 Add new item
      user.cart.push({
        product: productId,
        quantity
      });
    }

    await user.save();

    // 🔄 Populate products
    const updatedUser = await User.findById(user._id)
      .populate('cart.product');

    return res.status(200).json({
      status: 'success',
      cart: updatedUser.cart
    });

  } catch (err) {
    // console.error('ADD TO CART ERROR:', err);
    return res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Remove item from cart
router.delete('/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    
    await user.save();
    
    const populatedUser = await User.findById(req.user.id).populate('cart.product');
    res.json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

