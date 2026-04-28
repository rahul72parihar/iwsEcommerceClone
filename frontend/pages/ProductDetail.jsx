import { useState, useEffect, useRef } from 'react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const carouselRef = useRef(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const index = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth);
      setCurrentSlide(index);
    }
  };

  const scrollToSlide = (index) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.offsetWidth * index,
        behavior: 'smooth'
      });
    }
    setCurrentSlide(index);
  };
  
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
    if (isAdding) return;

    setIsAdding(true);
    try {
      const result = await apiService.addToCart(product._id, 1);
      if (result.status === 'success') {
        dispatch(setCartCount(result.data?.items?.length || 0));
        dispatch(addToast({ type: 'success', message: 'Added to cart!' }));
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to add to cart' }));
      }
    } catch (error) {
      dispatch(addToast({ type: 'error', message: 'Network error' }));
    }
    setIsAdding(false);
  };


  if (loading) return <div className="loading">Loading product...</div>;
  if (error || !product) return <div className="error">{error || 'Product not found'}</div>;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <main className="productDetailMain">
      <div className="productDetailContainer">
        <div className="productImages">
          {/* Desktop Grid */}
          <div className="imageGrid">
            {allImages.map((img, idx) => (
              <div key={idx} className="imageGridItem">
                <img src={img} alt={`${product.title} ${idx + 1}`} onClick={() => openModal(img)} />
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div
            className="mobileCarousel"
            ref={carouselRef}
            onScroll={handleCarouselScroll}
          >
            {allImages.map((img, idx) => (
              <div key={idx} className="carouselSlide">
                <img src={img} alt={`${product.title} ${idx + 1}`} onClick={() => openModal(img)} />
              </div>
            ))}
          </div>
          {allImages.length > 1 && (
            <div className="carouselDots">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`carouselDot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="productInfo">
          <h1 className="productTitle">{product.title}</h1>
          <p className="productPrice">₹{Number(product.price).toFixed(2)}</p>
          <div className="productCategory">Category: {product.category?.name || product.category}</div>
          <div className="addToCart">
            <button className="addButton" disabled={isAdding} onClick={handleAddToCart}>
              <FiPlus /> {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
          <div className="productDescription">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="imageModalOverlay" onClick={closeModal}>
          <div className="imageModalContent" onClick={(e) => e.stopPropagation()}>
            <button className="imageModalClose" onClick={closeModal}>×</button>
            <img src={modalImage} alt="Enlarged product" />
          </div>
        </div>
      )}
    </main>
  );
}

