import Razorpay from 'razorpay';
import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Orders.js';

// Lazy initialization of Razorpay client
let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

export const createCheckout = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await Cart.find({ user: userId }).populate('product');

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total = 0;
    const validItems = [];

    for (const item of cartItems) {
      const product = item.product;

      if (!product) continue;

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `${product.title} is out of stock`,
        });
      }

      total += product.price * item.quantity;

      validItems.push({
        product: product._id,
        name: product.title,
        price: product.price,
        quantity: item.quantity,
      });
    }

    if (!validItems.length) {
      return res.status(400).json({
        message: 'No valid products in cart',
      });
    }

// 3. create razorpay order
    const razorpayOrder = await getRazorpay().orders.create({
      amount: total * 100, // INR → paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // 4. save order in DB (PENDING)
    const order = await Order.create({
      user: userId,
      items: validItems,
      total,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
    });

// 5. send response to frontend
    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: total,
      dbOrderId: order._id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Checkout failed' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

// Verify the payment signature
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Update order status to paid
    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;
    order.paidAt = new Date();
    await order.save();

    res.json({ success: true, message: 'Payment verified successfully' });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};
