'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../home/Components/navbar';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://finnhub.io/api/v1/news?category=general&token=cugncbhr01qr6jnd86ogcugncbhr01qr6jnd86p0');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();

        let news = data.slice(0, 2);
        for (let i = 0; i < news.length; ++i) {
          news[i].analysis = {};
          news[i].analysis.open_ai = await getRecommendations("analyze", news[i].summary);
          await sleep(3000);
          news[i].analysis.meta = await getRecommendations("analyzemeta", news[i].summary);
          await sleep(3000);
        }

        setNews(news);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">📈 Stock Market News</h1>

        {loading && <p className="text-center text-lg">Loading news...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((article) => (
            <div key={article.id || article.headline} className="flex flex-col gap-6">
              <motion.div
                className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform hover:scale-105 w-full h-[50vh]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={article.image}
                  alt={article.headline}
                  className="w-full h-1/2 object-cover"
                />
                <div className="p-5 h-1/2 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{article.headline}</h2>
                    <p className="text-gray-400 text-sm mb-3">{article.summary.slice(0, 200)}...</p>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 font-bold hover:underline"
                  >
                    Read more →
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="bg-gray-800 p-6 rounded-xl shadow-lg w-full h-[30vh]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-blue-400 mb-2">AI Analysis:</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(article.analysis).map((element) => (
                    <div key={element} className="bg-gray-700 p-3 rounded-lg">
                      <h3 className="font-semibold text-lg text-blue-300">{element.toUpperCase()}</h3>
                      <p className="text-sm">{article.analysis[element]?.recommendation || 'Loading...'}</p>
                      <p className="text-xs text-gray-400">{article.analysis[element]?.reasoning || 'Loading...'}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;

async function getRecommendations(endpoint, content) {
  const requestBody = { content };
  const response = await fetch(
      `http://localhost:5000/${endpoint}`,
    { method: 'POST', body: JSON.stringify(requestBody), headers: { "Content-Type": "application/json" } }
  );
  return await response.json();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}