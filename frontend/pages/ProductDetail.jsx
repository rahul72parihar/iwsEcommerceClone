import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";
import { apiService } from "../services/api";
import { setCartCount, addToast } from "../src/store/slices/uiSlice";
import "../styles/ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const carouselRef = useRef(null);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const allImages = product
    ? [product.image, ...(product.images || [])].filter(Boolean)
    : [];

  const modalImage =
    allImages[modalImageIndex] || allImages[0] || "";

  const openModal = (imageIndex) => {
    setModalImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goPrevModal = () => {
    if (!allImages.length) return;

    setModalImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };

  const goNextModal = () => {
    if (!allImages.length) return;

    setModalImageIndex(
      (prev) => (prev + 1) % allImages.length,
    );
  };

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const index = Math.round(
        carouselRef.current.scrollLeft /
          carouselRef.current.offsetWidth,
      );

      setCurrentSlide(index);
    }
  };

  const scrollToSlide = (index) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.offsetWidth * index,
        behavior: "smooth",
      });
    }

    setCurrentSlide(index);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await apiService.getProduct(id);

        if (response.status === "success") {
          setProduct(response.data);
        } else {
          setError("Product not found");
        }
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
        return;
      }

      const len = allImages.length || 1;

      if (e.key === "ArrowLeft") {
        e.preventDefault();

        setModalImageIndex(
          (prev) => (prev - 1 + len) % len,
        );
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();

        setModalImageIndex(
          (prev) => (prev + 1) % len,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isModalOpen, allImages]);

  const handleAddToCart = async () => {
    if (!token) {
      dispatch(
        addToast({
          type: "error",
          message: "Please login to add to cart",
        }),
      );

      return;
    }

    if (isAdding) return;

    setIsAdding(true);

    try {
      const result = await apiService.addToCart(product._id, 1);

      if (result.status === "success") {
        dispatch(setCartCount(result.data?.items?.length || 0));

        dispatch(
          addToast({
            type: "success",
            message: "Added to cart!",
          }),
        );
      } else {
        dispatch(
          addToast({
            type: "error",
            message: "Failed to add to cart",
          }),
        );
      }
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: "Network error",
        }),
      );
    }

    setIsAdding(false);
  };

  if (loading) {
    return (
      <main className="productDetailMain">
        <div className="productDetailContainer">
          <div className="productImages">
            <div className="imageGrid">
              <div className="skeletonImage"></div>
              <div className="skeletonImage"></div>
              <div className="skeletonImage"></div>
              <div className="skeletonImage"></div>
            </div>
          </div>

          <div className="productInfo">
            <div className="skeletonTitle"></div>
            <div className="skeletonPrice"></div>
            <div className="skeletonCategory"></div>
            <div className="skeletonButton"></div>

            <div className="productDescription">
              <div className="skeletonDescLine"></div>
              <div className="skeletonDescLine"></div>
              <div className="skeletonDescLine short"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <div className="error">
        {error || "Product not found"}
      </div>
    );
  }

  return (
    <main className="productDetailMain">
      <div className="productDetailContainer">
        <div className="productImages">
          <div className="imageGrid">
            {allImages.map((img, idx) => (
              <div key={idx} className="imageGridItem">
                <img
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  onClick={() => openModal(idx)}
                />
              </div>
            ))}
          </div>

          <div
            className="mobileCarousel"
            ref={carouselRef}
            onScroll={handleCarouselScroll}
          >
            {allImages.map((img, idx) => (
              <div key={idx} className="carouselSlide">
                <img
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  onClick={() => openModal(idx)}
                />
              </div>
            ))}
          </div>

          {allImages.length > 1 && (
            <div className="carouselDots">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`carouselDot ${
                    idx === currentSlide ? "active" : ""
                  }`}
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="productInfo">
          <h1 className="productTitle">{product.title}</h1>

          <p className="productPrice">
            ₹{Number(product.price).toFixed(2)}
          </p>

          <div className="productCategory">
            Category:{" "}
            {product.category?.name || product.category}
          </div>

          <div className="addToCart">
            <button
              className="addButton"
              disabled={isAdding}
              onClick={handleAddToCart}
            >
              <FiPlus />
              {" "}
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </div>

          <div className="productDescription">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="imageModalOverlay"
          onClick={closeModal}
        >
          <div
            className="imageModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            {allImages.length > 1 && (
              <>
                <button
                  className="imageModalNavBtn left"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrevModal();
                  }}
                  type="button"
                >
                  ‹
                </button>

                <button
                  className="imageModalNavBtn right"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNextModal();
                  }}
                  type="button"
                >
                  ›
                </button>
              </>
            )}

            <button
              className="imageModalClose"
              onClick={closeModal}
              type="button"
            >
              ×
            </button>

            <img
              src={modalImage}
              alt="Enlarged product"
            />
          </div>
        </div>
      )}
    </main>
  );
}