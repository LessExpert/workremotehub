'use client';

import { useState, useEffect, useCallback } from 'react';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

const SEED_DATA: TickerItem[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67432.18, change24h: 2.34 },
  { symbol: 'ETH', name: 'Ethereum', price: 3491.55, change24h: -1.12 },
  { symbol: 'BNB', name: 'BNB', price: 597.82, change24h: 0.87 },
  { symbol: 'SOL', name: 'Solana', price: 142.36, change24h: 3.45 },
  { symbol: 'SHIB', name: 'Shiba Inu', price: 0.00002471, change24h: 5.21 },
];

function randomTick(price: number): number {
  const pct = (Math.random() - 0.5) * 0.001; // ±0.05%
  return price * (1 + pct);
}

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.0001) return price.toFixed(7);
  return price.toExponential(4);
}

export default function CryptoPriceTicker() {
  const [prices, setPrices] = useState<TickerItem[]>(SEED_DATA);

  const tick = useCallback(() => {
    setPrices((prev) =>
      prev.map((item) => ({
        ...item,
        price: randomTick(item.price),
        change24h: item.change24h + (Math.random() - 0.5) * 0.04,
      }))
    );
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className="bg-gray-900 rounded-xl p-4 overflow-hidden">
      <h3 className="text-sm text-gray-400 mb-3">Live Prices</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {prices.map((item) => {
          const positive = item.change24h >= 0;
          return (
            <div
              key={item.symbol}
              className="flex-shrink-0 bg-gray-800 rounded-lg px-4 py-3 min-w-[130px]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white">{item.symbol}</span>
                <span className="text-xs text-gray-500">{item.name}</span>
              </div>
              <p className="text-lg font-semibold text-white">
                ${formatPrice(item.price)}
              </p>
              <p
                className={`text-xs font-medium ${
                  positive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {positive ? '+' : ''}
                {item.change24h.toFixed(2)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}