"use client";
import React, { useState, useEffect } from "react";
  // Import firebase configuration here
import { collection, getDocs, query, where, doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../../../Firebase/firebase" // Import Firebase app
import { getAuth } from "firebase/auth";

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState({
    totalBalance: 15000,
    stocks: [],
    user: null,
  });
  const auth = getAuth(app);
  const db = getFirestore(app);
  const userUID =  auth.currentUser.uid;  // Replace with the actual UID of the logged-in user
  const userDocRef = doc(db, "users", userUID);  // Reference to the user's document in the users collection

  // Fetching data from Firebase (user info and stock orders)
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Fetch user data by document ID
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          // Fetch orders (stocks data) related to the logged-in user
          const ordersRef = query(collection(db, "orders"), where("uid", "==", userUID));
          const ordersSnapshot = await getDocs(ordersRef);

          let stocksData = [];
          ordersSnapshot.forEach((doc) => {
            const data = doc.data();
            // Add stock to portfolio
            stocksData.push({
              symbol: data.StockName,
              quantity: data.Quantity,
              dataBrought: "2024-01-05", // Replace with actual purchase date if available
              thatTimeePrice: parseFloat(data.basePrice),
              currentPrice: parseFloat(data.basePrice), // Initially set to basePrice
              stopLoss: data.stopLoss,
            });
          });

          setPortfolio((prevPortfolio) => ({
            ...prevPortfolio,
            stocks: stocksData,
            user: userData,
          }));
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPortfolioData();
  }, []);

  // Function to simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio((prevPortfolio) => {
        const updatedStocks = prevPortfolio.stocks.map((stock) => ({
          ...stock,
          currentPrice: (stock.currentPrice * (0.98 + Math.random() * 0.04)).toFixed(2), // Simulating small fluctuations
        }));

        return { ...prevPortfolio, stocks: updatedStocks };
      });
    }, 120000); // Update every 2 minutes

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Calculate total profit/loss
  const totalProfit = portfolio.stocks.reduce((acc, stock) => {
    return acc + stock.quantity * (stock.currentPrice - stock.thatTimeePrice);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">📈 Stock Portfolio</h1>

        {/* User Info Section */}
        {portfolio.user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
            <h2 className="text-xl font-semibold text-black">👤 User Info</h2>
            <p className="text-lg text-black mt-2">User ID: {portfolio.user.uid}</p>
            <p className="text-lg text-black mt-2">User Name: {portfolio.user.name}</p> {/* Replace with actual field */}
            {/* Add more user-related fields as needed */}
          </div>
        )}

        {/* Portfolio Summary */}
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

        {/* Stocks Table */}
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
                      <td
                        className={`border p-3 font-bold ${
                          stock.currentPrice - stock.thatTimeePrice >= 0 ? "text-green-700" : "text-red-600"
                        }`}
                      >
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
    </div>
  );
};

export default PortfolioPage;
