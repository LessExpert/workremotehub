import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface CoinData {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const COINS_TO_TRACK = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'dogecoin', 'shiba-inu'];

export default function PriceTracker() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchPrices = async () => {
    try {
      const ids = COINS_TO_TRACK.join(',');
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      );
      setCoins(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center p-4 animate-pulse text-gray-500">Loading live prices...</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-500">⚡</span> Live Market Prices
        </h3>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <RefreshCw size={12} className="animate-spin" />
          Updated: {lastUpdated}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {coins.map((coin) => (
          <div key={coin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 transition-colors">
            <div className="flex items-center gap-3">
              <img src={coin.image} alt={coin.symbol} className="w-8 h-8 rounded-full" />
              <div>
                <p className="font-bold uppercase text-xs text-gray-600">{coin.symbol}</p>
                <p className="text-sm font-medium">${coin.current_price.toLocaleString()}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}> {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {coin.price_change_percentage_24h.toFixed(2)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}