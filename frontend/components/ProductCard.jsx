import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { FiPlus } from 'react-icons/fi';
import { apiService } from "../services/api.js";
import { setCartCount, addToast } from "../src/store/slices/uiSlice.js";
import "../styles/ProductCard.css";



export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const handleAddToCart = async () => {
    if (!token) {
      dispatch(addToast({
        type: 'error',
        message: 'Please login to add to cart'
      }));
      return;
    }

    const result = await apiService.addToCart(product._id || product.id, 1, token);
    if (result.status === 'success') {
      dispatch(setCartCount(result.data.length));
      dispatch(addToast({
        type: 'success',
        message: 'Item added to cart! 🛒'
      }));
    } else {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to add to cart'
      }));
    }
  };


  return (
    <div className="productCardWrapper">
      <div className="productCard">
      <Link to={`/product/${product.id}`} >
        <div className="productImage">
          <img src={product.image} alt={product.title} loading="lazy" />
        </div>
        <div className="productInfo">
          <h3 className="productTitle">{product.title}</h3>
          <p className="productPrice">${product.price}</p>
        </div>
      </Link>
      <button className="addToCartBtn" onClick={handleAddToCart}>
        <FiPlus />
        Add to Cart
      </button>

      </div>
    </div>
  );
}

