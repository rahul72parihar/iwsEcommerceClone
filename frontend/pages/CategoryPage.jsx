import { useLocation } from "react-router-dom";
import "../styles/App.css";
import ProductSection from "../components/ProductSection";

export default function CategoryPage() {
  const location = useLocation();
  const activeCategory = location.pathname.split('/')[1]?.toUpperCase() || 'CATEGORY';

  return (
    <main className="categoryMain">
      <ProductSection title={`Products in ${activeCategory}`} category={activeCategory} />
    </main>
  );
}

