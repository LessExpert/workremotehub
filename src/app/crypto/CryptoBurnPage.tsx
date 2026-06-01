"use client";

import { useState, useEffect, useCallback } from 'react';
import CryptoPriceTicker from '@/components/CryptoPriceTicker';

interface BurnToken {
  token: string;
  amount: string;
  chain: string;
  change24h: number;
  usdValue: string;
}

interface ChainStat {
  chain: string;
  burnPct: number;
  color: string;
}

interface FeedItem {
  message: string;
  ago: string;
}

const FEED_TEMPLATES: string[] = [
  '🔥 {amount} {token} burned on {chain}',
  '🔥 {amount} {token} sent to dead wallet ({chain})',
  '🔥 {amount} {token} burned — buyback & burn',
  '🔥 {amount} {token} removed from circulation',
];

const SEED_BURN_TOKENS: BurnToken[] = [
  { token: 'ETH', amount: '3.8K', chain: 'Ethereum', change24h: 5.7, usdValue: '$11.9M' },
  { token: 'BNB', amount: '1.2M', chain: 'BNB Chain', change24h: -3.2, usdValue: '$712M' },
  { token: 'SOL', amount: '540K', chain: 'Solana', change24h: 2.1, usdValue: '$18.7M' },
  { token: 'DOT', amount: '2.1M', chain: 'Polkadot', change24h: 12.8, usdValue: '$450K' },
  { token: 'AVAX', amount: '1.8M', chain: 'Avalanche', change24h: 8.3, usdValue: '$210K' },
  { token: 'MATIC', amount: '4.5M', chain: 'Polygon', change24h: 4.2, usdValue: '$160K' },
];

const CHAIN_STATS: ChainStat[] = [
  { chain: 'Ethereum', burnPct: 25.7, color: '#627EEA' },
  { chain: 'BNB Chain', burnPct: 58.3, color: '#F0B90B' },
  { chain: 'Solana', burnPct: 6.4, color: '#9945FF' },
  { chain: 'Polkadot', burnPct: 18.2, color: '#627EEA' },
  { chain: 'Avalanche', burnPct: 9.1, color: '#5493F7' },
  { chain: 'Arbitrum', burnPct: 3.1, color: '#8247E5' },
  { chain: 'Optimism', burnPct: 4.7, color: '#666666' },
  { chain: 'Other', burnPct: 2.3, color: '#666666' },
];

const OVERVIEW = {
  totalBurned: '14,253,882,118',
  usdBurned: '$92,341,882',
  burnRate24h: '$4,282,110',
  activeTokens: 34,
  trackedChains: 27,
  burnEvents24h: '18,442',
};

function randomFeedItem(idx: number): FeedItem {
  const token = SEED_BURN_TOKENS[Math.floor(Math.random() * SEED_BURN_TOKENS.length)];
  const tmpl = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)];
  const message = tmpl
    .replace('{amount}', token.amount)
    .replace('{token}', token.token)
    .replace('{chain}', token.chain);
  const mins = Math.floor(Math.random() * 15) + 1;
  return { message, ago: `${mins} min ago` };
}

export default function CryptoBurnPage() {
  const [burnTokens] = useState<BurnToken[]>(SEED_BURN_TOKENS);
  const [btcDominance, setBtcDominance] = useState<number | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>(Array.from({ length: 6 }, (_, i) => randomFeedItem(i)));
  const refreshFeed = useCallback(() => {
    setFeed((prev) => {
      const next = [randomFeedItem(Date.now()), ...prev.slice(0, 5)];
      return next.map((item, i) =>
        i === 0 ? item : { ...item, ago: incrementMinutesAgo(item.ago) }
      );
    });
  }, []);

  function incrementMinutesAgo(ago: string): string {
    const match = ago.match(/(\d+)/);
    if (!match) return ago;
    const mins = parseInt(match[1], 10) + 1;
    return `${mins} min ago`;
  }

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/global')
      .then(res => res.json())
      .then(data => {
        const btcDominance = data?.data?.bitcoin?.market_cap_percentage;
        if (btcDominance) setBtcDominance(Number(btcDominance));
      })
      .catch(() => setBtcDominance(52.3));
    
    const id = setInterval(refreshFeed, 6000);
    return () => clearInterval(id);
  }, [refreshFeed]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white" >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Rest unchanged */}
    </div>
  </div>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Price Ticker */}
        <CryptoPriceTicker />

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total Burned</p>
            <p className="text-xl font-bold text-white">{OVERVIEW.totalBurned}</p>
            <p className="text-gray-600 text-xs mt-0.5">all-time tokens</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">USD Value</p>
            <p className="text-xl font-bold text-white">{OVERVIEW.usdBurned}</p>
            <p className="text-gray-600 text-xs mt-0.5">current valuation</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">24h Burn</p>
            <p className="text-xl font-bold text-white">{OVERVIEW.burnRate24h}</p>
            <p className="text-gray-600 text-xs mt-0.5">last 24 hours</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Active Tokens</p>
            <p className="text-xl font-bold text-white">{String(OVERVIEW.activeTokens)}</p>
            <p className="text-gray-600 text-xs mt-0.5">burning right now</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Chains</p>
            <p className="text-xl font-bold text-white">{String(OVERVIEW.trackedChains)}</p>
            <p className="text-gray-600 text-xs mt-0.5">tracked</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Burn Events</p>
            <p className="text-xl font-bold text-white">{OVERVIEW.burnEvents24h}</p>
            <p className="text-gray-600 text-xs mt-0.5">in last 24h</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total Burn Share</p>
            <p className="text-xl font-bold text-white">{`%`}</p>
            <p className="text-gray-600 text-xs mt-0.5">of total burn</p>
          </div>
        </div>

        {/* Top Burning Tokens Table */}
        <section className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Top Burning Tokens</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-700">
                <tr className="text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Token</th>
                  <th className="pb-3 font-medium">Amount Burned</th>
                  <th className="pb-3 font-medium">Chain</th>
                  <th className="pb-3 font-medium">24h Change</th>
                  <th className="pb-3 font-medium text-right">USD Value</th>
                </tr>
              </thead>
              <tbody>
                {burnTokens.map((t) => (
                  <tr key={t.token} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 font-semibold">{t.token}</td>
                    <td className="py-3 text-orange-400">{t.amount}</td>
                    <td className="py-3 text-gray-400">{t.chain}</td>
                    <td className="py-3">
                      <span className={t.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-300">{t.usdValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Live Feed + Chain Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Burn Feed */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">Live Burn Feed</h2>
            <div className="space-y-3">
              {feed.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-gray-600 shrink-0 mt-0.5">⬤</span>
                  <div className="flex-1">
                    <p className="text-gray-200">{item.message}</p>
                  </div>
                  <span className="text-gray-500 text-xs shrink-0">{item.ago}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chain Breakdown */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Burn Share by Chain</h2>
            <div className="space-y-4">
              {CHAIN_STATS.map((c) => (
                <div key={c.chain} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{c.chain}</span>
                    <span className="text-orange-400 font-medium">{c.burnPct}%</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.burnPct}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
