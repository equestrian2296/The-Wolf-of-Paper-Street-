"use client"; // Mark this as a client component

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./navbar.css";

const navbar = ({ position = "bottom" }) => {
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
    console.log("Logging out...");

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setIsProfileOpen(false); // Ensure dropdown closes
    setTimeout(() => {
      router.push("/landing"); // Redirect to landing page after logout
    }, 100);
  };

  return (
    <nav className={`radial-container ${position}`}>
      <button className="menu-button" onClick={toggleMenu} aria-label="Toggle Menu">
        🐺
      </button>

      <div className={`radial-menu ${open ? "open" : ""}`}>
        <button className="menu-item" onClick={() => router.push("/")} aria-label="Home">🏠</button>
        <button className="menu-item" onClick={() => router.push("/stocks")} aria-label="USA Market">🇺🇸</button>
        <button className="menu-item" onClick={() => router.push("/stocks")} aria-label="Indian Stocks">🇮🇳</button>
        <button className="menu-item" onClick={() => router.push("/news")} aria-label="News">📰</button>
        <button className="menu-item profile" ref={profileRef} onClick={toggleProfile} aria-label="Profile">👤</button>
      </div>

      {isProfileOpen && (
        <div className="profile-dropdown" ref={profileRef}>
          <button className="dropdown-item" onClick={handleLogout}>Logout</button>
          <button className="dropdown-item" onClick={() => {
            setIsProfileOpen(false);
            router.push("/user-details");
          }}>User Details</button>
          <button className="dropdown-item" onClick={() => {
            setIsProfileOpen(false);
            router.push("/stocks-portfolio");
          }}>Stocks Portfolio</button>
        </div>
      )}
    </nav>
  );
};

export default navbar;
