const stocks = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'FB', 'NVDA', 'NFLX', 'PYPL', 'INTC',
    'AMD', 'ADBE', 'CSCO', 'CMCSA', 'PEP', 'AVGO', 'TXN', 'QCOM', 'COST', 'TMUS',
    'AMGN', 'SBUX', 'MDLZ', 'INTU', 'ISRG', 'BKNG', 'GILD', 'FISV', 'ADP', 'VRTX',
    'REGN', 'CSX', 'PDD', 'ILMN', 'LRCX', 'KDP', 'MRNA', 'ATVI', 'CHTR', 'DXCM',
    'BIIB', 'IDXX', 'EXC', 'MNST', 'CTSH', 'MAR', 'KLAC', 'CDNS', 'ORLY', 'XEL'
  ];

  import Link from 'next/link';
  import Navbar from "../home/Components/navbar";
  export default function StockList() {
    return (
        <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Stock List</h1>
        <ul className="grid grid-cols-5 gap-4">
          {stocks.map((symbol) => (
            <li key={symbol} className="border p-2 rounded-lg hover:bg-gray-200">
              <Link href={`/stock/${symbol}`} className="text-blue-600 hover:underline">
                {symbol}
              </Link>
            </li>
          ))}
        </ul>
      </div>
  <Navbar />
      </>
    );
  }
  