import React, { useState } from "react";

export default function MobileNavbarCategory() {
  const [active, setActive] = useState("MEN");
  const categories = ["MEN", "WOMEN", "SHOES"];
  return (
    <div className="mobileNavbarCategory">
      {categories.map((cat) => (
        <div
          key={cat}
          className={`categoryItem ${active === cat ? "active" : ""}`}
          onClick={() => setActive(cat)}
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
