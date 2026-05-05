import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.js';
import { setCartCount } from '../src/store/slices/uiSlice.js';
import '../styles/CheckoutPage.css';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth?.token);

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [cartData, setCartData] = useState(null);

  const [paymentType, setPaymentType] = useState('online');
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        const result = await apiService.getCart();
        if (result.status === 'success') {
          console.log("Cart data:", result.data);
          setCartData(result.data);
        }
      } catch (err) {
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token, navigate]);

  // Calculate total price based on the nested product structure
  const calculateTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((acc, item) => {
      const price = parseFloat(item.product.price) || 0;
      return acc + (price * item.quantity);
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const initRazorpay = (orderData) => {
    if (!window.Razorpay) {
      setError("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount * 100,
      currency: 'INR',
      name: 'IWS Ecommerce',
      description: 'Purchase Payment',
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          setProcessing(true);
          const verifyResult = await apiService.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyResult.status === 'success') {
            setPaymentSuccess(true);
            dispatch(setCartCount(0));
            await apiService.clearCart();
          } else {
            setError('Payment verification failed');
          }
        } catch (err) {
          setError('Error verifying payment');
        } finally {
          setProcessing(false);
        }
      },
      prefill: { name: address.fullName, contact: address.phone },
      theme: { color: '#2563eb' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.phone || !address.fullName) {
      setError("Please fill in all shipping details.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const result = await apiService.createCheckout({
        address,
        paymentMethod: paymentType,
        amount: calculateTotal()
      });

      if (result.status === 'success') {
        if (paymentType === 'cod') {
          setPaymentSuccess(true);
          dispatch(setCartCount(0));
          await apiService.clearCart();
        } else {
          initRazorpay(result.data);
          await apiService.clearCart();
        }
      } else {
        setError(result.message || 'Order creation failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-icon">✓</div>
          <h1>Order Placed!</h1>
          <p>Thank you, {address.fullName}. Your order is confirmed.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Back to Shop</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="checkout-loading"><h1>Loading...</h1></div>;

  return (
    <div className="checkout-page">
      <div className="checkout-grid">
        <div className="checkout-form-container">
          <h2>Checkout Information</h2>
          <form onSubmit={handlePlaceOrder} className="checkout-form">
            <section className="form-section">
              <h3>Shipping Address</h3>
              <input type="text" name="fullName" placeholder="Full Name" required onChange={handleInputChange} />
              <input type="text" name="street" placeholder="Street Address" required onChange={handleInputChange} />
              <div className="form-row">
                <input type="text" name="city" placeholder="City" required onChange={handleInputChange} />
                <input type="text" name="state" placeholder="State" required onChange={handleInputChange} />
                <input type="text" name="zipCode" placeholder="Zip Code" required onChange={handleInputChange} />
              </div>
              <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleInputChange} />
            </section>

            <section className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-selection">
                <label className={`payment-card ${paymentType === 'online' ? 'active' : ''}`}>
                  <input type="radio" value="online" checked={paymentType === 'online'} onChange={() => setPaymentType('online')} />
                  <span>Online Payment</span>
                </label>
                <label className={`payment-card ${paymentType === 'cod' ? 'active' : ''}`}>
                  <input type="radio" value="cod" checked={paymentType === 'cod'} onChange={() => setPaymentType('cod')} />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </section>

            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-primary place-order-btn" disabled={processing || !cartData?.items?.length}>
              {processing ? 'Processing...' : paymentType === 'cod' ? 'Place Order (COD)' : `Pay ₹${calculateTotal().toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="checkout-summary-container">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartData?.items?.map((item) => (
              <div key={item._id} className="summary-item">
                <div className="summary-item-details">
                  <p className="item-title">{item.product.title}</p>
                  <p className="item-qty">Qty: {item.quantity}</p>
                </div>
                <span className="item-price">₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total Amount:</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}