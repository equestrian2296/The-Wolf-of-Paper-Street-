'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './navbar';
import StockChart from './stockChart';
import './stockPage.css';

function StockPage() {
  const router = useRouter();
  const { symbol } = router.query || {};
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');

  const handleBuy = () => setShowBuyModal(true);
  const handleSell = () => setShowSellModal(true);

  const executeBuy = () => {
    if (!quantity || !stopLoss) {
      alert('Please enter both quantity and stop loss');
      return;
    }
    console.log(`Buying ${quantity} shares of ${symbol} with stop loss at ${stopLoss}`);
    setShowBuyModal(false);
    setQuantity('');
    setStopLoss('');
  };

  const executeSell = () => {
    if (!quantity) {
      alert('Please enter the quantity to sell');
      return;
    }
    console.log(`Selling ${quantity} shares of ${symbol}`);
    setShowSellModal(false);
    setQuantity('');
  };

  return (
    <div className="stock-page">
      <Navbar />
      <div className="stock-content">
        <div className="chart-container">
          <StockChart symbol={symbol} />
        </div>
        <div className="action-buttons">
          <button className="btn buy-btn" onClick={handleBuy}>Buy</button>
          <button className="btn sell-btn" onClick={handleSell}>Sell</button>
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
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {showBuyModal && (
                <input
                  type="number"
                  placeholder="Stop Loss"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn cancel-btn" onClick={() => showBuyModal ? setShowBuyModal(false) : setShowSellModal(false)}>Cancel</button>
              <button className="btn confirm-btn" onClick={showBuyModal ? executeBuy : executeSell}>
                Confirm {showBuyModal ? 'Buy' : 'Sell'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockPage;
