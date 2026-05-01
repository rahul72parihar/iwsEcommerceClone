import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api.js';
import '../styles/MyOrders.css';

export default function OrderDetailPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth?.token);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await apiService.getOrderByid(id);

        if (result.status === 'success') {
          setOrder(result.data);
        } else {
          setError(result.data?.message || 'Failed to fetch order');
        }
      } catch (err) {
        setError('Error fetching order');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [token, navigate, id]);

  if (!token) return null;

  if (loading) {
    return (
      <div className="order-detail-page">
        <h1>Order Details</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-page">
        <h1>Order Details</h1>
        <p className="error">{error}</p>
        <button onClick={() => navigate('/myorders')}>Back to My Orders</button>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <button className="back-button" onClick={() => navigate('/myorders')}>
        ← Back to My Orders
      </button>

      <h1 className='order-detail-heading'>Order Details</h1>

      <div className="order-info-card">
        <div className="order-info-header">
          <span>Order ID: {order._id}</span>
          <span className={`status ${order.status}`}>
            {order.status}
          </span>
        </div>

        <div className="order-info-details">
          <div className="info-row">
            <span className="label">Order Date:</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          
          {order.paidAt && (
            <div className="info-row">
              <span className="label">Paid Date:</span>
              <span>{new Date(order.paidAt).toLocaleDateString()}</span>
            </div>
          )}

          <div className="info-row">
            <span className="label">Razorpay Order ID:</span>
            <span>{order.razorpayOrderId}</span>
          </div>

          {order.razorpayPaymentId && (
            <div className="info-row">
              <span className="label">Razorpay Payment ID:</span>
              <span>{order.razorpayPaymentId}</span>
            </div>
          )}

          <div className="info-row total-row">
            <span className="label">Total:</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      <h2 className="items-heading">Order Items</h2>

      <div className="order-items-list">
        {order.items && order.items.map((item) => (
          <div key={item._id} className="order-item-card">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.name} 
                className="item-image"
              />
            )}
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-price">₹{item.price}</p>
              <p className="item-quantity">Quantity: {item.quantity}</p>
              <p className="item-subtotal">
                Subtotal: ₹{item.price * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {order.shippingAddress && (
        <div className="shipping-address-card">
          <h2 className="address-heading">Shipping Address</h2>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
        </div>
      )}
    </div>
  );
}
