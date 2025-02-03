import React from "react";
import StockItem from "./stockItem";
import { stockData } from "../data/stockdata";

const StockList = () => {
  return (
    <div className="stock-container">
      {/* Largest Daily Growth Section */}
      <div className="growth-section">
        <h2>Largest Daily Growth</h2>
        {stockData.largestDailyGrowth.map((stock, index) => (
          <StockItem key={index} stock={stock} type="positive" />
        ))}
        <a href="#">See all stocks with largest daily growth</a>
      </div>

      {/* Largest Daily Drop Section */}
      <div className="drop-section">
        <h2>Largest Daily Drop</h2>
        {stockData.largestDailyDrop.map((stock, index) => (
          <StockItem key={index} stock={stock} type="negative" />
        ))}
        <a href="#">See all stocks with largest daily drop</a>
      </div>
    </div>
  );
};

export default StockList;
