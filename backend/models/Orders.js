import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, enum: ["PREPAID", "COD"], required: true }, // Changed to lowercase to match frontend
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      enum: ["packing", "shipped", "delivered", "cancelled"],
      default: "packing",
    },
    total: { type: Number, required: true },
    razorpayOrderId: { type: String }, // Optional for COD
    razorpayPaymentId: { type: String },
    paidAt: { type: Date },
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;