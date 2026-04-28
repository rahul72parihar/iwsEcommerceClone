import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.js';
import '../styles/Cartpage.css';
import { setCartCount } from '../src/store/slices/uiSlice';

export default function Cartpage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingItemId, setProcessingItemId] = useState(null);
  const token = useSelector((state) => state.auth?.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        setLoading(true);
        const result = await apiService.getCart();
        if (result.status === 'success') {
          const items = result.data?.items || [];
          setCartItems(Array.isArray(items) ? items : []);
          dispatch(setCartCount(Array.isArray(items) ? items.length : 0));
        }
        setLoading(false);
      } else {
        setLoading(false);
        setCartItems([]);
      }
    };

    fetchCart();
  }, [token, dispatch]);

  const total = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.product?.price * item.quantity || 0), 0)
    : 0;

  const updateQuantity = async (productId, currentQuantity, newQuantity) => {
    if (newQuantity < 1 || isProcessing) return;

    setIsProcessing(true);
    setProcessingItemId(productId);
    try {
      const result = await apiService.updateCartItem(productId, newQuantity);
      if (result.status === 'success') {
        const items = result.data?.items || [];
        setCartItems(Array.isArray(items) ? items : []);
        dispatch(setCartCount(Array.isArray(items) ? items.length : 0));
      }
    } catch (err) {
      console.error('Update quantity error:', err);
    } finally {
      setIsProcessing(false);
      setProcessingItemId(null);
    }
  };

  const removeItem = async (productId) => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await apiService.removeFromCart(productId);
      if (result.status === 'success') {
        const items = result.data?.items || [];
        setCartItems(Array.isArray(items) ? items : []);
        dispatch(setCartCount(Array.isArray(items) ? items.length : 0));
      }
    } catch (err) {
      console.error('Remove item error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!token) {
    return (
      <div className="cart-empty">
        <h1>Cart</h1>
        <p>Please <a className='link' href="/login">login</a> to view your cart</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>My Cart ({Array.isArray(cartItems) ? cartItems.length : 0})</h1>
      {loading ? (
        <div className="loading">Loading cart...</div>
      ) : Array.isArray(cartItems) && cartItems.length === 0 ? (
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Start shopping to fill your cart!</p>
        </div>
      ) : Array.isArray(cartItems) ? (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={item.product?._id || index} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product?.image || '/placeholder.jpg'} alt={item.product?.title || 'Item'} />
                </div>
                <div className="cart-item-details">
                  <h3>{item.product?.title || 'Unknown Item'}</h3>
                  <p className="price-qty">₹{item.product?.price || 0} x {item.quantity || 1}</p>
                </div>
                <div className="cart-controls">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      disabled={isProcessing}
                      onClick={() => updateQuantity(item.product?._id, item.quantity || 1, (item.quantity || 1) - 1)}
                    >
                      {processingItemId === item.product?._id ? '...' : '-'}
                    </button>
                    <span className="quantity">{item.quantity || 1}</span>
                    <button
                      className="quantity-btn"
                      disabled={isProcessing}
                      onClick={() => updateQuantity(item.product?._id, item.quantity || 1, (item.quantity || 1) + 1)}
                    >
                      {processingItemId === item.product?._id ? '...' : '+'}
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    disabled={isProcessing}
                    onClick={() => removeItem(item.product?._id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="cart-item-total">
                  ₹{((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({Array.isArray(cartItems) ? cartItems.length : 0} items):</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
          </div>
        </div>
      ) : (
        <div className="loading">Error loading cart</div>
      )}
    </div>
  );
}

