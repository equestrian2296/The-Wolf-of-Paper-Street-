"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../../../Firebase/firebase"; // Import Firebase app
import { getAuth } from "firebase/auth";
import Navbar from "../home/Components/navbar";

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState({
    totalBalance: 0, // Default value
    stocks: [],
    user: null,
  });
  
  const auth = getAuth(app);
  const db = getFirestore(app);
  const userUID = auth.currentUser?.uid; // Ensure UID exists

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!userUID) return; // Exit if no user is logged in
      
      try {
        const userDocRef = doc(db, "users", userUID);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const userBalance = userData.balance || 0; // Get balance from Firestore

          const ordersRef = query(collection(db, "orders"), where("uid", "==", userUID));
          const ordersSnapshot = await getDocs(ordersRef);

          let stocksData = [];
          ordersSnapshot.forEach((doc) => {
            const data = doc.data();
            stocksData.push({
              symbol: data.StockName,
              quantity: data.Quantity,
              dataBrought: "2024-01-05", // Replace with actual purchase date if available
              thatTimeePrice: parseFloat(data.basePrice),
              currentPrice: parseFloat(data.basePrice), // Initially set to basePrice
              stopLoss: data.stopLoss,
            });
          });

          setPortfolio({
            totalBalance: userBalance,
            stocks: stocksData,
            user: userData,
          });
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPortfolioData();
  }, [userUID, db]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio((prevPortfolio) => {
        const updatedStocks = prevPortfolio.stocks.map((stock) => ({
          ...stock,
          currentPrice: (stock.currentPrice * (0.98 + Math.random() * 0.04)).toFixed(2),
        }));

        return { ...prevPortfolio, stocks: updatedStocks };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalProfit = portfolio.stocks.reduce((acc, stock) => {
    return acc + stock.quantity * (stock.currentPrice - stock.thatTimeePrice);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">📈 Stock Portfolio</h1>
        {portfolio.user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
            <h2 className="text-xl font-semibold text-black">👤 User Info</h2>
            <p className="text-lg text-black mt-2">User Name: {portfolio.user.name}</p>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
          <p className="text-lg font-semibold text-black">
            💰 Total Balance:
            <span className="font-bold text-green-700 ml-2">${portfolio.totalBalance.toFixed(2)}</span>
          </p>
          <p className="text-lg font-semibold text-black mt-2">
            📊 Total Profit/Loss:
            <span className={`font-bold ml-2 ${totalProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
              ${totalProfit.toFixed(2)}
            </span>
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="text-2xl font-semibold mb-4 text-black">📜 Your Stocks (Real-Time Updates)</h2>
          {portfolio.stocks.length === 0 ? (
            <p className="text-gray-500 text-center">You don't own any stocks.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-black">
                    <th className="border p-3 text-left">Stock</th>
                    <th className="border p-3 text-left">Quantity</th>
                    <th className="border p-3 text-left">Purchase Date</th>
                    <th className="border p-3 text-left">Buy Price</th>
                    <th className="border p-3 text-left">Current Price</th>
                    <th className="border p-3 text-left">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.stocks.map((stock, index) => (
                    <tr key={index} className="text-black hover:bg-gray-100 transition">
                      <td className="border p-3">{stock.symbol}</td>
                      <td className="border p-3">{stock.quantity}</td>
                      <td className="border p-3">{stock.dataBrought}</td>
                      <td className="border p-3">${stock.thatTimeePrice.toFixed(2)}</td>
                      <td className="border p-3 font-bold text-blue-600">${stock.currentPrice}</td>
                      <td className={`border p-3 font-bold ${stock.currentPrice - stock.thatTimeePrice >= 0 ? "text-green-700" : "text-red-600"}`}>
                        ${(stock.quantity * (stock.currentPrice - stock.thatTimeePrice)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default PortfolioPage;
