import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer';
import { apiService } from '../services/api.js';
import '../styles/ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="loading">Loading product...</div>;
  if (error || !product) return <div className="error">{error || 'Product not found'}</div>;

  // Generate 3 images (same image for demo, replace with variants later)
  const images = [
    product.image,
    product.image,
    product.image
  ];

  return (
    <div className="productDetailPage">
      <Header />
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
            <p className="productPrice">${product.price}</p>
            <div className="productCategory">Category: {product.category}</div>
            <div className="addToCart">
              <button className="addButton">Add to Cart</button>
            </div>
            <div className="productDescription">
              <h3>Description</h3>
              <p>High quality product with premium materials. Perfect fit and comfort. Available in multiple sizes and colors.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
