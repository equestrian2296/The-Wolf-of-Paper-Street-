// import React, { useState } from 'react';
// // import axios from 'axios';
// import styles from './Backtest.module.css';

// const Backtest = () => {
//     const [symbol, setSymbol] = useState('AAPL');
//     const [startDate, setStartDate] = useState('2023-01-01');
//     const [endDate, setEndDate] = useState('2023-12-31');
//     const [stopLoss, setStopLoss] = useState(0.05);
//     const [takeProfit, setTakeProfit] = useState(0.1);
//     const [entryPeriod, setEntryPeriod] = useState(5);
//     const [exitPeriod, setExitPeriod] = useState(10);
//     const [result, setResult] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         setResult(null);

//         try {
//             const response = await axios.post('http://localhost:5000/backtest', {
//                 symbol,
//                 startDate,
//                 endDate,
//                 stopLoss,
//                 takeProfit,
//                 entryPeriod,
//                 exitPeriod,
//             });
//             setResult(response.data);
//         } catch (err) {
//             setError('Error fetching backtest results. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className={styles.container}>
//             <h1>Stock Backtester</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Symbol:</label>
//                     <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>Start Date:</label>
//                     <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>End Date:</label>
//                     <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>Stop Loss (%):</label>
//                     <input type="number" step="0.01" value={stopLoss} onChange={(e) => setStopLoss(parseFloat(e.target.value))} />
//                 </div>
//                 <div>
//                     <label>Take Profit (%):</label>
//                     <input type="number" step="0.01" value={takeProfit} onChange={(e) => setTakeProfit(parseFloat(e.target.value))} />
//                 </div>
//                 <div>
//                     <label>Entry Period:</label>
//                     <input type="number" value={entryPeriod} onChange={(e) => setEntryPeriod(parseInt(e.target.value))} />
//                 </div>
//                 <div>
//                     <label>Exit Period:</label>
//                     <input type="number" value={exitPeriod} onChange={(e) => setExitPeriod(parseInt(e.target.value))} />
//                 </div>
//                 <button type="submit" disabled={loading}>
//                     {loading ? 'Loading...' : 'Backtest'}
//                 </button>
//             </form>

//             {error && <p className={styles.error}>{error}</p>}

//             {result && (
//                 <div className={styles.result}>
//                     <h2>Backtest Results</h2>
//                     <p>`Final Balance:  `${result.finalBalance}`</p>
//                     <p>Total Trades: {result.totalTrades}</p>
//                     <p>Wins: {result.wins}</p>
//                     <p>Losses: {result.losses}</p>
//                     <p>Win Rate: {result.winRate}%</p>
//                     <p>Max Drawdown: ${result.maxDrawdown}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Backtest;
