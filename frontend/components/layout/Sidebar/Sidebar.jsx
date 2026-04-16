import React, { useState, useEffect } from "react";
import "../../../styles/Sidebar.css";

// useEffect(() => {
//   document.body.classList.toggle("no-scroll", open);
// }, [open]);

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [open]);
  console.log(document.body.classList);
  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="sidebarOverlay" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${open ? "active" : ""}`}>
        <button className="sidebarCloseBtn" onClick={() => setOpen(false)}>
          ✕
        </button>

        {/* EMPTY FOR NOW */}
        <div className="sidebar-content">
          {/* Add stuff later */}
          <div className="longlong"></div>
        </div>
      </div>
    </>
  );
}
