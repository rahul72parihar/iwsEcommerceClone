import { useLocation } from "react-router-dom";
import "../styles/App.css";
import HeroCarousel from "../components/HeroCaraousel";
import ProductSection from "../components/ProductSection";

export default function CategoryPage() {
  const location = useLocation();
  const activeCategory = location.pathname.split('/')[1]?.toUpperCase() || 'CATEGORY';

  return (
    <main className="categoryMain">
      <HeroCarousel category={activeCategory} />
      <ProductSection title={`Products in ${activeCategory}`} category={activeCategory} />
    </main>
  );
}

