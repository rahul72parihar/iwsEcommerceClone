import { useEffect, useState } from "react";
import { apiService } from "../services/api";
import "../styles/HeroCaraousel.css";
export default function HeroCarousel({ category = null }) {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const response = category 
          ? await apiService.getCategoryBanners(category)
          : await apiService.getAllBanners();

        setBanners(response?.data || []);
      } catch (err) {

        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, [category]);

  if (isLoading) {
    return <>Loading Banner</>;
  }
  if (!banners?.length) return <div>No banners available</div>;

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${banners[index]?.image})`,
      }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>{banners[index]?.title}</h1>
        <p>{category || 'Featured'} Collection</p>
        <button>Shop {category || 'Now'}</button>
      </div>

      {/* Arrows */}
      <button
        className="arrow left"
        onClick={() => setIndex(index === 0 ? banners.length - 1 : index - 1)}
      >
        ❮
      </button>

      <button
        className="arrow right"
        onClick={() => setIndex((index + 1) % banners.length)}
      >
        ❯
      </button>

      {/* Dots */}
      <div className="dots">
        {banners.map((_, i) => (
          <span
            key={i}
            className={i === index ? "dot active" : "dot"}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
