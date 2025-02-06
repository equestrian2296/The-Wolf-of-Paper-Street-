import React from "react";
import Link from "next/link";
import StockItem from "./stockItem";
import { stockData } from "../data/stockdata";
import './stockList.css';

const StockList = () => {
  return (
    <div className="stock-container">
      {/* Largest Daily Growth Section */}
      <div className="growth-section">
        <h2>Largest Daily Growth</h2>
        {stockData.largestDailyGrowth.map((stock, index) => (
          <Link key={index} href={`/stock/${stock.symbol}`} passHref>
            <StockItem stock={stock} type="positive" />
          </Link>
        ))}
      </div>

      {/* Largest Daily Drop Section */}
      <div className="drop-section">
        <h2>Largest Daily Drop</h2>
        {stockData.largestDailyDrop.map((stock, index) => (
          <Link key={index} href={`/stock/${stock.symbol}`} passHref>
            <StockItem stock={stock} type="negative" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StockList;
