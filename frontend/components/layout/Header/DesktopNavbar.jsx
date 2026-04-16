import { useState } from "react";
import Logo from "../../../assets/Logo";
import { HiOutlineBars3 } from "react-icons/hi2";
import { FiSearch, FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import { BsMic } from "react-icons/bs";

export default function DesktopNavbar() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;

    console.log("Searching for:", query);

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
          <span className="sidebarButtonIcon">
            <HiOutlineBars3 />
          </span>
        </div>

        {/* Center Logo (wrap it!) */}
        <div className="desktopNavCenter">
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
            <FiUser />
            <FiHeart />
            <FiShoppingCart />
          </div>

        </div>
      </div>
    </div>
  );
}