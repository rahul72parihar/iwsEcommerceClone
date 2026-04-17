import Header from "../components/layout/Header/Header";
import HeroCarousel from "../components/HeroCaraousel";
import TrendingSection from "../components/TrendingSection";
import CategoryCarousel from "../components/CategoryCarousel";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import Footer from "../components/layout/Footer";
export default function Homepage() {
  return (
    <div className="homePage">
      <Header />
      <HeroCarousel />
      <TrendingSection />
      <CategoryCarousel title="Shop By Category" />
      <Sidebar />
      <div className="longlong"></div>
      {/* <CategoriesSection />
      <ProductSection title="New Arrivals" />
      <OfferBanner />
      <ProductSection title="Best Sellers" /> */}
      <Footer />
    </div>
  );
}
