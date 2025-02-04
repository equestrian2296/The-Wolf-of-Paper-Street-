"use client";
import React, { useState } from "react";
import Navbar from "./Components/navbar"; // Ensure this path is correct
import StockScroller from "./Components/home";
import StockList from "./Components/stocklist";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

const HomePage = () => {
  const [userData] = useState({
    name: "John Doe",
    avatar: "https://via.placeholder.com/80",
    balance: "10,000",
    profit: "1,250",
    wishlist: ["AAPL", "GOOGL", "TSLA"],
  });

  const [dailyStreak] = useState([
    { day: "Mon", streak: 1 },
    { day: "Tue", streak: 2 },
    { day: "Wed", streak: 4 },
    { day: "Thu", streak: 5 },
    { day: "Fri", streak: 6 },
    { day: "Sat", streak: 7 },
    { day: "Sun", streak: 8 },
  ]);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-6 pb-20"> {/* Add padding-bottom to avoid overlap with navbar */}
      {/* Main content */}
      <div>
        {/* Stock Scroller */}
        <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg border-2 border-green-400 shadow-lg mb-6">
          <StockScroller />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Stock List */}
          <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg border-2 border-pink-400 shadow-lg">
            <StockList />
          </div>

          {/* User Profile - Resized */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-yellow-400 shadow-lg flex flex-col items-center w-full max-w-xs mx-auto">
            <img src={userData.avatar} alt="User Avatar" className="rounded-full w-16" />
            <h2 className="mt-2">{userData.name}</h2>
            <p className="text-green-400">Balance: ${userData.balance}</p>
          </div>

          {/* Daily Streak */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-orange-400 shadow-lg w-full">
            <h3 className="text-lg">Daily Streak</h3>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={dailyStreak}>
                <XAxis dataKey="day" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Line type="monotone" dataKey="streak" stroke="#00ffea" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Floating Buttons */}
        <div className="fixed bottom-24 left-10 right-10 flex justify-between">
          {/* Updated button */}
          <Link href="/backtest">
            <button className="bg-purple-600 text-white px-5 py-3 rounded-lg shadow-lg border-2 border-purple-400 hover:bg-purple-800">
              Trade in Past
            </button>
          </Link>
          <Link href="/stock/AAPL">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg border-2 border-green-400 hover:bg-green-700">
              Go Trade
            </button>
          </Link>
        </div>
      </div>

      {/* Footer Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-3 text-center border-t-2 border-blue-400 shadow-lg">
        <Navbar />
      </div>
    </div>
  );
};

export default HomePage;
