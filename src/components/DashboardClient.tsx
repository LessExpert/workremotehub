'use client';

import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import FloatingWidget from '@/components/FloatingWidget';

const stats = {
  totalBurned: '1,482,993,221',
  usdBurned: '$42,118,992',
  topChain: 'BNB Chain',
  fastestToken: 'SHIB',
};

const burnRateData = [
  { name: '00:00', burn: 1200 },
  { name: '04:00', burn: 3400 },
  { name: '08:00', burn: 2100 },
  { name: '12:00', burn: 4500 },
  { name: '16:00', burn: 3800 },
  { name: '20:00', burn: 5200 },
];

const topTokens = [
  { name: 'SHIB', amount: '12.3B', chain: 'Ethereum' },
  { name: 'USDT', amount: '8.7B', chain: 'BNB Chain' },
  { name: 'USDC', amount: '5.2B', chain: 'Polygon' },
  { name: 'DAI', amount: '3.1B', chain: 'Avalanche' },
];

const chainData = [
  { chain: 'BNB Chain', burn: 52.3, color: '#FF6B35' },
  { chain: 'Ethereum', burn: 18.7, color: '#627EEA' },
  { chain: 'Polygon', burn: 12.1, color: '#8247E5' },
  { chain: 'Solana', burn: 8.4, color: '#9945FF' },
];

export default function DashboardClient() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white border-t border-gray-800">
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-gray-400 text-sm mb-1">Total Tokens Burned</h2>
            <p className="text-2xl font-bold">{stats.totalBurned}</p>
            <p className="text-gray-500 text-sm">Across 27 tracked chains</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-gray-400 text-sm mb-1">USD Value Burned</h2>
            <p className="text-2xl font-bold">{stats.usdBurned}</p>
            <p className="text-gray-500 text-sm">Real-time valuation</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-gray-400 text-sm mb-1">Top Burning Chain</h2>
            <p className="text-2xl font-bold">{stats.topChain}</p>
            <p className="text-gray-500 text-sm">52.3% of all burns today</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-gray-400 text-sm mb-1">Fastest Growing Token</h2>
            <p className="text-2xl font-bold">{stats.fastestToken}</p>
            <p className="text-gray-500 text-sm">+312% burn rate in last 24h</p>
          </div>
        </div>

        {/* Burn Rate Chart */}
        <section className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Burn Rate Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={burnRateData}>
              <defs>
                <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
              <Area type="monotone" dataKey="burn" stroke="#FF6B35" fill="url(#burnGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* Live Feed & Top Tokens */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-2">Live Burn Feed</h2>
            <div className="h-48 overflow-y-auto text-sm text-gray-300">
              <p className="text-gray-500">🔥 2,100,000 SHIB burned — 3 minutes ago</p>
              <p className="text-gray-500">🔥 0.12 ETH burned (Base) — 7 minutes ago</p>
              <p className="text-gray-500">🔥 50,000 LUNC burned — 12 minutes ago</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-2">Top Burning Tokens</h2>
            <table className="w-full text-left">
              <thead className="border-b border-gray-700">
                <tr className="text-gray-400">
                  <th className="pb-2">Token</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Chain</th>
                </tr>
              </thead>
              <tbody>
                {topTokens.map((t) => (
                  <tr key={t.name} className="border-b border-gray-800">
                    <td className="py-2 font-medium">{t.name}</td>
                    <td className="py-2 text-orange-400">{t.amount}</td>
                    <td className="py-2 text-gray-400">{t.chain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Chain Comparison */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {chainData.map((c) => (
            <div key={c.chain} className="bg-gray-900 rounded-xl p-4">
              <p className="text-gray-400 text-sm">{c.chain}</p>
              <p className="text-2xl font-bold text-orange-400">{c.burn}%</p>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${c.burn}%` }} />
              </div>
            </div>
          ))}
        </section>
      </main>
      <FloatingWidget />
    </div>
  );
}