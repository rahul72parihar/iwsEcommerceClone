import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.js';
import '../styles/CheckoutPage.css';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const token = useSelector((state) => state.auth?.token);
  const navigate = useNavigate();
  
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

// Create checkout order on load
  const createCheckoutOrder = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.createCheckout();
      
      if (result.status === 'success' && result.data) {
        setOrderData(result.data);
        console.log('Checkout order created:', result.data);
      } else {
        setError(result.data?.message || 'Failed to create order');
      }
    } catch (err) {
      setError('Error creating checkout order');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  // Track if checkout order has been created
  const orderCreated = useRef(false);

  useEffect(() => {
    // Prevent creating multiple orders
    if (token && !orderCreated.current) {
      orderCreated.current = true;
      createCheckoutOrder();
    } else if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Initialize Razorpay checkout
  const initRazorpayCheckout = useCallback(() => {
    if (!window.Razorpay || !orderData) return;

    const rzp = new window.Razorpay({
      key: orderData.keyId,
      name: 'IWS Ecommerce',
      description: 'Purchase from IWS Ecommerce',
      order_id: orderData.orderId,
      amount: orderData.amount * 100, // Convert to paise
      currency: 'INR',
      handler: async (response) => {
        // Payment successful - verify with backend
        try {
          const verifyResult = await apiService.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyResult.status === 'success') {
            setPaymentSuccess(true);
            // Clear cart after successful payment
            await apiService.clearCart();
          } else {
            setError('Payment verification failed');
          }
        } catch (err) {
          setError('Error verifying payment');
          console.error('Payment verification error:', err);
        }
      },
      theme: {
        color: '#2563eb',
      },
    });

    rzp.open();
  }, [orderData]);

  // Handle retry
  const handleRetry = () => {
    createCheckoutOrder();
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate('/');
  };

  if (!token) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h1>Checkout</h1>
          <p>Please <a className="link" href="/login">login</a> to proceed to checkout</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">
          <h1>Preparing Checkout...</h1>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <div className="checkout-error">
          <h1>Checkout Error</h1>
          <p>{error}</p>
          <div className="checkout-actions">
            <button className="btn-primary" onClick={handleRetry}>
              Try Again
            </button>
            <button className="btn-secondary" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-icon">✓</div>
          <h1>Payment Successful!</h1>
          <p>Your order has been placed successfully.</p>
          <p>Order ID: {orderData?.orderId}</p>
          <div className="checkout-actions">
            <button className="btn-primary" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="checkout-page">
      <div className="checkout-content">
        <h1>Checkout</h1>
        
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          
          <div className="checkout-items">
            {orderData?.items?.map((item, index) => (
              <div key={index} className="checkout-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">Qty: {item.quantity}</span>
                </div>
                <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span className="amount">₹{orderData?.amount?.toFixed(2)}</span>
          </div>
        </div>

        <div className="checkout-actions">
          <button 
            className="btn-primary pay-btn" 
            onClick={initRazorpayCheckout}
            disabled={processing || !orderData}
          >
            {processing ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </div>

        <p className="checkout-note">
          You will be redirected to Razorpay payment gateway to complete your payment.
        </p>
      </div>
    </div>
  );
}
