import { useState, useEffect, useRef } from "react";
import { apiService } from "../services/api.js";
import ProductCard from "./ProductCard";
import "../styles/CategoryCarousel.css";
import "../styles/ProductSection.css";

const CATEGORIES = ["MEN", "WOMEN", "SHOES"];
const ITEM_WIDTH = 320;
const SCROLL_AMOUNT = ITEM_WIDTH + 24;

export default function CategoryCarousel({ title = "Featured by Category" }) {
  const [categorySections, setCategorySections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carouselRefs = useRef({});

  const scrollCarousel = (category, direction) => {
    const ref = carouselRefs.current[category];
    if (!ref) return;

    const scrollLeft = direction === "left";
    const currentScroll = ref.scrollLeft;
    const maxScroll = ref.scrollWidth - ref.clientWidth;

    if (scrollLeft) {
      if (currentScroll <= 0) {
        ref.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        ref.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
      }
    } else {
      if (currentScroll >= maxScroll) {
        ref.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        ref.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setLoading(true);
        setError(null);

        const promises = CATEGORIES.map((cat) =>
          apiService.getProducts(cat, 5),
        );

        const responses = await Promise.all(promises);

        const sections = {};
        sections[cat] = Array.isArray(responses[i]?.data)
          ? responses[i].data
          : [];

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

  // ✅ LOADING STATE
  if (loading) {
    return (
      <section className="categoryCarouselSection">
        <h5 className="productSectionTitle">{title}</h5>
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

  // ✅ ERROR STATE
  if (error) {
    return (
      <section className="categoryCarouselSection">
        <h5 className="productSectionTitle">{title}</h5>
        <div className="categoryCarouselsContainer">
          <div className="noProducts">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="categoryCarouselSection">
      <h5 className="productSectionTitle">{title}</h5>
      <div className="categoryCarouselsContainer">
        {CATEGORIES.map((category) => {
          const products = categorySections[category] || [];

          // ✅ EMPTY STATE
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
                    if (el) carouselRefs.current[category] = el;
                  }}
                >
                  {products.map((product) => (
                    <div key={product._id} className="carouselItem">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

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
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
