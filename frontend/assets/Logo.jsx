import logosrc from "./iwslogo.png";

function Logo({ className }) {
  return (
    <div className="desktopNavCenter">
      <img src={logosrc} alt="Logo" className={className} />
    </div>
  );
}

export default Logo;
