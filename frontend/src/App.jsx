import "../styles/App.css";

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from "react-router-dom";



import Header from "../components/layout/Header/Header";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import Footer from "../components/layout/Footer";
import Toast from "../components/Toasts/Toast";

import Homepage from "../pages/Homepage";
import Cartpage from "../pages/Cartpage";
import CheckoutPage from "../pages/CheckoutPage";

import ProfilePage from "../pages/ProfilePage";
import CategoryPage from "../pages/CategoryPage";
import ProductDetail from "../pages/ProductDetail";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SearchPage from "../pages/SearchPage";

import { loadUser } from "./store/slices/authSlice";
import { loadCart } from "./store/slices/uiSlice";



function Layout() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);


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
  const dispatch = useDispatch();
  const authLoading = useSelector(state => state.auth.loading);

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

useEffect(() => {
  dispatch(loadCart());
}, [isAuthenticated]);

  useEffect(() => {
    dispatch(loadUser());
  }, []);


  if (authLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/cartpage" element={<Cartpage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

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

