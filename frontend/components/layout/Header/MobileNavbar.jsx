import { HiOutlineBars3 } from "react-icons/hi2";
import { VscSearch } from "react-icons/vsc";
import { CiHeart } from "react-icons/ci";
import { SlHandbag } from "react-icons/sl";
import Logo from "../../../assets/Logo";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../../src/store/slices/uiSlice";
import MobileNavbarCategory from "./MobileNavbarCategory";
export default function MobileNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="mobileNav">
      <div className="mobileNavContainer">
        <div className="sidebarButton">
          <span className="mobileSidebarButtonIcon" onClick={() => dispatch(toggleSidebar())}>
            <HiOutlineBars3 />
          </span>
        </div>

        {/* Logo */}
        <Logo className="mobileNavLogo" style={{cursor: 'pointer'}} onClick={() => navigate('/')}/>
        {/* Right Icons */}
        <div className="mobileNavIcons">
          <span className="icon">
            <VscSearch />
          </span>
          <span className="icon" onClick={() => navigate('/wishlist')}>
            <CiHeart />
          </span>
          <span className="icon" onClick={() => navigate('/cartpage')}>
            <SlHandbag />
          </span>
        </div>
      </div>
      <MobileNavbarCategory/>
    </div>
  );
}
