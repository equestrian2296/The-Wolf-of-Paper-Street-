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

  const handleSearch = () => {
    // Validate if all fields are filled
    if (
      !query ||
      !startDate ||
      !endDate ||
      !stopLoss ||
      !takeProfit ||
      !period ||
      !exitPeriod
    ) {
      setErrorMessage("Please fill in all the fields before searching.");
      return; // Prevent search if any field is empty
    }

    // Clear the error message if validation passes
    setErrorMessage("");

    console.log("Searching for:", query);
    console.log("Start Date:", startDate, "End Date:", endDate);
    console.log("Stop Loss:", stopLoss, "Take Profit:", takeProfit);
    console.log("Period:", period, "Exit Period:", exitPeriod);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full space-y-2">
      <div className="flex items-center space-x-2 w-full max-w-lg">
        <input
          type="text"
          className="border p-2 rounded-lg flex-grow"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="flex items-center space-x-2 w-full max-w-lg">
        <input
          type="date"
          className="border p-2 rounded-lg w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Select Start Date"
        />
        <input
          type="date"
          className="border p-2 rounded-lg w-full"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Select End Date"
        />
      </div>
      <div className="flex items-center space-x-2 w-full max-w-lg">
        <input
          type="number"
          className="border p-2 rounded-lg w-full"
          placeholder="Stop Loss"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded-lg w-full"
          placeholder="Take Profit"
          value={takeProfit}
          onChange={(e) => setTakeProfit(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2 w-full max-w-lg">
        <input
          type="number"
          className="border p-2 rounded-lg w-full"
          placeholder="Enter Period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded-lg w-full"
          placeholder="Enter Exit Period"
          value={exitPeriod}
          onChange={(e) => setExitPeriod(e.target.value)}
        />
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
    </div>
  );
}
