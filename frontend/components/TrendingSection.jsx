import { useState, useEffect, useRef } from "react";
import { apiService } from "../services/api.js";
import ProductCard from "./ProductCard";
import "../styles/CategoryCarousel.css"; 
import "../styles/ProductSection.css";

// Constants to match your CategoryCarousel feel
const ITEM_WIDTH = 320;
const SCROLL_AMOUNT = ITEM_WIDTH + 24;

export default function TrendingSection() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArrows, setShowArrows] = useState(false);
  
  // Ref to access the DOM element for scrolling
  const carouselRef = useRef(null);

  /* ===== SCROLL LOGIC ===== */
  const scrollCarousel = (direction) => {
    const ref = carouselRef.current;
    if (!ref) return;

    const currentScroll = ref.scrollLeft;
    const maxScroll = ref.scrollWidth - ref.clientWidth;

    if (direction === "left") {
      // If at start, jump to end (infinite loop feel) or just stop at 0
      ref.scrollTo({
        left: currentScroll <= 0 ? maxScroll : currentScroll - SCROLL_AMOUNT,
        behavior: "smooth",
      });
    } else {
      ref.scrollTo({
        left: currentScroll >= maxScroll ? 0 : currentScroll + SCROLL_AMOUNT,
        behavior: "smooth",
      });
    }
  };

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const allProducts = await apiService.getAllProducts();
        const trending = allProducts.data.filter(p => p.trending);
        setTrendingProducts(trending);
      } catch (err) {
        console.error("Error fetching trending:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  /* ===== CHECK IF ARROWS ARE NEEDED ===== */
  useEffect(() => {
    const checkScrollability = () => {
      if (carouselRef.current) {
        const isScrollable = carouselRef.current.scrollWidth > carouselRef.current.clientWidth;
        setShowArrows(isScrollable);
      }
    };

    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [trendingProducts]);

  if (loading) return <div className="loading">Loading trending...</div>;
  if (trendingProducts.length === 0) return null;

  return (
    <section className="trendingSection categoryCarouselSection">
      <h2 className="productSectionTitle">🔥 Trending Now</h2>
      
      {/* Container wrapper for relative positioning of arrows */}
      <div className="carouselContainer">
        <div 
          className="categoriesCarousel" 
          ref={carouselRef}
        >
          {trendingProducts.map((product) => (
            <div key={product.id || product._id} className="carouselItem">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Conditional Arrows */}
        {showArrows && (
          <>
            <button
              className="carouselArrow left"
              onClick={() => scrollCarousel("left")}
              aria-label="Scroll Left"
            >
              ‹
            </button>

            <button
              className="carouselArrow right"
              onClick={() => scrollCarousel("right")}
              aria-label="Scroll Right"
            >
              ›
            </button>
          </>
        )}
      </div>
    </section>
  );
}