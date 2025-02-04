import React from "react";
import Navbar from "./Components/navbar"; // Import the Navbar component
import StockScroller from "./Components/home";
import "./App.css";
import StockList from "./Components/stocklist";
import Link from "next/link";

function homePage() {
  return (
    <div className="app-container">
      <Navbar /> {/* Navbar stays at the top */}
      
      <div className="main-content">
        <div className="stock-list-container">
          <StockList /> {/* Stock list component */}
        </div>
        
        <div className="stock-scroller-container">
          <StockScroller /> {/* Stock scroller component */}
        </div>
        <Link href="/stock/AAPL" >Login</Link> {/* Login link */}
      </div>
    </div>
  );
}

export default homePage;
