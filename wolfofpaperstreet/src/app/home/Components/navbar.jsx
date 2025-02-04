"use client"; // Mark this as a client component

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // For redirection in Next.js
import "./navbar.css";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter(); // Next.js router for navigation

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
    // Remove user session (modify this based on your auth setup)
    localStorage.removeItem("authToken"); // Remove token if stored
    localStorage.removeItem("user"); // Remove user info if stored

    // Redirect to login or home page
    router.push("/landing"); // Update to your actual login page route
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="company-name">
          The Wolf of Paper Street
        </a>
      </div>

      <div className="navbar-center">
        <a href="/usa-market">USA Market</a>
        <a href="/indian-stocks">Indian Stocks</a>
        <a href="/news">News</a>
      </div>

      <div className="navbar-right" ref={profileRef}>
        <div
          className="profile-icon"
          onClick={toggleProfile}
          role="button"
          tabIndex="0"
        >
          <img src="/path-to-profile-image.jpg" alt="Profile" />
        </div>

        {isProfileOpen && (
          <div className="profile-dropdown">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <a href="/user-details">User Details</a>
            <a href="/stocks-portfolio">Stocks Portfolio</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
