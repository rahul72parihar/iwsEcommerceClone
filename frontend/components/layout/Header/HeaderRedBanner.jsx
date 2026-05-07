import { MdOutlinePhoneIphone } from "react-icons/md";
export default function HeaderRedBanner() {
  const openApp = () => {
    window.location.href = "https://play.google.com/store/apps/details?id=in.amazon.mShop.android.shopping&hl=en_IN";
  };
  return (
    <div className="headerBanner">
      <div className="headerBannerContainer">
        <p>Download Our App & Get 10% Additional Cashback On All Orders</p>

        <div className="headerBannerButton" onClick={openApp}>
          <MdOutlinePhoneIphone className="headerBannerIcon" />
          OPEN APP
        </div>
      </div>
    </div>
  );
}
