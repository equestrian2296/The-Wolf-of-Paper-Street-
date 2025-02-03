const express = require('express');
const cors = require('cors');
const fetchStockData = require('./yahooFinance');
const yahooFinance = require('yahoo-finance2').default;
const app = express();
app.use(cors());
const port = 5000;
const stocks = [
  "AAPL", "MSFT", "AMZN", "GOOGL", "FB", "TSLA", "BRK.A", "JPM", "JNJ", "V",
  "WMT", "UNH", "PG", "NVDA", "HD", "MA", "PYPL", "BAC", "DIS", "NFLX",
  "ADBE", "CRM", "CMCSA", "XOM", "INTC", "VZ", "CSCO", "PFE", "KO", "PEP",
  "ABT", "MRK", "T", "NKE", "WFC", "ORCL", "TMO", "ACN", "ABBV", "AVGO",
  "CVX", "MCD", "DHR", "NEE", "LLY", "COST", "UNP", "BMY", "LIN", "TXN",
  "QCOM", "MDT", "PM", "HON", "UPS", "AMGN", "IBM", "RTX", "SBUX", "C",
  "BA", "GS", "MMM", "CAT", "GE", "AMD", "GILD", "BKNG", "AXP", "LOW",
  "CHTR", "ISRG", "SPGI", "BLK", "INTU", "MDLZ", "TGT", "ZTS", "AMAT", "SYK",
  "FIS", "ADP", "VRTX", "ATVI", "CCI", "CSX", "CI", "PLD", "ANTM", "USB",
  "TJX", "CME", "EQIX", "DUK", "SO", "MS", "BDX", "CL", "DE", "ILMN"
];
// Endpoint to return stocks in proper JSON format
app.get('/stocks', async (req, res) => {
  res.json({ stocks });
});

app.use(express.json());  // To parse JSON request bodies
// Test route to fetch stock data
app.post('/fetch-stock-data', async (req, res) => {
  const { symbol, startDate, endDate } = req.body;  // Access data from the body
  fetch('http://localhost:5000/fetch-stock-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      symbol: symbol,
      startDate: startDate,
      endDate: endDate,
    }),
  })
    .then(response => response.json())
    .then()
    .catch(error => console.error('Error:', error));

    
  try {
    if (!symbol || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const data = await fetchStockData(symbol, startDate, endDate);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// Function to fetch historical stock data from Yahoo Finance
const fetchHistoricalData = async (symbol, startDate, endDate) => {
    try {
        const queryOptions = {
            period1: new Date(startDate).getTime() / 1000,  // Start date (Unix timestamp)
            period2: new Date(endDate).getTime() / 1000,    // End date (Unix timestamp)
            interval: '1d',  // Daily data interval
        };

        const data = await yahooFinance.historical(symbol, queryOptions);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// Function to perform backtest on a stock strategy
const backtestStockStrategy = (data, stopLoss, takeProfit, entryPeriod, exitPeriod) => {
    let balance = 10000;  // Starting balance
    let position = 0;     // 0 = no position, 1 = holding stock
    let entryPrice = 0;
    let wins = 0, losses = 0;
    let totalTrades = 0;
    let highestBalance = balance;
    let drawdown = 0;

    // Loop through the data for backtesting
    for (let i = entryPeriod; i < data.length; i++) {
        const currentData = data[i];
        const entryData = data[i - entryPeriod];  // Entry data point

        // Entry condition: Buy if current price is greater than the price from the entry period
        if (position === 0 && currentData.close > entryData.close) {
            entryPrice = currentData.close;
            position = 1;
            totalTrades++;
            console.log(`Buying at ${entryPrice} on ${currentData.date}`);
        }

        // Exit condition: Sell when stop-loss or take-profit is hit
        if (position === 1) {
            if (currentData.close <= entryPrice * (1 - stopLoss)) {
                // Stop-loss triggered
                balance -= (entryPrice - currentData.close);  // Loss incurred
                position = 0;
                losses++;
                console.log(`Stop-loss hit: Selling at ${currentData.close} on ${currentData.date}`);
            } else if (currentData.close >= entryPrice * (1 + takeProfit)) {
                // Take-profit triggered
                balance += (currentData.close - entryPrice);  // Profit earned
                position = 0;
                wins++;
                console.log(`Take-profit hit: Selling at ${currentData.close} on ${currentData.date}`);
            }
        }

        // Track the drawdown
        if (balance < highestBalance) {
            drawdown = Math.max(drawdown, highestBalance - balance);
        } else {
            highestBalance = balance;
        }
    }

    // Calculate the win rate
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    // Return the backtest result
    return {
        finalBalance: balance.toFixed(2),
        totalTrades,
        wins,
        losses,
        winRate: winRate.toFixed(2),
        maxDrawdown: drawdown.toFixed(2)
    };
};

// API route for backtesting strategy
app.post('/backtest', async (req, res) => {
    try {
        const { symbol, startDate, endDate, stopLoss, takeProfit, entryPeriod, exitPeriod } = req.body;

        // Fetch historical stock data
        const data = await fetchHistoricalData(symbol, startDate, endDate);
        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'No data found for the given dates' });
        }

        // Run backtest strategy on the fetched data
        const result = backtestStockStrategy(data, stopLoss, takeProfit, entryPeriod, exitPeriod);

        // Send backtest result as response
        return res.json(result);
    } catch (error) {
        console.error('Error during backtesting:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// const app = require('./src/app');
// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
