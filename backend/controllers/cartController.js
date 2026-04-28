import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const populateProduct = (query) => {
  return query.populate('product', 'title price image');
};

export const getCart = async (req, res) => {
  try {
    const items = await populateProduct(
      Cart.find({ user: req.user._id }).sort({ createdAt: -1 })
    );

    res.status(200).json({
      status: 'success',
      cart: { items }
    });
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
   @note    Atomic upsert with $inc — handles race conditions
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

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be at least 1'
      });
    }

    // Verify product exists
    const productExists = await Product.findById(productId).select('_id');
    if (!productExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Atomic upsert: increment quantity if exists, create if not
    const cartItem = await Cart.findOneAndUpdate(
      { user: req.user._id, product: productId },
      { $inc: { quantity: qty } },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    const populatedItem = await populateProduct(
      Cart.findById(cartItem._id)
    );

    // Return full cart for consistency
    const items = await populateProduct(
      Cart.find({ user: req.user._id }).sort({ createdAt: -1 })
    );

    res.status(200).json({
      status: 'success',
      cart: { items }
    });
  } catch (err) {
    console.error('ADD TO CART ERROR:', err);

    if (err.code === 11000) {
      // Detect the specific stray unique user_1 index issue
      const isUserIndexError = err.message?.includes('index: user_1 ') || 
                               err.keyPattern?.user !== undefined;
      
      if (isUserIndexError) {
        return res.status(500).json({
          status: 'error',
          message: 'Database index misconfiguration detected. Please run: node backend/fixCartIndexes.js'
        });
      }

      return res.status(409).json({
        status: 'error',
        message: 'Duplicate cart item detected. Please retry.'
      });
    }

    res.status(500).json({
      status: 'error',
      message: err.message || 'Server error adding to cart'
    });
  }
};

/* =========================
   @desc    Update item quantity
   @route   PATCH /api/cart/:productId
========================= */
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        status: 'error',
        message: 'Product ID is required'
      });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be at least 1'
      });
    }

    const cartItem = await Cart.findOneAndUpdate(
      { user: req.user._id, product: productId },
      { $set: { quantity: qty } },
      { returnDocument: 'after', runValidators: true }
    );

    if (!cartItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart item not found'
      });
    }

    const items = await populateProduct(
      Cart.find({ user: req.user._id }).sort({ createdAt: -1 })
    );

    res.status(200).json({
      status: 'success',
      cart: { items }
    });
  } catch (err) {
    console.error('UPDATE CART ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Server error updating cart'
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

    const deleted = await Cart.findOneAndDelete({
      user: req.user._id,
      product: productId
    });

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart item not found'
      });
    }

    const items = await populateProduct(
      Cart.find({ user: req.user._id }).sort({ createdAt: -1 })
    );

    res.status(200).json({
      status: 'success',
      cart: { items }
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
    await Cart.deleteMany({ user: req.user._id });

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully',
      cart: { items: [] }
    });
  } catch (err) {
    console.error('CLEAR CART ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Server error clearing cart'
    });
  }
};

