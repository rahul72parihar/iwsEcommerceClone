import Header from "../components/layout/Header/Header";
import HeroCarousel from "../components/HeroCaraousel";

export default function Homepage() {
  return (
    <div className="homePage">
      <Header />
      <HeroCarousel />
      <div className="longlong"></div>
      {/* <CategoriesSection />
      <ProductSection title="New Arrivals" />
      <OfferBanner />
      <ProductSection title="Best Sellers" />
      <Footer /> */}
    </div>
  );
}
