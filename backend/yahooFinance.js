const yahooFinance = require('yahoo-finance2').default;

// Validate date format (YYYY-MM-DD)
function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

async function fetchStockData(symbol, startDate, endDate) {
  try {
    // Input validation
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('Invalid symbol. Please provide a valid stock symbol.');
    }
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD.');
    }

    // Convert dates to UNIX timestamps
    const period1 = new Date(startDate).getTime() / 1000; // start date in seconds
    const period2 = new Date(endDate).getTime() / 1000;   // end date in seconds

    if (period1 >= period2) {
      throw new Error('Start date should be before end date.');
    }

    // Fetch historical stock data from Yahoo Finance
    const queryOptions = {
      period1: period1,
      period2: period2,
      interval: '1d',  // Daily interval
    };

    const data = await yahooFinance.historical(symbol, queryOptions);
    
    // Check if data is empty
    if (data.length === 0) {
      throw new Error('No data found for the given symbol and date range.');
    }

    return data;

  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    throw error; // rethrow error for handling upstream
  }
}

module.exports = fetchStockData;


yahooFinance.js