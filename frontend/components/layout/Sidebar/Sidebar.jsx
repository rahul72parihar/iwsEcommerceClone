import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, closeSidebar, setCartCount } from "../../../src/store/slices/uiSlice";
import { logout } from "../../../src/store/slices/authSlice";
import { Link } from "react-router-dom";

import "../../../styles/Sidebar.css";

export default function Sidebar() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isSidebarOpen);
  const cartItems = useSelector((state) => state.ui.cartItems);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);


  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const handleClose = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="sidebarOverlay" onClick={handleClose} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <button className="sidebarCloseBtn" onClick={handleClose}>
          ✕
        </button>

        <div className="sidebar-content">
          {/* Categories */}
          <div className="sidebar-section">
            <h3>Shop by Category</h3>
            <ul className="category-list">
              <li><Link to="/men" onClick={handleClose}>MEN</Link></li>
              <li><Link to="/women" onClick={handleClose}>WOMEN</Link></li>
              <li><Link to="/shoes" onClick={handleClose}>SHOES</Link></li>
            </ul>
          </div>

          {/* Cart */}
          <div className="sidebar-section">
            <Link to="/cartpage" className="cart-link" onClick={handleClose}>
              Cart ({cartItems})
            </Link>
          </div>

          {/* Auth Section */}
          <div className="sidebar-section">
            {!isAuthenticated ? (
              <Link to="/login" className="login-link" onClick={handleClose}>
                Sign In
              </Link>
            ) : (
              <button className="logout-btn" onClick={() => {
                dispatch(logout());
                handleClose();
              }}>
                Sign Out
              </button>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

