'use client';

import { useState, useEffect } from 'react';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

export default function CryptoDashboard() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
      );
      const data = await response.json();
      setCoins(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-gray-500">Loading market data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Crypto Market Dashboard</h1>
          <p className="text-gray-600">Real-time cryptocurrency prices</p>
        </div>
        <button
          onClick={fetchPrices}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Top 10 Cryptocurrencies</h2>
        <div className="space-y-3">
          {coins.map((coin) => (
            <div key={coin.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <img src={coin.image} alt={coin.name} className="h-10 w-10" />
                <div>
                  <p className="font-semibold">{coin.name} ({coin.symbol.toUpperCase()})</p>
                  <p className="text-sm text-gray-500">${coin.current_price.toLocaleString()}</p>
                </div>
              </div>
              <div className={coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} {coin.price_change_percentage_24h.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
