import { useState } from "react";
import Logo from "../../../assets/Logo";
import { HiOutlineBars3 } from "react-icons/hi2";
import { FiSearch, FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import { BsMic } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../../src/store/slices/uiSlice";

export default function DesktopNavbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = ["MEN", "WOMEN", "SHOES"];
  const handleSearch = () => {
    if (!query.trim()) return;



    // later you will:
    // navigate(`/search?q=${query}`)
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
          <span className="sidebarButtonIcon" onClick={() => dispatch(toggleSidebar())}>
            <HiOutlineBars3 />
          </span>
          <div className="desktopCategories">
    {categories.map((cat) => (
      <span 
        key={cat} 
        className="categoryItem"
        onClick={() => navigate(`/${cat.toLowerCase()}`)}
        style={{cursor: 'pointer'}}
      >
        {cat}
      </span>
    ))}
  </div>
        </div>

        {/* Center Logo (wrap it!) */}
        <div className="desktopNavCenter" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>
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
            <FiUser onClick={() => navigate('/profile')} style={{cursor: 'pointer'}} />
            <FiHeart onClick={() => navigate('/wishlist')} style={{cursor: 'pointer'}} />
            <FiShoppingCart onClick={() => navigate('/cartpage')} style={{cursor: 'pointer'}} />
          </div>

        </div>
      </div>
    </div>
  );
}
