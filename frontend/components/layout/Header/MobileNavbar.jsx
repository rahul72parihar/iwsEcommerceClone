import { HiOutlineBars3 } from "react-icons/hi2";
import { VscSearch } from "react-icons/vsc";
import { CiHeart } from "react-icons/ci";
import { SlHandbag } from "react-icons/sl";
import logo from "../../../assets/logo.webp";
export default function MobileNavbar() {
  return (
    <div className="mobileNav">
      <div className="mobileNavContainer">
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
        <div className="mobileNavIcons">
          <span className="icon">
            <VscSearch />
          </span>
          <span className="icon">
            <CiHeart />
          </span>
          <span className="icon">
            <SlHandbag />
          </span>
        </div>
      </div>
    </div>
  );
}
