import { useEffect, useState } from "react";
import "../../styles/Header.css";
import { MdOutlinePhoneIphone } from "react-icons/md";

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "headeSmall" : ""}`}>
      {/* Top Red Banner */}
      <div className="headerBanner">
        <div className="headerBannerContainer">
          <p>Download Our App & Get 10% Additional Cashback On All Orders</p>
          <div className="headerBannerButton">< MdOutlinePhoneIphone className="headerBannerIcon" /> OPEN APP</div>
        </div>
      </div>

      {/* Navbar */}
      <div className="header__nav">
        {/* Left Icon */}
        <div className="header__left">
          <span className="icon">←</span>
        </div>

        {/* Logo */}
        <div className="header__logo">
          <img src="/logo.png" alt="logo" />
        </div>

        {/* Right Icons */}
        <div className="header__right">
          <span className="icon">🔍</span>
          <span className="icon">♡</span>
          <span className="icon">🛍</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
