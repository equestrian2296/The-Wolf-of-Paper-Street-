"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [period, setPeriod] = useState("");
  const [exitPeriod, setExitPeriod] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // State to store API responses
  const [backtrackData, setBacktrackData] = useState(null);
  const [sharpData, setSharpData] = useState(null);
  const [indicatorsData, setIndicatorsData] = useState(null);

  // Function to call the APIs
  const handleSearch = async () => {
    if (!query || !startDate || !endDate || !stopLoss || !takeProfit || !period || !exitPeriod) {
      setErrorMessage("Please fill in all the fields before searching.");
      return;
    }
    setErrorMessage("");

    try {
      // Call Backtrack API
      const backtrackResponse = await fetch("http://localhost:5000/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: query,
          startDate,
          endDate,
          stopLoss,
          takeProfit,
          entryPeriod: period,
          exitPeriod,
        }),
      });
      const backtrackResult = await backtrackResponse.json();
      setBacktrackData(backtrackResult);

      // Call Sharp API
      const sharpResponse = await fetch("http://localhost:5000/sharpe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: query,
          from: startDate,
          to: endDate,
        }),
      });
      const sharpResult = await sharpResponse.json();
      setSharpData(sharpResult);

      // Call Indicators API
      const indicatorsResponse = await fetch(`http://localhost:5000/indicators?symbol=${query}`);
      const indicatorsResult = await indicatorsResponse.json();
      setIndicatorsData(indicatorsResult);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Error fetching data. Please try again.");
    }
  };

  // Function to determine if the indicators are good or bad
  const getIndicatorStatus = (RSI, SMA, EMA) => {
    let rsiStatus = RSI >= 40 && RSI <= 70 ? "Good" : "Bad";
    let trendStatus = EMA > SMA ? "Good" : "Bad";
    
    return { rsiStatus, trendStatus };
  };

  let indicatorStatus = indicatorsData
    ? getIndicatorStatus(indicatorsData.RSI, indicatorsData.SMA, indicatorsData.EMA)
    : null;

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full space-y-4">
      <div className="flex items-center space-x-2 w-full max-w-lg">
        <input
          type="text"
          className="border p-2 text-black rounded-lg flex-grow"
          placeholder="Enter Stock Symbol (e.g., AAPL)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="flex space-x-2 w-full max-w-lg">
        <input
          type="date"
          className="border text-black p-2 rounded-lg w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border text-black p-2 rounded-lg w-full"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="flex space-x-2 w-full max-w-lg">
        <input
          type="number"
          className="border text-black p-2 rounded-lg w-full"
          placeholder="Stop Loss"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
        />
        <input
          type="number"
          className="border text-black p-2 rounded-lg w-full"
          placeholder="Take Profit"
          value={takeProfit}
          onChange={(e) => setTakeProfit(e.target.value)}
        />
      </div>

      <div className="flex space-x-2 w-full max-w-lg">
        <input
          type="number"
          className="border text-black p-2 rounded-lg w-full"
          placeholder="Enter Period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />
        <input
          type="number"
          className="border text-black p-2 rounded-lg w-full"
          placeholder="Enter Exit Period"
          value={exitPeriod}
          onChange={(e) => setExitPeriod(e.target.value)}
        />
      </div>

      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
      {indicatorsData && (
        <div className="border p-4 rounded-lg w-full max-w-lg bg-gray-100 text-black">
          <h3 className="text-lg font-semibold">Indicators:</h3>
          <div>
            RSI:{" "}
            <span className={indicatorStatus.rsiStatus === "Good" ? "text-green-500" : "text-red-500"}>
              {indicatorsData.RSI} ({indicatorStatus.rsiStatus})
            </span>
          </div>
          <div>
            SMA: {indicatorsData.SMA}
          </div>
          <div>
            EMA:{" "}
            <span className={indicatorStatus.trendStatus === "Good" ? "text-green-500" : "text-red-500"}>
              {indicatorsData.EMA} ({indicatorStatus.trendStatus})
            </span>
          </div>
        </div>
      )}
      
      {/* Display Backtrack API response */}
      {backtrackData && (
        <div className="border p-4 rounded-lg w-full max-w-lg bg-gray-100 text-black">
          <h3 className="text-lg font-semibold">Backtrack Result:</h3>
          <pre className="text-sm text-black">{JSON.stringify(backtrackData, null, 2)}</pre>
        </div>
      )}

      {/* Display Sharp API response */}
      {sharpData && (
        <div className="border p-4 rounded-lg w-full max-w-lg bg-gray-100 text-black">
          <h3 className="text-lg font-semibold">Sharp Result:</h3>
          <pre className="text-sm text-black">{JSON.stringify(sharpData, null, 2)}</pre>
        </div>
      )}

      {/* Display Indicators API response */}
    
    </div>
  );
}
