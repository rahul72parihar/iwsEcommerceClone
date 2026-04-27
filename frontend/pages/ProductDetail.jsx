import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { apiService } from '../services/api';
import { setCartCount, addToast } from '../src/store/slices/uiSlice';
import '../styles/ProductDetail.css';


export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProduct(id);
        if (response.status === 'success') {
          setProduct(response.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      dispatch(addToast({ type: 'error', message: 'Please login to add to cart' }));
      return;
    }

    try {
      const result = await apiService.addToCart(id, 1);
      if (result.status === 'success') {
        dispatch(setCartCount(result.data.length));
        dispatch(addToast({ type: 'success', message: 'Added to cart!' }));
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to add to cart' }));
      }
    } catch (error) {
      dispatch(addToast({ type: 'error', message: 'Network error' }));
    }
  };


  if (loading) return <div className="loading">Loading product...</div>;
  if (error || !product) return <div className="error">{error || 'Product not found'}</div>;

  // Generate 3 images (same image for demo, replace with variants later)
  const images = [
    product.image,
    product.image,
    product.image
  ];

  return (
    <main className="productDetailMain">
      <div className="productDetailContainer">
        <div className="productImages">
          <div className="mainImage">
            <img src={images[0]} alt={product.title} />
          </div>
          <div className="thumbImages">
            <img src={images[1]} alt={product.title} className="thumb" />
            <img src={images[2]} alt={product.title} className="thumb" />
          </div>
        </div>
        <div className="productInfo">
          <h1 className="productTitle">{product.title}</h1>
          <p className="productPrice">${Number(product.price).toFixed(2)}</p>
          <div className="productCategory">Category: {product.category?.name || product.category}</div>
          <div className="addToCart">
            <button className="addButton" onClick={handleAddToCart}>
              <FiPlus /> Add to Cart
            </button>
          </div>
          <div className="productDescription">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

