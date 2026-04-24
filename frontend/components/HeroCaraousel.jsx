import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        const response
         = category
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

  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (isLoading) {
    return <div className="hero-loading">Loading Banner…</div>;
  }
  if (!banners?.length) return <div className="hero-empty">No banners available</div>;

  const current = banners[index];
  const linkTarget = current?.link || "/";

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${current?.image})`,
      }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>{current?.title}</h1>
        <p>{category || 'Featured'} Collection</p>
        <Link to={linkTarget} className="hero-btn">
          Shop {category || 'Now'}
        </Link>
      </div>

      {/* Arrows */}
      <button
        type="button"
        className="arrow left"
        onClick={() => setIndex(index === 0 ? banners.length - 1 : index - 1)}
        aria-label="Previous banner"
      >
        ❮
      </button>

      <button
        type="button"
        className="arrow right"
        onClick={() => setIndex((index + 1) % banners.length)}
        aria-label="Next banner"
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
            role="button"
            aria-label={`Go to banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
