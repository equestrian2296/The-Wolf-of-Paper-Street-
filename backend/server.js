const OpenAI = require("openai");
const express = require('express');
const cors = require('cors');
const fetchStockData = require('./yahooFinance');
const yahooFinance = require('yahoo-finance2').default;
const { RSI, SMA, EMA } = require("technicalindicators");
const ModelClient = require("@azure-rest/ai-inference").default;
const { AzureKeyCredential } = require("@azure/core-auth");
(async () => {
    const { sharpeRatio } = await import('portfolio-analysis');
    console.log(sharpeRatio);
})();


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

        if (!symbol || !from || !to) {
            return res.status(400).json({ error: "Please provide symbol, from, and to dates in YYYY-MM-DD format" });
        }

        // Convert Dates to Unix Timestamp
        const fromTimestamp = Math.floor(new Date(from).getTime() / 1000);
        const toTimestamp = Math.floor(new Date(to).getTime() / 1000);

        // Fetch Stock Data
        const apiKey = "cugncbhr01qr6jnd86ogcugncbhr01qr6jnd86p0"; // Replace with your Finnhub API Key
        const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${fromTimestamp}&to=${toTimestamp}&token=${apiKey}`;
        
        const response = await axios.get(url);

        if (response.data.s !== "ok") {
            return res.status(400).json({ error: "Invalid stock symbol or date range" });
        }

        const prices = response.data.c; // Closing prices

        if (prices.length < 2) {
            return res.status(400).json({ error: "Not enough data to calculate Sharpe Ratio" });
        }

        // Calculate Daily Returns
        const returns = prices.map((price, i, arr) => (i === 0 ? 0 : (price - arr[i - 1]) / arr[i - 1])).slice(1);

        // Compute Sharpe Ratio using portfolio-tools
        const riskFreeRate = 0.02 / 252; // Assume 2% annual risk-free rate, converted to daily
        const sharpe = sharpeRatio(returns, riskFreeRate);

        res.json({ symbol, sharpeRatio: sharpe.toFixed(4) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error calculating Sharpe Ratio" });
    }
});


/// Make the Techincal Indicators for the stock market



// Function to fetch closing prices from Yahoo Finance
async function getClosingPrices(symbol, period = 20) {
    try {
        const result = await yahooFinance.historical(symbol, {
            period1: "2024-01-01", // Fetch from Jan 1, 2024
            interval: "1d",
        });

        // Extract closing prices for the last 'period' days
        return result.slice(-period).map((day) => day.close);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return null;
    }
}

// API to calculate RSI, SMA, and EMA in a single request
app.get("/indicators", async (req, res) => {
    const symbol = req.query.symbol || "AAPL"; // Default to Apple stock
    const rsiPeriod = parseInt(req.query.rsiPeriod) || 14;
    const smaPeriod = parseInt(req.query.smaPeriod) || 10;
    const emaPeriod = parseInt(req.query.emaPeriod) || 10;

    const closingPrices = await getClosingPrices(symbol, Math.max(rsiPeriod, smaPeriod, emaPeriod) + 1);
    if (!closingPrices) return res.status(500).json({ error: "Failed to fetch stock data" });

    const rsi = RSI.calculate({ values: closingPrices, period: rsiPeriod }).pop();
    const sma = SMA.calculate({ values: closingPrices, period: smaPeriod }).pop();
    const ema = EMA.calculate({ values: closingPrices, period: emaPeriod }).pop();

    res.json({ symbol, RSI: rsi, SMA: sma, EMA: ema });
});


// AI naaylze 

// AI naaylze 


const openai = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: "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"
  });

  
  
  app.post("/analyze", async (req, res) => {
      try {
          const { content } = req.body;
          if (!content) {
              return res.status(400).json({ error: "Content is required" });
          }
  
          const response = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [
                  { "role": "system", content: "Analyze if the user should buy the mentioned product. Respond with a json object(as plain text not markdown) with field 'recommendation' with value as either 'Buy it' or 'Don't buy it' and another field 'reasoning' with the reasoning.", },
                  { "role": "user", content: content, },
              ],
              temperature: 0.7,
              max_tokens: 200,
              top_p: 1,
          });
  
          res.json(JSON.parse(response.choices[0].message.content));
      } 
      catch (error) {
          console.log(error.message || "Internal Server Error");
          res.status(500).json({ error: error.message || "Internal Server Error" });
      }
  
  });
  
  
// meta AI analyse
const client = new ModelClient(
    "https://models.inference.ai.azure.com",
    new AzureKeyCredential("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")
);


app.post("/analyzemeta", async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const response = await client.path("/chat/completions").post({
            body: {
                messages: [
                    { role: "system", content: "Analyze if the user should buy the mentioned product. Respond with a json object(as plain text not markdown) with field 'recommendation' with value as either 'Buy it' or 'Don't buy it' and another field 'reasoning' with the reasoning." },
                    { role: "user", content }
                ],
                model: "Llama-3.3-70B-Instruct",
                temperature: 0.8,
                max_tokens: 2048,
                top_p: 0.1
            }
        });

        if (response.status !== "200") {
            throw response.body.error;
        }

        res.json(JSON.parse(response.body.choices[0].message.content));
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

