"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "./home.css";

const generateRandomStockData = () => [
  { name: "Nifty 50", value: getRandomStockValue(23000, 24000), change: getRandomChange() },
  { name: "Sensex", value: getRandomStockValue(76000, 78000), change: getRandomChange() },
  { name: "BSE LargeCap", value: getRandomStockValue(8500, 9500), change: getRandomChange() },
  { name: "BSE MidCap", value: getRandomStockValue(41000, 43000), change: getRandomChange() },
];

const getRandomStockValue = (min, max) =>
  `${(Math.random() * (max - min) + min).toFixed(2)} INR`;

const getRandomChange = () => {
  const change = (Math.random() * 2 - 1).toFixed(2);
  return `${change > 0 ? "+" : ""}${change}%`;
};

const StockScroller = () => {
  const [stockData, setStockData] = useState(generateRandomStockData());
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setStockData(generateRandomStockData());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stock-scroller">
      <motion.div
        className="stock-container"
        animate={{
          x: [0, -1000], // Continuous scrolling
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        }}
      >
        {[...stockData, ...stockData].map((stock, index) => (
          <div
            key={index}
            className="stock-item"
            onClick={() => router.push(`/stock/${stock.name.replace(/\s+/g, "").toLowerCase()}`)}
          >
            <span className="stock-name">{stock.name}</span>
            <span className="stock-value">{stock.value}</span>
            <span className={`stock-change ${stock.change.includes("-") ? "negative" : "positive"}`}>
              {stock.change}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default StockScroller;
