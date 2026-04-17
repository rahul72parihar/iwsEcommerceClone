import { HiOutlineBars3 } from "react-icons/hi2";
import { VscSearch } from "react-icons/vsc";
import { CiHeart } from "react-icons/ci";
import { SlHandbag } from "react-icons/sl";
import Logo from "../../../assets/Logo";
import MobileNavbarCategory from "./MobileNavbarCategory";
export default function MobileNavbar() {
  return (
    <div className="mobileNav">
      <div className="mobileNavContainer">
        <div className="sidebarButton">
          <span className="mobileSidebarButtonIcon" onClick={()=>console.log("Sidebar Clicked")}>
            <HiOutlineBars3 />
          </span>
        </div>

        {/* Logo */}
        <Logo className="mobileNavLogo"/>
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
      <MobileNavbarCategory/>
    </div>
  );
}
