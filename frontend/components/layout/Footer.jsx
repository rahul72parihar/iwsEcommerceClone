import { FaFacebookF, FaInstagram, FaSnapchatGhost } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerTop">

        {/* Column 1 */}
        <div className="footerCol">
          <h4>NEED HELP</h4>
          <p>Contact Us</p>
          <p>Track Order</p>
          <p className="highlight">Returns & Refunds</p>
          <p>FAQs</p>
          <p>My Account</p>

          <div className="footerIcons">
            <span><FaRupeeSign /> COD Available</span>
            <span><MdRefresh /> 30 Days Easy Returns</span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="footerCol">
          <h4>COMPANY</h4>
          <p>About Us</p>
          <p>Investor Relation</p>
          <p>Careers</p>
          <p>Gift Vouchers</p>
          <p>Community Initiatives</p>
        </div>

        {/* Column 3 */}
        <div className="footerCol">
          <h4>MORE INFO</h4>
          <p>T&C</p>
          <p>Privacy Policy</p>
          <p>Sitemap</p>
          <p>Get Notified</p>
          <p>Blogs</p>
        </div>

        {/* Column 4 */}
        <div className="footerCol">
          <h4>STORE NEAR ME</h4>
          <p>Mumbai</p>
          <p>Pune</p>
          <p>Bangalore</p>
          <p>Anand</p>
          <p className="link">View More</p>
        </div>
      </div>

      {/* App + Social */}
      <div className="footerMiddle">
        <p className="appText">EXPERIENCE THE APP</p>

        <div className="socials">
          <span>Follow Us:</span>
          <FaFacebookF />
          <FaInstagram />
          <FaSnapchatGhost />
          <FaXTwitter />
        </div>
      </div>

      {/* Bottom */}
      <div className="footerBottom">
        © 2026 YourStore
      </div>

      <style>{`
        .footer {
          background: #f5f5f5;
          padding: 40px 20px;
          font-family: sans-serif;
        }

        .footerTop {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .footerCol h4 {
          color: red;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .footerCol p {
          font-size: 13px;
          margin: 6px 0;
          cursor: pointer;
          color: #333;
        }

        .footerCol p:hover {
          color: red;
        }

        .highlight {
          color: red;
          font-weight: 600;
        }

        .link {
          color: blue;
        }

        .footerIcons span {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          margin-top: 8px;
        }

        .footerMiddle {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .socials {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 18px;
        }

        .footerBottom {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }

        /* 🔥 RESPONSIVE */
        @media (max-width: 768px) {
          .footerTop {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .footerTop {
            grid-template-columns: 1fr;
          }

          .footerMiddle {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}