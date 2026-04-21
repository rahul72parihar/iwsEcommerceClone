import "../styles/App.css";

import { Routes, Route, Outlet } from "react-router-dom";

import Header from "../components/layout/Header/Header";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import Footer from "../components/layout/Footer";
import Toast from "../components/Toasts/Toast";

import Homepage from "../pages/Homepage";
import Cartpage from "../pages/Cartpage";
import CheckoutPage from "../pages/CheckoutPage";
import WishlistPage from "../pages/WishlistPage";
import ProfilePage from "../pages/ProfilePage";
import CategoryPage from "../pages/CategoryPage";
import ProductDetail from "../pages/ProductDetail";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";


function Layout() {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Sidebar />
        <Outlet />
      </div>
      <Footer />
      <Toast />
    </div>
  );
}


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/cartpage" element={<Cartpage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/men" element={<CategoryPage />} />
        <Route path="/women" element={<CategoryPage />} />
        <Route path="/shoes" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;

