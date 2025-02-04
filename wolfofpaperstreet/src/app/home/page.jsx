"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase"; // Ensure you have correct Firebase imports
import Navbar from "./Components/navbar";
import StockScroller from "./Components/home";
import StockList from "./Components/stocklist";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

const HomePage = () => {
  const [userData, setUserData] = useState(null); // Store user data
  const [isLoading, setIsLoading] = useState(true); // Loading state
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
      const user = auth.currentUser; // Get the currently logged-in user
      if (!user) alert("User not logged in!");

      const userRef = doc(db, "users", user.uid); // Reference to Firestore document
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data()); // Set user data from Firestore
      } else {
        console.log("No such user found!");
      }

      setIsLoading(false); // Stop loading after data is fetched
    };

    fetchUserData();
  }, []);

  // Ensure data is loaded before rendering the profile section
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

        {/* User Profile - Resized */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-yellow-400 shadow-lg flex flex-col items-center w-full max-w-xs mx-auto">
          {userData && (
            <>
              <h2 className="mt-2">{userData.name}</h2>
              <p className="text-green-400">Balance: ${userData.balance}</p>
            </>
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
      <div className="fixed bottom-24 left-10 right-10 flex justify-between">
        <button className="bg-purple-600 text-white px-5 py-3 rounded-lg shadow-lg border-2 border-purple-400 hover:bg-purple-800">
          Trade in Past
        </button>
        <Link href="/stocks-portfolio">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg border-2 border-green-400 hover:bg-green-700">
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