import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/* =========================
   @desc    Get user cart
   @route   GET /api/cart
========================= */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')
      .populate('user', 'name email');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json(cart.items);
  } catch (err) {
    console.error('GET CART ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Server error fetching cart'
    });
  }
};

/* =========================
   @desc    Add item to cart
   @route   PUT /api/cart/add
========================= */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID is required'
      });
    }

    // Verify product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Increase quantity if product already in cart
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('user', 'name email');

    res.status(200).json({
      status: 'success',
      cart: populatedCart.items
    });
  } catch (err) {
    console.error('ADD TO CART ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Server error adding to cart'
    });
  }
};

/* =========================
   @desc    Remove item from cart
   @route   DELETE /api/cart/:productId
========================= */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('user', 'name email');

    res.status(200).json({
      status: 'success',
      cart: populatedCart.items
    });
  } catch (err) {
    console.error('REMOVE FROM CART ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Server error removing from cart'
    });
  }
};

/* =========================
   @desc    Clear entire cart
   @route   DELETE /api/cart
========================= */
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('user', 'name email');

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully',
      cart: populatedCart.items
    });
  } catch (err) {
    console.error('CLEAR CART ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Server error clearing cart'
    });
  }
};

