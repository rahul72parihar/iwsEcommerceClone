import HeroCarousel from "../components/HeroCaraousel";
import TrendingSection from "../components/TrendingSection";
import CategoryCarousel from "../components/CategoryCarousel";

export default function Homepage() {
  return (
    <>
      <HeroCarousel />
      <TrendingSection />
      <CategoryCarousel />
      {/* <CategoriesSection />
      <ProductSection title="New Arrivals" />
      <OfferBanner />
      <ProductSection title="Best Sellers" /> */}
    </>
  );
}
