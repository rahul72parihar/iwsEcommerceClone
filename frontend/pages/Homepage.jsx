import Header from "../components/layout/Header/Header";
import HeroCarousel from "../components/HeroCaraousel";
import Sidebar from "../components/layout/Sidebar/Sidebar";
export default function Homepage() {
  return (
    <div className="homePage">
      <Header />
      <HeroCarousel />
      <Sidebar />
      <div className="longlong"></div>
      {/* <CategoriesSection />
      <ProductSection title="New Arrivals" />
      <OfferBanner />
      <ProductSection title="Best Sellers" />
      <Footer /> */}
    </div>
  );
}
