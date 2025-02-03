"use client"; // Ensure this is a client component in Next.js

import React from "react";
import { motion } from "framer-motion";
import "./home.css";

const stockData = [
  { name: "Nifty 50", value: "23,361.05 INR", change: "-0.52%" },
  { name: "Sensex", value: "77,194.41 INR", change: "-0.40%" },
  { name: "BSE LargeCap", value: "8,980.83 INR", change: "-0.65%" },
  { name: "BSE MidCap", value: "42,515.64 INR", change: "-0.86%" },
];

const StockScroller = () => {
  return (
    <div className="stock-scroller">
      <motion.div
        className="stock-container"
        animate={{
          x: [0, -1000], // Adjusted for a smoother infinite loop
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        }}
      >
        {[...stockData, ...stockData].map((stock, index) => (
          <div key={index} className="stock-item">
            <span className="stock-name">{stock.name}</span>
            <span className="stock-value">{stock.value}</span>
            <span
              className={`stock-change ${
                stock.change.includes("-") ? "negative" : "positive"
              }`}
            >
              {stock.change}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default StockScroller;
