'use client';

import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import FloatingWidget from "@/components/FloatingWidget";
import { useState, useEffect } from "react";

const stats = {
  totalBurned: "1,482,993,221",
  usdBurned: "$42,118,992",
  topChain: "BNB Chain",
  fastestToken: "SHIB",
};

const burnRateData = [
  { name: "00:00", burn: 900 },
  { name: "04:00", burn: 1100 },
  { name: "08:00", burn: 1600 },
  { name: "12:00", burn: 1300 },
  { name: "16:00", burn: 1900 },
  { name: "20:00", burn: 1500 },
];

const topTokens = [
  { name: "SHIB", amount: "12.3B", chain: "Ethereum" },
  { name: "PEPE", amount: "8.9B", chain: "Ethereum" },
  { name: "FLOKI", amount: "6.2B", chain: "BNB Chain" },
  { name: "BONK", amount: "4.1B", chain: "Solana" },
];

const chainData = [
  { chain: "BNB Chain", burn: 52.3, color: "#FF6B35" },
  { chain: "Ethereum", burn: 18.7, color: "#627EEA" },
  { chain: "Polygon", burn: 12.1, color: "#8247E5" },
  { chain: "Solana", burn: 8.4, color: "#9945FF" },
];

export default function DashboardClient() {
  const [liveFeed, setLiveFeed] = useState([
    { token: "SHIB", amount: "2,100,000", chain: "", timestamp: Date.now() - 3 * 60 * 1000 }, // 3 minutes ago
    { token: "ETH", amount: "0.12", chain: "Base", timestamp: Date.now() - 7 * 60 * 1000 }, // 7 minutes ago
    { token: "LUNC", amount: "50,000", chain: "", timestamp: Date.now() - 12 * 60 * 1000 }, // 12 minutes ago
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveFeed((prev) => {
        // Simulate new burn events
        const tokens = [
          { token: "SHIB", amount: (Math.floor(Math.random() * 3000000) + 1000000).toLocaleString(), chain: "" },
          { token: "ETH", amount: (Math.random() * 0.5 + 0.05).toFixed(2), chain: "Base" },
          { token: "PEPE", amount: (Math.floor(Math.random() * 10000000) + 1000000).toLocaleString(), chain: "Ethereum" },
          { token: "FLOKI", amount: (Math.floor(Math.random() * 8000000) + 1000000).toLocaleString(), chain: "BNB Chain" },
          { token: "BONK", amount: (Math.floor(Math.random() * 5000000) + 1000000).toLocaleString(), chain: "Solana" },
          { token: "LUNC", amount: (Math.floor(Math.random() * 100000) + 5000).toLocaleString(), chain: "" },
        ];
        const token = tokens[Math.floor(Math.random() * tokens.length)];
        const newEntry = {
          token: token.token,
          amount: token.amount,
          chain: token.chain,
          timestamp: Date.now(), // Current time
        };
        // Shift existing entries down and add new one at top, keep max 3
        const updated = [newEntry, ...prev.slice(0, 2)];
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white border-t border-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Tokens Burned" value={stats.totalBurned} subtext="Across 27 tracked chains" />
          <StatCard title="USD Value Burned" value={stats.usdBurned} subtext="Real-time valuation" />
          <StatCard title="Top Burning Chain" value={stats.topChain} subtext="52.3% of all burns today" />
          <StatCard title="Fastest Growing Token" value={stats.fastestToken} subtext="+110% peak burn rate variation" />
        </div>

        <section className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Burn Rate Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={burnRateData}>
              <defs>
                <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
              <Area type="monotone" dataKey="burn" stroke="#FF6B35" fill="url(#burnGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-2">Live Burn Feed</h2>
            <div className="h-[20rem] overflow-hidden text-sm text-gray-300 flex flex-col gap-1">
              {liveFeed.map((item, index) => {
                const timeAgo = Math.floor((Date.now() - item.timestamp) / 60000); // minutes ago
                const timeText = timeAgo < 1 ? 'just now' : `${timeAgo} minute${timeAgo !== 1 ? 's' : ''} ago`;
                return (
                  <p key={index} className="text-gray-500">
                    🔥 {item.amount} {item.token} burned{(item.chain ? ` (${item.chain})` : ``)} — {timeText}
                  </p>
                );
              })}
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

function StatCard({ title, value, subtext }: { title: string; value: string; subtext?: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtext && <p className="text-gray-500 text-xs mt-1">{subtext}</p>}
    </div>
  );
}