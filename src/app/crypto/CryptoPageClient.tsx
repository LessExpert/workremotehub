'use client';

import { useState, useEffect, useCallback } from 'react';
import CryptoPriceTicker from '@/components/CryptoPriceTicker';

// ── Mock data ──────────────────────────────────────────────────────────

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
  { token: 'SHIB', amount: '14.2B', chain: 'Ethereum', change24h: 21.5, usdValue: '$1.4M' },
  { token: 'LUNC', amount: '8.9B', chain: 'Terra', change24h: 12.8, usdValue: '$890K' },
  { token: 'BNB', amount: '1.2M', chain: 'BNB Chain', change24h: -3.2, usdValue: '$712M' },
  { token: 'ETH', amount: '3.4K', chain: 'Ethereum', change24h: 5.7, usdValue: '$11.9M' },
  { token: 'PEPE', amount: '2.1T', chain: 'Ethereum', change24h: 44.1, usdValue: '$340K' },
  { token: 'FLOKI', amount: '980B', chain: 'BNB Chain', change24h: 18.3, usdValue: '$210K' },
  { token: 'BABYDOGE', amount: '540B', chain: 'BNB Chain', change24h: -8.9, usdValue: '$76K' },
  { token: 'DOGE', amount: '120M', chain: 'Dogecoin', change24h: 2.1, usdValue: '$15.6M' },
];

const CHAIN_STATS: ChainStat[] = [
  { chain: 'BNB Chain', burnPct: 52.3, color: '#F0B90B' },
  { chain: 'Ethereum', burnPct: 28.7, color: '#627EEA' },
  { chain: 'Terra', burnPct: 8.2, color: '#5493F7' },
  { chain: 'Solana', burnPct: 5.4, color: '#9945FF' },
  { chain: 'Polygon', burnPct: 3.1, color: '#8247E5' },
  { chain: 'Other', burnPct: 2.3, color: '#666666' },
];

const OVERVIEW = {
  totalBurned: '9,847,552,118',
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

// ── Component ──────────────────────────────────────────────────────────

export default function CryptoPageClient() {
  const [burnTokens] = useState<BurnToken[]>(SEED_BURN_TOKENS);
  const [feed, setFeed] = useState<FeedItem[]>(
    Array.from({ length: 6 }, (_, i) => randomFeedItem(i))
  );

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
    const id = setInterval(refreshFeed, 6000);
    return () => clearInterval(id);
  }, [refreshFeed]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white -mx-4 -mt-8 px-4 pt-8 pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">🔥 Crypto Burn Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Real-time burn analytics across {OVERVIEW.trackedChains} chains
            </p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <span className="block">Data refreshes every 6s</span>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1" />
            Live
          </div>
        </div>

        {/* Price Ticker */}
        <CryptoPriceTicker />

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Total Burned" value={OVERVIEW.totalBurned} detail="all-time tokens" />
          <StatCard label="USD Value" value={OVERVIEW.usdBurned} detail="current valuation" />
          <StatCard label="24h Burn" value={OVERVIEW.burnRate24h} detail="last 24 hours" />
          <StatCard label="Active Tokens" value={String(OVERVIEW.activeTokens)} detail="burning right now" />
          <StatCard label="Chains" value={String(OVERVIEW.trackedChains)} detail="tracked" />
          <StatCard label="Burn Events" value={OVERVIEW.burnEvents24h} detail="in last 24h" />
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
                        {t.change24h >= 0 ? '+' : ''}
                        {t.change24h.toFixed(1)}%
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
                <div
                  key={i}
                  className={`flex items-start gap-3 text-sm ${
                    i === 0 ? 'bg-gray-800 rounded-lg p-3 -mx-3 border border-orange-500/20' : ''
                  }`}
                >
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
                <div key={c.chain}>
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

// ── Sub-components ─────────────────────────────────────────────────────

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-gray-600 text-xs mt-0.5">{detail}</p>
    </div>
  );
}