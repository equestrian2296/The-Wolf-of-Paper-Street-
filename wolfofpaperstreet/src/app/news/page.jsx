'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../home/Components/navbar'; // Ensure this path is correct

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

        let news = data.slice(0, 1);
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <div className="flex flex-col md:flex-row gap-4" key={article.id || article.headline}>
              <div className="flex-1 w-1/2">
                <motion.div
                  className="bg-gray-900 rounded-xl shadow-lg p-5 transition-transform hover:scale-105"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0 }}
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
              </div>

              <div className="flex-1 bg-gray-800 p-4 rounded-xl w-[400px]">
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(article.analysis).map((element) => {
                    const analysis = article.analysis[element];
                    return (
                      <div key={element} className="flex flex-col gap-2">
                        <h2 className="font-semibold text-lg">{element}:</h2>
                        <p>Recommendation: {analysis.recommendation}</p>
                        <p>Reason: {analysis.reasoning}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
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
