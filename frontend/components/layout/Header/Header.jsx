import { useEffect, useState } from "react";
import "../../../styles/Header.css";
import MobileNavbar from "./MobileNavbar";
import HeaderRedBanner from "./HeaderRedBanner";
import DesktopNavbar from "./DesktopNavbar";
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldScroll = window.scrollY > 53;

          setScrolled((prev) => {
            if (prev === shouldScroll) return prev; // prevents flicker
            return shouldScroll;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (

    <header className={`header ${scrolled ? "headerSmall" : ""}`}>
      {isMobile && <HeaderRedBanner /> }
      {isMobile && <MobileNavbar /> }
      {!isMobile && <DesktopNavbar /> }
    </header>

  );
}

export default Header;
