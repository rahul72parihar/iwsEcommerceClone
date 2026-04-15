import { MdOutlinePhoneIphone } from "react-icons/md";

export default function HeaderRedBanner() {
  return (
    <div className="headerBanner">
      <div className="headerBannerContainer">
        <p>Download Our App & Get 10% Additional Cashback On All Orders</p>
        <div className="headerBannerButton">
          <MdOutlinePhoneIphone className="headerBannerIcon" /> OPEN APP
        </div>
      </div>
    </div>
  );
}
