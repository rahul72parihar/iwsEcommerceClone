import Order from "../models/Orders.js";
import OrderItem from "../models/OrderItem.js";

/* =========================================================
   USER - GET MY ORDERS
========================================================= */

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    const orderIds = orders.map((o) => o._id);

    const orderItems = await OrderItem.find({
      order: { $in: orderIds },
    })
      .populate("product", "title price image")
      .sort({ createdAt: -1 });

    const itemsByOrderId = orderItems.reduce((acc, item) => {
      const key = item.order.toString();

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);

      return acc;
    }, {});

    const normalizedOrders = orders.map((o) => {
      const items = itemsByOrderId[o._id.toString()] || [];

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
          o.paymentStatus === "paid"
            ? "paid"
            : o.paymentStatus === "failed"
              ? "failed"
              : o.deliveryStatus ||
                o.paymentStatus ||
                "pending",
      };
    });

    res.json(normalizedOrders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   USER - GET SINGLE ORDER
========================================================= */

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id,
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Security check
    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const orderItems = await OrderItem.find({
      order: order._id,
    })
      .populate("product", "title price image")
      .sort({ createdAt: -1 });

    const uiItems = orderItems.map((it) => ({
      _id: it._id,
      name: it.name,
      quantity: it.quantity,
      price: it.price,
      image: it.image || it.product?.image,
    }));

    const normalizedOrder = {
      ...order.toObject(),

      items: uiItems,

      status:
        order.paymentStatus === "paid"
          ? "paid"
          : order.paymentStatus === "failed"
            ? "failed"
            : order.deliveryStatus ||
              order.paymentStatus ||
              "pending",
    };

    res.json(normalizedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   ADMIN - GET ALL ORDERS
========================================================= */

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const orderIds = orders.map((o) => o._id);

    const orderItems = await OrderItem.find({
      order: { $in: orderIds },
    })
      .populate("product", "title image")
      .sort({ createdAt: -1 });

    const itemsByOrderId = orderItems.reduce(
      (acc, item) => {
        const key = item.order.toString();

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(item);

        return acc;
      },
      {},
    );

    const normalizedOrders = orders.map((o) => {
      const items =
        itemsByOrderId[o._id.toString()] || [];

      return {
        ...o.toObject(),

        items: items.map((it) => ({
          _id: it._id,
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          image:
            it.image || it.product?.image,
        })),

        status:
          o.paymentStatus === "paid"
            ? "paid"
            : o.paymentStatus === "failed"
              ? "failed"
              : o.deliveryStatus ||
                o.paymentStatus ||
                "pending",
      };
    });

    res.json(normalizedOrders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================================================
   ADMIN - UPDATE DELIVERY STATUS
========================================================= */

export const updateOrderStatus = async (
  req,
  res,
) => {
  try {
    const { deliveryStatus } = req.body;

    const order = await Order.findById(
      req.params.id,
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.deliveryStatus = deliveryStatus;

    if (deliveryStatus === "delivered") {
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};