import { useEffect, useState } from "react";
import "../styles/HeroCaraousel.css"
export default function HeroCarousel() {
  const [banners, setBanners] = useState([
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    title: "Summer Sale",
    subtitle: "Up to 50% OFF"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    title: "New Arrivals",
    subtitle: "Fresh Drops Just Landed"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    title: "Streetwear Collection",
    subtitle: "Level Up Your Style"
  }
]);
  const [index, setIndex] = useState(0);

  // Fetch from API
//   useEffect(() => {
//     fetch("https://your-api.com/banners")
//       .then(res => res.json())
//       .then(data => setBanners(data))
//       .catch(err => console.log(err));
//   }, []);

//   // Auto slide
//   useEffect(() => {
//     if (banners.length === 0) return;

//     const interval = setInterval(() => {
//       setIndex(prev => (prev + 1) % banners.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [banners]);

//   if (banners.length === 0) return <div>Loading...</div>;

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${banners[index].image})`
      }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>{banners[index].title}</h1>
        <button>Shop Now</button>
      </div>

      {/* Arrows */}
      <button
        className="arrow left"
        onClick={() =>
          setIndex(index === 0 ? banners.length - 1 : index - 1)
        }
      >
        ❮
      </button>

      <button
        className="arrow right"
        onClick={() =>
          setIndex((index + 1) % banners.length)
        }
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