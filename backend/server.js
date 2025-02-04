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



// Function to convert date (YYYY-MM-DD) to UNIX timestamp (seconds)
function convertToTimestamp(dateStr) {
    return Math.floor(new Date(dateStr).getTime() / 1000);
}

// Function to fetch historical data from Yahoo Finance
async function getHistoricalData(symbol, from, to) {
    try {
        const results = await yahooFinance.historical(symbol, {
            period1: from * 1000,  // Convert seconds to milliseconds
            period2: to * 1000,    // Convert seconds to milliseconds
            interval: "1d"
        });

        return results.map(day => day.close); // Extract closing prices
    } catch (error) {
        throw new Error("Error fetching Yahoo Finance data");
    }
}

// Function to calculate Sharpe Ratio
function calculateSharpeRatio(prices, riskFreeRate = 0.02) {
    let returns = [];

    for (let i = 1; i < prices.length; i++) {
        let dailyReturn = (prices[i] - prices[i - 1]) / prices[i - 1];
        returns.push(dailyReturn);
    }

    let meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    let squaredDiffs = returns.map(r => Math.pow(r - meanReturn, 2));
    let stdDev = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / returns.length);

    let sharpeRatio = (meanReturn - riskFreeRate / 252) / stdDev;

    return { sharpeRatio, stdDev, meanReturn };
}

// API Endpoint for Sharpe Ratio Calculation (POST)
app.post("/sharpe", async (req, res) => {
    try {
        let { symbol, from, to } = req.body;

        if (!symbol) {
            return res.status(400).json({ error: "Please provide a stock symbol" });
        }

        // If 'from' and 'to' are missing, default to last 1 year
        if (!from || !to) {
            to = Math.floor(Date.now() / 1000);
            from = to - (365 * 24 * 60 * 60);
        } else {
            from = isNaN(from) ? convertToTimestamp(from) : parseInt(from);
            to = isNaN(to) ? convertToTimestamp(to) : parseInt(to);
        }

        const prices = await getHistoricalData(symbol, from, to);
        if (!prices || prices.length === 0) return res.status(400).json({ error: "No data found" });

        const { sharpeRatio, stdDev, meanReturn } = calculateSharpeRatio(prices);

        res.json({
            symbol,
            from: new Date(from * 1000).toISOString().split("T")[0],
            to: new Date(to * 1000).toISOString().split("T")[0],
            sharpeRatio: sharpeRatio.toFixed(2),
            standardDeviation: stdDev.toFixed(4),
            meanReturn: (meanReturn * 100).toFixed(2) + "%"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

