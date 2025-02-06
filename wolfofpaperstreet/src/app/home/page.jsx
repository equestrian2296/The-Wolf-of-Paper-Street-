"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase";
import Navbar from "./Components/navbar";
import StockScroller from "./Components/home";
import StockList from "./Components/stocklist";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyStreak] = useState([
    { day: "Mon", streak: 1 },
    { day: "Tue", streak: 2 },
    { day: "Wed", streak: 4 },
    { day: "Thu", streak: 5 },
    { day: "Fri", streak: 6 },
    { day: "Sat", streak: 7 },
    { day: "Sun", streak: 8 },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) alert("User not logged in!");

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        console.log("No such user found!");
      }

      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-6">
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

        {/* User Profile */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-yellow-400 shadow-lg flex flex-col items-center w-full max-w-xs mx-auto h-full justify-between">
          {/* User Logo - Positioned at the top */}
          <div className="w-full flex justify-center">
            <Image
              src="/logo.png"
              alt="User Logo"
              width={80}
              height={80}
              className="mb-4"
            />
          </div>

          {/* User Info - Positioned at the bottom */}
          {userData && (
            <div className="text-center w-full">
              <h2 className="text-xl font-semibold text-white animate-pulse" style={{ textShadow: "0 0 10px #FFD700" }}>
                {userData.name}
              </h2>
              <p className="text-green-400 mt-2 text-lg">
                Balance: ₹{parseFloat(userData.balance).toFixed(2)}
              </p>
            </div>
          )}
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
      <div className="fixed bottom-24 left-10 right-10 flex justify-between px-4">
        <Link href="/backtest">
          <button className="bg-purple-600 text-white text-lg px-8 py-4 rounded-lg shadow-lg border-2 border-purple-400 hover:bg-purple-800 w-48 h-16 flex justify-center items-center">
            Trade in Past
          </button>
        </Link>

        <Link href="/stocks">
          <button className="bg-green-500 text-white text-lg px-8 py-4 rounded-lg shadow-lg border-2 border-green-400 hover:bg-green-700 w-48 h-16 flex justify-center items-center">
            Go Trade
          </button>
        </Link>
      </div>

      {/* Footer Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-3 text-center border-t-2 border-blue-400 shadow-lg">
        <Navbar />
      </div>
    </div>
  );
};

export default HomePage;
