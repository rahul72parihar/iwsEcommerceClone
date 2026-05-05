import Order from '../models/Orders.js';
import OrderItem from '../models/OrderItem.js';

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items')
      .sort({ createdAt: -1 });

    // Also populate product inside each OrderItem
    for (const order of orders) {
      for (const item of order.items) {
        await item.populate('product');
      }
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    .populate('items');

    // Also populate product inside each OrderItem
    if (order && order.items) {
      for (const item of order.items) {
        await item.populate('product');
      }
    }

    // ❌ Order not found
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 🔐 Security check (VERY IMPORTANT)
    // Prevent users from accessing others' orders
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
