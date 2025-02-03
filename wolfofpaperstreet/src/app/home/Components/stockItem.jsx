import React from "react";
import "./stockItem.css";

const StockItem = ({ stock, type }) => {
  return (
    <div className="stock-item">
      <span className="stock-name">{stock.name}</span>
      <span className="stock-symbol">{stock.symbol}</span>
      <span className="stock-price">{stock.price}</span>
      <span className={`stock-change ${type}`}>{stock.change}</span>
    </div>
  );
};

export default StockItem;
