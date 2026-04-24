import { useState } from "react";
import Logo from "../../../assets/Logo";
import { HiOutlineBars3 } from "react-icons/hi2";
import { FiSearch, FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import { BsMic } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toggleSidebar } from "../../../src/store/slices/uiSlice";

export default function DesktopNavbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.ui.cartItems);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const categories = ["MEN", "WOMEN", "SHOES"];
  const adminLinks = [
    { label: "PRODUCT", path: "/admin" },
    { label: "BANNER", path: "/admin/banners" },
    { label: "ORDERS", path: "/admin/orders" },
  ];

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${q}`);
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="desktopNav">
      <div className="desktopNavContainer">
        {/* Left */}
        <div className="desktopNavLeft">
          <span
            className="sidebarButtonIcon"
            onClick={() => dispatch(toggleSidebar())}
          >
            <HiOutlineBars3 />
          </span>
          <div className="desktopCategories">
            {isAdmin
              ? adminLinks.map((link) => (
                  <span
                    key={link.label}
                    className="categoryItem"
                    onClick={() => navigate(link.path)}
                    style={{ cursor: "pointer" }}
                  >
                    {link.label}
                  </span>
                ))
              : categories.map((cat) => (
                  <span
                    key={cat}
                    className="categoryItem"
                    onClick={() => navigate(`/${cat.toLowerCase()}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {cat}
                  </span>
                ))}
          </div>
        </div>

        {/* Center Logo (wrap it!) */}
        <div
          className="desktopNavCenter"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <Logo className="desktopLogo" />
        </div>

        {/* Right Side */}
        <div className="desktopNavRight">
          {/* Search Bar */}
          <div className="searchBar">
            <input
              type="text"
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <div className="searchIcons">
              <BsMic />

              {/* 🔥 Click search */}
              <FiSearch onClick={handleSearch} />
            </div>
          </div>

          {/* Action Icons */}
          <div className="navIcons">
            <FiUser
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            />
            <div
              className="cartIconWrapper"
              onClick={() => navigate("/cartpage")}
              style={{ cursor: "pointer", position: "relative", display: "inline-block" }}
            >
              <FiShoppingCart />
              {cartItems > 0 && (
                <span
                  className="cartBadge"
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    background: "#ff4444",
                    color: "white",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    fontSize: 12,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 20,
                  }}
                >
                  {cartItems}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
