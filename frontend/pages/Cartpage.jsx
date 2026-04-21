import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.js';
import '../styles/Cartpage.css';
import { setCartCount } from '../src/store/slices/uiSlice';

export default function Cartpage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth?.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        setLoading(true);
        const result = await apiService.getCart(token);
        if (result.status === 'success') {
          setCartItems(Array.isArray(result.data) ? result.data : []);
          dispatch(setCartCount(Array.isArray(result.data) ? result.data.length : 0));
        }
        setLoading(false);
      } else {
        setLoading(false);
        setCartItems([]);
      }
    };

    fetchCart();
  }, [token, dispatch]);

  const total = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (item.product?.price * item.quantity || 0), 0) : 0;

  const updateQuantity = async (productId, currentQuantity, newQuantity) => {
    if (newQuantity < 1) return;
    
    const delta = newQuantity - currentQuantity;
    const result = await apiService.addToCart(productId, delta, token);
    if (result.status === 'success') {
      setCartItems(Array.isArray(result.data) ? result.data : []);
      dispatch(setCartCount(Array.isArray(result.data) ? result.data.length : 0));
    }
  };

  const removeItem = async (productId) => {
    const result = await apiService.removeFromCart(productId, token);
    if (result.status === 'success') {
      setCartItems(Array.isArray(result.data) ? result.data : []);
      dispatch(setCartCount(Array.isArray(result.data) ? result.data.length : 0));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!token) {
    return (
      <div className="cart-empty">
        <h1>Cart</h1>
        <p>Please <a href="/login">login</a> to view your cart</p>
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
          <h2>Your cart is empty 😢</h2>
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
                  <p className="price-qty">${item.product?.price || 0} x {item.quantity || 1}</p>
                </div>
                <div className="cart-controls">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.product?._id, item.quantity || 1, (item.quantity || 1) - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity || 1}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.product?._id, item.quantity || 1, (item.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.product?._id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="cart-item-total">
                  ${((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({Array.isArray(cartItems) ? cartItems.length : 0} items):</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
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

