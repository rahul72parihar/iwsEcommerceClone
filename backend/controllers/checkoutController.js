import Razorpay from "razorpay";
import crypto from "crypto";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Orders.js";
import OrderItem from "../models/OrderItem.js";

// Lazy Razorpay instance
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

// ================= CREATE CHECKOUT =================
export const createCheckout = async (req, res) => {
  try {
    console.log("Checkout request body:", req.body);
    const userId = req.user._id;
    const { address, paymentMethod } = req.body;

    const cartItems = await Cart.find({ user: userId }).populate("product");

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
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
        image: product.image,
      });
    }

    if (!validItems.length) {
      return res.status(400).json({
        message: "No valid products in cart",
      });
    }

    // Delete previous pending orders
    await Order.deleteMany({ user: userId, status: "pending" });

    // ================= COD FLOW =================
    if (paymentMethod === "cod") {
      const order = await Order.create({
        user: userId,
        items: [],
        total,
        address,
        paymentMethod: "cod",
        status: "placed",
      });

      const orderItemIds = [];

      for (const item of validItems) {
        const orderItem = await OrderItem.create({
          order: order._id,
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        });

        orderItemIds.push(orderItem._id);
      }

      order.items = orderItemIds;
      await order.save();

      return res.json({
        success: true,
        message: "Order placed with Cash on Delivery",
      });
    }

    // ================= ONLINE PAYMENT =================
    const razorpayOrder = await getRazorpay().orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      user: userId,
      items: [],
      total,
      address,
      paymentMethod: "online",
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    const orderItemIds = [];

    for (const item of validItems) {
      const orderItem = await OrderItem.create({
        order: order._id,
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      });

      orderItemIds.push(orderItem._id);
    }

    order.items = orderItemIds;
    await order.save();

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: total,
      dbOrderId: order._id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Checkout failed" });
  }
};

// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = "paid";
    order.razorpayPaymentId = razorpayPaymentId;
    order.paidAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
