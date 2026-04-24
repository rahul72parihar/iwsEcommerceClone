import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MobileNavbarCategory() {
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [active, setActive] = useState("MEN");
  const categories = ["MEN", "WOMEN", "SHOES"];
  const adminLinks = [
    { label: "PRODUCT", path: "/admin" },
    { label: "BANNER", path: "/admin/banners" },
    { label: "ORDERS", path: "/admin/orders" },
  ];

  if (isAdmin) {
    return (
      <div className="mobileNavbarCategory">
        {adminLinks.map((link) => (
          <div
            key={link.label}
            className={`categoryItem ${active === link.label ? "active" : ""}`}
            onClick={() => {
              setActive(link.label);
              navigate(link.path);
            }}
          >
            {link.label}
          </div>
        ))}

        <style>{`
          .mobileNavbarCategory {
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 50px;
            background: white;
            border-top: 1px solid #ddd;
            z-index: 1000;
          }

          .categoryItem {
            flex: 1;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: 0.2s;
          }

          .categoryItem:hover {
            color: red;
          }

          .active {
            color: red;
            font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="mobileNavbarCategory">
      {categories.map((cat) => (
        <div
          key={cat}
          className={`categoryItem ${active === cat ? "active" : ""}`}
          onClick={() => {
            setActive(cat);
            navigate(`/${cat.toLowerCase()}`);
          }}
        >
          {cat}
        </div>
      ))}

      <style>{`
        .mobileNavbarCategory {
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 50px;
          background: white;
          border-top: 1px solid #ddd;
          z-index: 1000;
        }

        .categoryItem {
          flex: 1;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
        }

        .categoryItem:hover {
          color: red;
        }

        .active {
          color: red;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

