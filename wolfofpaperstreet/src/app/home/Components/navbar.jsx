"use client"; // Mark this as a client component

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // For redirection in Next.js
import "./navbar.css";

const navbar = ({ position = "bottom" }) => {
  const [open, setOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/landing");
  };

  // Effect to add/remove blur class on body
  useEffect(() => {
    if (open) {
      document.body.classList.add("blur");
    } else {
      document.body.classList.remove("blur");
    }
  }, [open]);

  return (
    <div className={`radial-container ${position}`}>
      <button className="menu-button" onClick={toggleMenu}>
        🐺 {/* Wolf emoji */}
      </button>
      <div className={`radial-menu ${open ? "open" : ""}`}>
        <div className="menu-item" onClick={() => router.push("/")}>🏠</div>
        <div className="menu-item" onClick={() => router.push("/usa-market")}>🇺🇸</div>
        <div className="menu-item" onClick={() => router.push("/indian-stocks")}>🇮🇳</div>
        <div className="menu-item" onClick={() => router.push("/news")}>📰</div>
        <div className="menu-item profile" ref={profileRef} onClick={toggleProfile}>👤</div>
      </div>
      {isProfileOpen && (
        <div className="profile-dropdown">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <a href="/user-details">User  Details</a>
          <a href="/stocks-portfolio">Stocks Portfolio</a>
        </div>
      )}
    </div>
  );
};

export default navbar;