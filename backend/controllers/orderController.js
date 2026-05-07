import Order from '../models/Orders.js';
import OrderItem from '../models/OrderItem.js';

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    // Fetch items from OrderItem (since Orders schema no longer stores item ids)
    const orderIds = orders.map((o) => o._id);
    const orderItems = await OrderItem.find({ order: { $in: orderIds } })
      .populate('product', 'title price image')
      .sort({ createdAt: -1 });

    const itemsByOrderId = orderItems.reduce((acc, item) => {
      const key = item.order.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});


    // Backward-compatible: add `status` derived from payment/delivery statuses
    const normalizedOrders = orders.map((o) => {
      const items = itemsByOrderId[o._id.toString()] || [];

      // UI expects items with { _id, name, quantity, price, image }
      const uiItems = items.map((it) => ({
        _id: it._id,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        image: it.image || it.product?.image,
      }));

      return {
        ...o.toObject(),
        items: uiItems,
        status:
          o.paymentStatus === 'paid'
            ? 'paid'
            : o.paymentStatus === 'failed'
              ? 'failed'
              : o.deliveryStatus || o.paymentStatus || 'pending',
      };
    });

    res.json(normalizedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    const orderItems = order
      ? await OrderItem.find({ order: order._id })
          .populate('product', 'title price image')
          .sort({ createdAt: -1 })
      : [];

    const uiItems = orderItems.map((it) => ({
      _id: it._id,
      name: it.name,
      quantity: it.quantity,
      price: it.price,
      image: it.image || it.product?.image,
    }));


    // ❌ Order not found
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 🔐 Security check (VERY IMPORTANT)
    // Prevent users from accessing others' orders
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Backward-compatible: add `status` derived from payment/delivery statuses
    const normalizedOrder = {
      ...order.toObject(),
      items: uiItems,
      status:
        order.paymentStatus === 'paid'
          ? 'paid'
          : order.paymentStatus === 'failed'
            ? 'failed'
            : order.deliveryStatus || order.paymentStatus || 'pending',
    };

    res.json(normalizedOrder);



  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
