import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../services/api.js";

const MEN_SHIRT_IMAGE = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
import ProductCard from "./ProductCard";
import "../styles/ProductSection.css";

export default function ProductSection({ title = "Featured Products", category = null, limit = 12 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts(category, limit);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit]);

  if (loading) return <div className="productSection loading">Loading products...</div>;
  if (error) return <div className="productSection error">Error: {error}</div>;

  return (
    <section className="productSection">
      <div className="productSectionHeader">
        <h2 className="productSectionTitle">{title}</h2>
      </div>
      <div className="productsGrid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

