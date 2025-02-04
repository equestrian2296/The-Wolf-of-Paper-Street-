'use client';


import { useState, useEffect, useRef } from 'react';

import { useParams } from 'next/navigation';
import Navbar from '../../home/Components/navbar';
import dynamic from 'next/dynamic';
import '../../home/Components/stockPage.css';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const StockPage = () => {
  const { symbol } = useParams();
  // Get the symbol from the URL
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchStockData();
      hasFetched.current = true;
    }
  }, []);

  // functioms for buying the values and storing in the db

   
  const [showOptions, setShowOptions] = useState(false);
const [result, setResult] = useState(null);
const [sharpeRatio, setSharpeRatio] = useState(null);

const runBacktest = async () => {
  const response = await fetch('/api/backtest');
  const data = await response.json();
  setResult(data);
};

const showFunctionCode = () => {
  alert("Displaying function code...");
};

const showResults = async () => {
  const response = await fetch('/api/sharpe-ratio');
  const data = await response.json();
  setSharpeRatio(data.sharpeRatio);
};

  const fetchStockData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/fetch-stock-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, startDate: '2025-01-03', endDate: '2025-10-03' })
      });

      if (!response.ok) throw new Error('Network response was not ok, No backend is Running ');

      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const options = {
    chart: {
      type: 'candlestick', height: 450, background: '#f8f9fa',
      animations: { enabled: true, easing: 'easeinout', speed: 800, animateGradually: { enabled: true, delay: 150 }, dynamicAnimation: { enabled: true, speed: 350 } }
    },
    title: { text: `${symbol} Stock Candlestick Chart`, align: 'left', style: { fontSize: '20px', fontWeight: 'bold', color: '#333' } },
    xaxis: { type: 'datetime', labels: { style: { colors: '#666', fontSize: '12px' } } },
    yaxis: { tooltip: { enabled: true }, labels: { style: { colors: '#666', fontSize: '12px' } } },
    plotOptions: { candlestick: { colors: { upward: '#3C90EB', downward: '#DF7D46' } } }
  };

  const series = [{
    data: stockData.map(item => ({ x: new Date(item.date).getTime(), y: [item.open, item.high, item.low, item.close] }))
  }];

  const handleBuy = () => setShowBuyModal(true);
  const handleSell = () => setShowSellModal(true);
  

  const executeBuy = async () => {
    if (!quantity || !stopLoss) return alert('Please enter both quantity and stop loss');
  
    try {
      // Fetch latest stock price from Twelve Data API (Replace API_KEY with your actual API key)
      const response = await fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=YOUR_API_KEY`);
  
      if (!response.ok) throw new Error('Failed to fetch latest stock price');
  
      const data = await response.json();
      const basePrice = data.price;
  
      if (!basePrice) throw new Error('Invalid stock data received');
  
      const orderData = {
        Quantity: Number(quantity),
        StockName: symbol,
        basePrice: Number(basePrice),
        stopLoss: Number(stopLoss),
        uid: 'hbdsjfjsfsbdf', // Replace with actual user ID
      };
  
      // Store the order in Firebase Firestore
      const firestore = firebase.firestore();
      await firestore.collection('orders').add(orderData);
  
      console.log('Order placed successfully:', orderData);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again later.');
    }
  
    setShowBuyModal(false);
    setQuantity('');
    setStopLoss('');
  };
  
  const executeSell = () => {
    if (!quantity) return alert('Please enter the quantity to sell');
    console.log(`Selling ${quantity} shares of ${symbol}`);
    setShowSellModal(false); setQuantity('');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="stock-page">
      <Navbar />
      <div className="stock-content">
        <h1>Stock: {symbol}</h1>
        <div className="chart-container">
          <ReactApexChart options={options} series={series} type="candlestick" height={500} width={1150} />
        </div>
        <div className="action-buttons">
          <button className="btn buy-btn" onClick={handleBuy}>Buy</button>
          <button className="btn sell-btn" onClick={handleSell}>Sell</button>
          
  {/* Options Menu */}

    {/* Options Dropdown */}
    <div className="dropdown">
    <button
      className="btn options-btn"
      onClick={() => setShowOptions(!showOptions)}
    >
      Options ⌄
    </button>

    {showOptions && (
      <div className="dropdown-menu">
        <button className="dropdown-item" onClick={runBacktest}>
          Run Backtest
        </button>
        <button className="dropdown-item" onClick={showFunctionCode}>
          Show Function Code
        </button>
        <button className="dropdown-item" onClick={showResults}>
          Show Sharpe Ratio
        </button>
      </div>
    )}
  </div>


  {/* Display Result */}
  {result && (
    <div className="result-section">
      <h4>Result:</h4>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      <h4>Sharpe Ratio: {sharpeRatio}</h4>
    </div>
  )}
        </div>
      </div>
      {(showBuyModal || showSellModal) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{showBuyModal ? `Buy ${symbol}` : `Sell ${symbol}`}</h2>
              <button className="close-btn" onClick={() => showBuyModal ? setShowBuyModal(false) : setShowSellModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              {showBuyModal && <input type="number" placeholder="Stop Loss" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />}
            </div>
            <div className="modal-footer">
              <button className="btn cancel-btn" onClick={() => showBuyModal ? setShowBuyModal(false) : setShowSellModal(false)}>Cancel</button>
              <button className="btn confirm-btn" onClick={showBuyModal ? executeBuy : executeSell}>Confirm {showBuyModal ? 'Buy' : 'Sell'}</button>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPage;
