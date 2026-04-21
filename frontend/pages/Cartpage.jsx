import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiService } from '../services/api.js';
import '../styles/ProductCard.css'; // Reuse styling

export default function Cartpage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        setLoading(true);
        const result = await apiService.getCart(token);
        if (result.status === 'success') {
          setCartItems(result.data);
        }
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

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
      <h1>My Cart ({cartItems.length})</h1>
      {loading ? (
        <p>Loading cart...</p>
      ) : cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.image} alt={item.product.title} />
                </div>
                <div className="cart-item-details">
                  <h3>{item.product.title}</h3>
                  <p>${item.product.price} x {item.quantity}</p>
                </div>
                <div className="cart-item-total">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
