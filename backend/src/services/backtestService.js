exports.backtestStockStrategy = (data, stopLoss, takeProfit, entryPeriod, exitPeriod) => {
    // ... (paste the backtestStockStrategy function here)
    
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

  };
  