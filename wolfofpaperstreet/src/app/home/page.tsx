import React from "react";
import Navbar from "./Components/navbar"; // Import the Navbar component
import StockScroller from "./Components/home";
import "./App.css";
import StockList from "./Components/stocklist";
import Link from "next/link";

import YouTubeCarousel from "./Components/YoutubeCarsouel";
function homePage() {
  return (
    <div className="app-container">
      <Navbar /> {/* Navbar stays at the top */}
      
      <div className="main-content">
      <div className="stock-scroller-container">
          <StockScroller /> {/* Stock scroller component */}
        </div>
        <div className="stock-list-container">
          <StockList /> {/* Stock list component */}
        </div>
        <h1> Reccomendeed Videos for watching</h1>
        <YouTubeCarousel />
        
       
        <Link href="/stock/AAPL" > View Charts and Buy Page</Link> {/* Login link */}
      </div>
    </div>
  );
}

export default homePage;
