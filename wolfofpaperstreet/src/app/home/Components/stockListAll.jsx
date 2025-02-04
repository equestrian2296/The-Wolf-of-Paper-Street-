import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const stocksData = [
  { name: "JOLLY PLASTIC INDUSTRIES LTD.", symbol: "JOLYPLS", price: 192.15, change: 57.5 },
  { name: "BROACH LIFECARE HOSPITAL LTD", symbol: "BROACH", price: 24.6, change: 20.0 },
  { name: "KAMAT HOTELS (I) LTD", symbol: "KAMATHOTEL", price: 273.52, change: 20.0 },
  { name: "SAMRAT FORGINGS LIMITED", symbol: "SAMRATFORG", price: 336.0, change: 19.91 },
  { name: "PARAMATRIX TECHNOLOGIES L", symbol: "PARAMATRIX", price: 99.0, change: 17.16 },
  { name: "SAT KARTAR SHOPPING LTD", symbol: "SATKARTAR", price: 178.35, change: 17.14 },
];

const losersData = [
  { name: "TITAN INTECH LIMITED", symbol: "TITANIN", price: 21.68, change: -20.0 },
  { name: "SONAM LTD", symbol: "SONAMLTD", price: 50.16, change: -17.53 },
  { name: "REMUS PHARMACEUTICALS L", symbol: "REMUS", price: 2004.95, change: -14.77 },
  { name: "CEEJAY FINANCE LTD.", symbol: "CEEJAY", price: 250.25, change: -14.5 },
  { name: "INNOKAIZ INDIA LIMITED", symbol: "INNOKAIZ", price: 28.75, change: -11.97 },
  { name: "INTEGRA CAPITAL LIMITED", symbol: "INTCAPL", price: 14.85, change: -11.61 },
];

const StockMarket = () => {
  const router = useRouter();
  const [stocks, setStocks] = useState(stocksData);
  const [losers, setLosers] = useState(losersData);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => ({
          ...stock,
          price: parseFloat((stock.price * (1 + (Math.random() - 0.5) / 50)).toFixed(2)),
          change: parseFloat(((Math.random() - 0.5) * 10).toFixed(2)),
        }))
      );

      setLosers((prevLosers) =>
        prevLosers.map((stock) => ({
          ...stock,
          price: parseFloat((stock.price * (1 + (Math.random() - 0.5) / 50)).toFixed(2)),
          change: parseFloat(((Math.random() - 0.5) * 10).toFixed(2)),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (symbol) => {
    router.push(`/stock/${symbol}`);
  };

  return (
    <div className="flex justify-center gap-10 p-6 bg-gray-900 text-white">
      <div>
        <h2 className="text-lg font-semibold mb-3">Top Gainers</h2>
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="flex justify-between p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
            onClick={() => handleClick(stock.symbol)}
          >
            <span>{stock.name}</span>
            <span>{stock.price} INR</span>
            <span className="text-green-400">+{stock.change}%</span>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">Top Losers</h2>
        {losers.map((stock) => (
          <div
            key={stock.symbol}
            className="flex justify-between p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
            onClick={() => handleClick(stock.symbol)}
          >
            <span>{stock.name}</span>
            <span>{stock.price} INR</span>
            <span className="text-red-400">{stock.change}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockMarket;
