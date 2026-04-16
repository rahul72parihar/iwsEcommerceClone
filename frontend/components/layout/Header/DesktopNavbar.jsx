
import logo from "../../../assets/logo.webp";
import { HiOutlineBars3 } from "react-icons/hi2";
export default function DesktopNavbar() {
  console.log("Desktop Navbar rendered");
  return (
        <div className="DesktopNav">
          <div className="desktopNavContainer">
            <div className="sidebarButton">
              <span className="sidebarButtonIcon">
                <HiOutlineBars3 />
              </span>
            </div>
    
            {/* Logo */}
            <div>
              <img
                className="mobileNavLogo"
                src={logo}
                alt="logo of souled store"
              />
            </div>
    
            {/* Right Icons */}
            <div className="DesktopNavRight">
            </div>
          </div>
        </div>
  );
}
