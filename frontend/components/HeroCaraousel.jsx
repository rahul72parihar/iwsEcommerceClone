import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../services/api";
import "../styles/HeroCaraousel.css";
import "../styles/SkeletonShared.css";

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

  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (isLoading) {
    return (
      <section className="hero hero--skeleton" aria-busy="true">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-skeleton-title skeleton-box skeleton-rounded" />
        </div>
        <div className="hero-skeleton-dots">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="dot" />
          ))}
        </div>
      </section>
    );
  }
  if (!banners?.length)
    return (
      <section className="hero hero--skeleton" aria-busy="true">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-skeleton-title skeleton-box skeleton-rounded" />
        </div>
        <div className="hero-skeleton-dots">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="dot" />
          ))}
        </div>
      </section>
    );

  const current = banners[index];
  const linkTarget = current?.link || "/";

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${current?.image})` }}
    >
      <div className="hero-overlay" />
      {/* ONLY content is clickable */}
      <Link className="hero-link" to={linkTarget}>
        <div className="hero-content">
          <h1>{current?.title}</h1>
        </div>
      </Link>

      {/* Arrows (not inside Link) */}
      <button
        type="button"
        className="arrow left"
        onClick={() => setIndex(index === 0 ? banners.length - 1 : index - 1)}
      >
        ❮
      </button>

      <button
        type="button"
        className="arrow right"
        onClick={() => setIndex((index + 1) % banners.length)}
      >
        ❯
      </button>

      {/* Dots (not inside Link) */}
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
