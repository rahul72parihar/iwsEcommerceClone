import { useState, useEffect, useRef } from "react";
import { apiService } from "../services/api.js";
import ProductCard from "./ProductCard";
import "../styles/CategoryCarousel.css";
import "../styles/ProductSection.css";

const CATEGORIES = ["MEN", "WOMEN", "SHOES"];
const ITEM_WIDTH = 320;
const SCROLL_AMOUNT = ITEM_WIDTH + 24;

export default function CategoryCarousel() {
  const [categorySections, setCategorySections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArrows, setShowArrows] = useState({});

  const carouselRefs = useRef({});

  /* ===== SCROLL ===== */
  const scrollCarousel = (category, direction) => {
    const ref = carouselRefs.current[category];
    if (!ref) return;

    const currentScroll = ref.scrollLeft;
    const maxScroll = ref.scrollWidth - ref.clientWidth;

    if (direction === "left") {
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
    const fetchCategoriesData = async () => {
      try {
        setLoading(true);
        setError(null);

        const promises = CATEGORIES.map((cat) =>
          apiService.getProducts(cat, 5)
        );

        const responses = await Promise.all(promises);

        const sections = {};
        CATEGORIES.forEach((cat, i) => {
          sections[cat] = Array.isArray(responses[i]?.data)
            ? responses[i].data
            : [];
        });

        setCategorySections(sections);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  /* ===== CHECK SCROLLABILITY (SAFE) ===== */
  useEffect(() => {
    Object.keys(carouselRefs.current).forEach((category) => {
      const el = carouselRefs.current[category];
      if (!el) return;

      const isScrollable = el.scrollWidth > el.clientWidth;

      setShowArrows((prev) => {
        if (prev[category] === isScrollable) return prev; // ✅ prevent loop
        return { ...prev, [category]: isScrollable };
      });
    });
  }, [categorySections]);

  /* ===== HANDLE RESIZE ===== */
  useEffect(() => {
    const handleResize = () => {
      Object.keys(carouselRefs.current).forEach((category) => {
        const el = carouselRefs.current[category];
        if (!el) return;

        const isScrollable = el.scrollWidth > el.clientWidth;

        setShowArrows((prev) => {
          if (prev[category] === isScrollable) return prev;
          return { ...prev, [category]: isScrollable };
        });
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <section className="categoryCarouselSection">
        <div className="categoryCarouselsContainer">
          {CATEGORIES.map((category) => (
            <div key={category} className="categoryCarouselWrapper">
              <h3 className="categoryTitle">{category}</h3>
              <div className="carouselContainer">
                <div className="noProducts">Loading...</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ===== ERROR ===== */
  if (error) {
    return (
      <section className="categoryCarouselSection">
        <div className="categoryCarouselsContainer">
          <div className="noProducts">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="categoryCarouselSection">
      <div className="categoryCarouselsContainer">
        {CATEGORIES.map((category) => {
          const products = categorySections[category] || [];

          if (products.length === 0) {
            return (
              <div key={category} className="categoryCarouselWrapper">
                <h3 className="categoryTitle">{category}</h3>
                <div className="carouselContainer">
                  <div className="noProducts">
                    No products available for {category}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={category} className="categoryCarouselWrapper">
              <h3 className="categoryTitle">{category}</h3>

              <div className="carouselContainer">
                <div
                  className="categoriesCarousel"
                  ref={(el) => {
                    if (el) carouselRefs.current[category] = el; // ✅ no setState here
                  }}
                >
                  {products.map((product) => (
                    <div key={product._id} className="carouselItem">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* ===== CONDITIONAL ARROWS ===== */}
                {showArrows[category] && (
                  <>
                    <button
                      className="carouselArrow left"
                      onClick={() => scrollCarousel(category, "left")}
                    >
                      ‹
                    </button>

                    <button
                      className="carouselArrow right"
                      onClick={() => scrollCarousel(category, "right")}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}