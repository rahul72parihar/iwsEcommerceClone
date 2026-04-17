import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="productCard">
      <div className="productImage">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className="productInfo">
        <h3 className="productTitle">{product.title}</h3>
        <p className="productPrice">${product.price}</p>
      </div>
    </Link>
  );
}

