import { useParams, useLocation } from "react-router-dom";
import Header from "../components/layout/Header/Header";
import "../styles/App.css";
// Removed CategoriesSection as per navbar/header
import ProductSection from "../components/ProductSection";
import Footer from "../components/layout/Footer";

export default function CategoryPage() {
  const { category } = useParams();
  const location = useLocation();
  const activeCategory = location.pathname.split('/')[1]?.toUpperCase() || 'CATEGORY';

  return (
    <div className="categoryPage">
      <Header />
      <main className="categoryMain">
        <ProductSection title={`Products in ${activeCategory}`} category={activeCategory} />
      </main>
      <Footer />
    </div>
  );
}

