'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../home/Components/navbar'; // Check if this path is correct

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://finnhub.io/api/v1/news?category=general&token=cugncbhr01qr6jnd86ogcugncbhr01qr6jnd86p0'); // Replace with your API key
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data.slice(0, 12)); // Display 12 latest news articles
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen  bg-black text-white">
      <Navbar /> {/* Ensure Navbar is correctly imported and working */}
      
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">📈 Stock Market News</h1>

        {loading && <p className="text-center text-lg">Loading news...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 rounded-xl shadow-lg p-5 transition-transform hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={article.image}
                alt={article.headline}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">{article.headline}</h2>
              <p className="text-sm text-gray-400 my-3">{article.summary.slice(0, 100)}...</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-bold hover:underline"
              >
                Read more →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
