import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const StockChart = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fetch-stock-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: 'AAPL',
          startDate: '2025-01-03',
          endDate: '2025-10-03'
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const options = {
    chart: {
      type: 'candlestick',
      height: 450,
      background: '#f8f9fa',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    title: {
      text: 'AAPL Stock Candlestick Chart',
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#3C90EB',
          downward: '#DF7D46'
        }
      }
    }
  };

  const series = [{
    data: stockData.map(item => ({
      x: new Date(item.date).getTime(),
      y: [item.open, item.high, item.low, item.close]
    }))
  }];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Stock Price Chart</h2>
      <ReactApexChart options={options} series={series} type="candlestick" height={500} width={1150} />
    </div>
  );
};

export default StockChart;
