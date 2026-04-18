import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, closeSidebar } from "../../../src/store/slices/uiSlice";
import "../../../styles/Sidebar.css";

export default function Sidebar() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isSidebarOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const handleClose = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="sidebarOverlay" onClick={handleClose} />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <button className="sidebarCloseBtn" onClick={handleClose}>
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
