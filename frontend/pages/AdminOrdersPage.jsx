import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import "../styles/AdminPage.css";

const AdminOrdersPage = () => {
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate("/login");

      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await apiService.adminGetOrders();
        console.log("Admin Orders Response:", response);
        if (response.status === "success") {
          setOrders(response.data || []);
        } else {
          setError("Failed to load orders");
        }
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, isAdmin, navigate]);

  const updateStatus = async (orderId, deliveryStatus) => {
    try {
      setUpdatingId(orderId);

      const response = await apiService.adminUpdateOrderStatus(orderId, {
        deliveryStatus,
      });

      if (response.status === "success") {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  deliveryStatus,
                }
              : order,
          ),
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!token || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Loading orders...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Orders Management</h1>

        <p>Total Orders: {orders.length}</p>
      </div>

      <div className="admin-orders-grid">
        {orders.map((order) => (
          <div key={order._id} className="admin-order-card">
            <div className="admin-order-top">
              <div>
                <h3>Order #{order._id.slice(-8)}</h3>

                <p className="admin-order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className={`admin-status ${order.deliveryStatus}`}>
                {order.deliveryStatus}
              </div>
            </div>

            <div className="admin-order-info">
              <p>
                <strong>Customer:</strong> {order.user?.name || "Unknown"}
              </p>

              <p>
                <strong>Email:</strong> {order.user?.email || "Unknown"}
              </p>

              <p>
                <strong>Total:</strong> ₹{order.total}
              </p>

              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>

              <p>
                <strong>Payment Status:</strong> {order.paymentStatus}
              </p>
            </div>

            <div className="admin-shipping">
              <h4>Shipping Address</h4>

              <p>{order.shippingAddress?.fullName}</p>

              <p>{order.shippingAddress?.street}</p>

              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </p>

              <p>{order.shippingAddress?.zipCode}</p>

              <p>{order.shippingAddress?.phone}</p>
            </div>

            <div className="admin-order-items">
              <h4>Items</h4>

              {order.items?.map((item) => (
                <div key={item._id} className="admin-order-item">
                  <img src={item.image} alt={item.name} />

                  <div className="admin-order-item-info">
                    <p>{item.name}</p>

                    <small>Qty: {item.quantity}</small>

                    <small>₹{item.price}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-order-actions">
              <select
                value={order.deliveryStatus}
                disabled={updatingId === order._id}
                onChange={(e) => updateStatus(order._id, e.target.value)}
              >
                <option value="packing">Packing</option>

                <option value="shipped">Shipped</option>

                <option value="delivered">Delivered</option>

                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
