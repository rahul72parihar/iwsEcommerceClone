import { useLocation, useNavigate } from "react-router-dom";
const categoriesList = ["MEN", "WOMEN", "SHOES"];
import "../styles/CategoriesSection.css";

export default function CategoriesSection() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveCategory = () => {
    const path = location.pathname.slice(1).toUpperCase();
    return categoriesList.find(cat => cat === path) || null;
  };

  const activeCategory = getActiveCategory();

  const handleCategoryClick = (cat) => {
    navigate(`/${cat.toLowerCase()}`);
  };

  return (
    <div className="categoriesSection">
      <h2 className="categoriesTitle">
        {activeCategory ? `Shop ${activeCategory}` : "Shop by Category"}
      </h2>
      <div className="categoriesGrid">
        {categoriesList.map((cat) => (
          <div
            key={cat}
            className={`categoryCard ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            <span className="categoryName">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

