// components/Wishlist.js
'use client'
import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Adjust the path as necessary
import { collection, getDocs } from 'firebase/firestore';
import yahooFinance from 'yahoo-finance2';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockPrices, setStockPrices] = useState({});

  const fetchWishlist = async () => {
    try {
      const wishlistCollection = collection(db, 'wishlist'); // Replace 'wishlist' with your collection name
      const wishlistSnapshot = await getDocs(wishlistCollection);
      const wishlistData = wishlistSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWishlistItems(wishlistData);

      // Fetch stock prices for each item in the wishlist
      const prices = {};
      for (const item of wishlistData) {
        if (item.stockSymbol) { // Assuming each item has a stockSymbol field
          const stockData = await getStockPrice(item.stockSymbol);
          prices[item.stockSymbol] = stockData.regularMarketPrice;
        }
      }
      setStockPrices(prices);
    } catch (error) {
      console.error("Error fetching wishlist: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getStockPrice = async (symbol) => {
    try {
      const result = await yahooFinance.quote(symbol);
      return result;
    } catch (error) {
      console.error("Error fetching stock price:", error);
      return { regularMarketPrice: 'N/A' }; // Return 'N/A' if there's an error
    }
  };

  useEffect(() => {
    fetchWishlist(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchWishlist(); // Fetch every minute
    }, 60000); // 60000 milliseconds = 1 minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="wishlist-container">
      <h1>Your Wishlist</h1>
      <ul className="wishlist-items">
        {wishlistItems.map(item => (
          <li key={item.id} className="wishlist-item">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            {item.stockSymbol && (
              <p className="stock-price">
                Current Price: ${stockPrices[item.stockSymbol] || 'Loading...'}
              </p>
            )}
          </li>
        ))}
      </ul>
      <style jsx>{`
        .wishlist-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          color: #333;
        }
        .wishlist-items {
          list-style-type: none;
          padding: 0;
        }
        .wishlist-item {
          padding: 15px;
          margin: 10px 0;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
        }
        .stock-price {
          font-weight: bold;
          color: #0070f3;
        }
        .loading {
          text-align: center;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;