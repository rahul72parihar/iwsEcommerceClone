import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.js';
import '../styles/MyOrders.css';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth?.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await apiService.getMyOrders();

        if (result.status === 'success') {
          setOrders(result.data);
        } else {
          setError(result.data?.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  if (!token) return null;

  if (loading) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className='orders-page-heading'>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
<div
            key={order._id}
            className="order-card"
            onClick={() => navigate(`/myorders/${order._id}`)}
          >
            <div className="order-header">
              <span>Order ID: {order._id}</span>
              <span className={`status ${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  {item.name} × {item.quantity}
                </div>
              ))}
            </div>

            <div className="order-footer">
              <span>Total: ₹{order.total}</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}