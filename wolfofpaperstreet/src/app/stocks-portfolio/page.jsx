"use client";
import React, { useState, useEffect } from "react";

const PortfolioPage = () => {
  // Hardcoded portfolio data with purchase details
  const [portfolio, setPortfolio] = useState({
    totalBalance: 15000,
    stocks: [
      { symbol: "AAPL", quantity: 10, dataBrought: "2024-01-05", thatTimeePrice: 175, currentPrice: 175 },
      { symbol: "TSLA", quantity: 5, dataBrought: "2024-02-10", thatTimeePrice: 190, currentPrice: 190 },
      { symbol: "GOOGL", quantity: 3, dataBrought: "2024-03-15", thatTimeePrice: 1290, currentPrice: 1290 },
    ],
  });

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
    }, 3000); // Update every 3 seconds

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
