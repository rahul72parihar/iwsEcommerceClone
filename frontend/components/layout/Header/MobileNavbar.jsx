import { HiOutlineBars3 } from "react-icons/hi2";
import { VscSearch } from "react-icons/vsc";
import { CiHeart } from "react-icons/ci";
import { SlHandbag } from "react-icons/sl";
import Logo from "../../../assets/Logo";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toggleSidebar } from "../../../src/store/slices/uiSlice";

import MobileNavbarCategory from "./MobileNavbarCategory";
export default function MobileNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.ui.cartItems);

  return (
    <div className="mobileNav">
      <div className="mobileNavContainer">
        <div className="sidebarButton">
          <span className="mobileSidebarButtonIcon" onClick={() => dispatch(toggleSidebar())}>
            <HiOutlineBars3 />
          </span>
        </div>

        {/* Logo */}
        <div className="mobileNavLogoWrapper" onClick={() => navigate('/')}>
          <Logo className="mobileNavLogo" />
        </div>

        {/* Right Icons */}
        <div className="mobileNavIcons">
          <span className="icon">
            <VscSearch />
          </span>
          <span className="icon" onClick={() => navigate('/wishlist')}>
            <CiHeart />
          </span>
          <span className="icon cartIconMobile" style={{position: 'relative'}} onClick={() => navigate('/cartpage')}>
            <SlHandbag />
            {cartItems > 0 && (
              <span className="cartBadgeMobile" style={{
                position: 'absolute',
                top: -6,
                right: -6,
                background: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                width: 16,
                height: 16,
                fontSize: 10,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartItems}
              </span>
            )}
          </span>
        </div>

      </div>
      <MobileNavbarCategory/>
    </div>
  );
}
