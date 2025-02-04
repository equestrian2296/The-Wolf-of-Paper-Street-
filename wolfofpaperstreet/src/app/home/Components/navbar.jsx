"use client"; // Mark this as a client component

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./navbar.css";

const Navbar = ({ position = "bottom" }) => {
  const [open, setOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();

  const toggleMenu = () => setOpen((prev) => !prev);
  const toggleProfile = () => setIsProfileOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/landing");
  };

  return (
    <nav className={`radial-container ${position}`}>
      <button className="menu-button" onClick={toggleMenu} aria-label="Toggle Menu">
        🐺
      </button>
      <div className={`radial-menu ${open ? "open" : ""}`}>
        <button className="menu-item" onClick={() => router.push("/")} aria-label="Home">🏠</button>
        <button className="menu-item" onClick={() => router.push("/usa-market")} aria-label="USA Market">🇺🇸</button>
        <button className="menu-item" onClick={() => router.push("/indian-stocks")} aria-label="Indian Stocks">🇮🇳</button>
        <button className="menu-item" onClick={() => router.push("/news")} aria-label="News">📰</button>
        <button className="menu-item profile" ref={profileRef} onClick={toggleProfile} aria-label="Profile">👤</button>
      </div>
      {isProfileOpen && (
        <div className="profile-dropdown">
          <button className="dropdown-item" onClick={handleLogout}>Logout</button>
          <a className="dropdown-item" href="/user-details">User Details</a>
          <a className="dropdown-item" href="/stocks-portfolio">Stocks Portfolio</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
