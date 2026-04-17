import { useState, useEffect } from "react";
import { apiService } from "../services/api.js";
import ProductCard from "./ProductCard";
import "../styles/CategoryCarousel.css"; // Reuse carousel styles
import "../styles/ProductSection.css"; // Reuse ProductCard styles

export default function TrendingSection() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const allProducts = await apiService.getAllProducts();
        const trending = allProducts.data.filter(p => p.trending).slice(0, 8);
        setTrendingProducts(trending);
      } catch (err) {
        console.error('Failed to fetch trending products');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return <div className="loading">Loading trending...</div>;

  return (
    <section className="trendingSection categoryCarouselSection">
      <h2 className="productSectionTitle">🔥 Trending Now</h2>
      <div className="categoriesCarousel">
        {trendingProducts.map((product) => (
          <div key={product.id} className="carouselItem">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

