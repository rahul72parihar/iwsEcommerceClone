import { useState, useEffect, useRef } from "react";
import { apiService } from "../services/api.js";
import ProductCard from "./ProductCard";
import "../styles/CategoryCarousel.css";
import "../styles/ProductSection.css";

const CATEGORIES = ['MEN', 'WOMEN', 'SHOES'];
const ITEM_WIDTH = 300;
const SCROLL_AMOUNT = ITEM_WIDTH + 24; // item + gap

export default function CategoryCarousel({ title = "Featured by Category" }) {
  const [categorySections, setCategorySections] = useState({});
  const carouselRefs = useRef({});

  const scrollCarousel = (category, direction) => {
    const ref = carouselRefs.current[category];
    if (!ref) return;

    const scrollLeft = direction === 'left';
    const currentScroll = ref.scrollLeft;
    const maxScroll = ref.scrollWidth - ref.clientWidth;
    
    if (scrollLeft) {
      if (currentScroll <= 0) {
        ref.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        ref.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
      }
    } else {
      if (currentScroll >= maxScroll) {
        ref.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        ref.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const promises = CATEGORIES.map(cat => apiService.getProducts(cat, 5));
      const responses = await Promise.all(promises);
      const sections = {};
      CATEGORIES.forEach((cat, i) => {
        sections[cat] = responses[i].data;
      });
      setCategorySections(sections);
    };

    fetchCategoriesData();
  }, []);

  return (
    <section className="categoryCarouselSection">
      <h5 className="productSectionTitle">{title}</h5>
      <div className="categoryCarouselsContainer">
        {CATEGORIES.map(category => {
          const products = categorySections[category] || [];

          return (
            <div key={category} className="categoryCarouselWrapper">
              <h3 className="categoryTitle">{category}</h3>
              <div className="carouselContainer">
                <div className="categoriesCarousel" ref={el => {
                  if (el) carouselRefs.current[category] = el;
                }}>
                  {products.map((product) => (
                    <div key={product.id} className="carouselItem">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
                <button 
                  className="carouselArrow left" 
                  onClick={() => scrollCarousel(category, 'left')}
                >
                  ‹
                </button>
                <button 
                  className="carouselArrow right" 
                  onClick={() => scrollCarousel(category, 'right')}
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

