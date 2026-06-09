'use client';

import { useEffect, useState } from 'react'

type BurnData = {
  symbol: string
  timeframe: string
  burn_amount: number
  burn_value_usd: number
  timestamp: string
  source: string
  historical?: Array<{
    date: string
    burn_amount: number
    burn_value_usd: number
  }>
}

type InflationData = {
  country: string
  countryCode: string
  indicator: string
  value: number
  unit: string
  frequency: string
  timestamp: string
  source: string
  historical?: Array<{
    date: string
    value: number
  }>
}

type TopBurningToken = {
  symbol: string
  name: string
  burned: string // formatted like "1.2B"
  burnedRaw: number
  change24h: number
  icon: string // URL or emoji
}

type BurnAnalysisPoint = {
  date: string
  value: number
}

type RecentBurnActivity = {
  amount: string
  token: string
  hash: string
  timeAgo: string
  icon: string
  change24h: number
}

export default function Page() {
  const [burnData, setBurnData] = useState<BurnData | null>(null)
  const [inflationData, setInflationData] = useState<InflationData | null>(null)
  const [topTokens, setTopTokens] = useState<TopBurningToken[]>([])
  const [chartData, setChartData] = useState<BurnAnalysisPoint[]>([])
  const [alert, setAlert] = useState<string | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentBurnActivity[]>([])

  useEffect(() => {
    // Set mock burn data (ETH)
    const burnAmount = 1800
    const price = 1800
    const burnValueUsd = burnAmount * price
    const mockBurnData: BurnData = {
      symbol: 'ETH',
      timeframe: '24h',
      burn_amount: burnAmount,
      burn_value_usd: burnValueUsd,
      timestamp: new Date().toISOString(),
      source: 'mock',
      historical: [
        {
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          burn_amount: burnAmount - 100,
          burn_value_usd: (burnAmount - 100) * price,
        },
        {
          date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
          burn_amount: burnAmount + 50,
          burn_value_usd: (burnAmount + 50) * price,
        },
      ],
    }
    setBurnData(mockBurnData)

    // Set mock inflation data (US CPI)
    const mockInflationData: InflationData = {
      country: 'United States',
      countryCode: 'US',
      indicator: 'CPI',
      value: 3.2,
      unit: 'percent',
      frequency: 'monthly',
      timestamp: new Date().toISOString(),
      source: 'mock',
      historical: [
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 3.0,
        },
        {
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 3.3,
        },
      ],
    }
    setInflationData(mockInflationData)

    // Fetch top burning tokens (mock)
    fetchTopTokens()

    // Fetch burn analysis chart data (mock)
    fetchChartData()

    // Fetch recent burn activity (mock)
    fetchRecentActivity()

    // Check for alerts (mock)
    checkForAlerts()
  }, [])

  const fetchTopTokens = () => {
    // Mock data for top burning tokens
    const mockTopTokens: TopBurningToken[] = [
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        burned: '1.2B',
        burnedRaw: 1200000000,
        change24h: 0.0,
        icon: '🔶' // Using emoji for simplicity, could be image URL
      },
      {
        symbol: 'SHIB',
        name: 'Shiba Inu',
        burned: '890M',
        burnedRaw: 890000000,
        change24h: 12.6,
        icon: '🔺'
      },
      {
        symbol: 'LUNA',
        name: 'Terra',
        burned: '456M',
        burnedRaw: 456000000,
        change24h: 0.7,
        icon: '🔺'
      },
      {
        symbol: 'HT',
        name: 'Huobi Token',
        burned: '210M',
        burnedRaw: 210000000,
        change24h: -1.2,
        icon: '🔷'
      }
    ]
    setTopTokens(mockTopTokens)
  }

  const fetchChartData = () => {
    // Mock chart data for burn analysis (last 24 hours)
    const now = Date.now()
    const mockChartData: BurnAnalysisPoint[] = []
    for (let i = 0; i < 24; i++) {
      mockChartData.push({
        date: new Date(now - i * 3600000).toISOString().split('T')[0] + ' ' + new Date(now - i * 3600000).toTimeString().slice(0, 5),
        value: 250 + Math.random() * 50 // Random value between 250-300
      })
    }
    // Reverse to show oldest first
    setChartData(mockChartData.reverse())
  }

  const fetchRecentActivity = () => {
    // Mock recent burn activity
    const mockRecentActivity: RecentBurnActivity[] = [
      {
        amount: '450,000',
        token: 'HT',
        hash: '0x9e6...3f10',
        timeAgo: '5m ago',
        icon: '🔶',
        change24h: -1.2
      },
      {
        amount: '780,000',
        token: 'TRX',
        hash: '0x70...e5a2',
        timeAgo: '15m ago',
        icon: '🎵', // Music note for TRX
        change24h: 2.1
      },
      {
        amount: '2,300,000',
        token: 'AVAX',
        hash: '0xd1...e96c',
        timeAgo: '30m ago',
        icon: '🔺',
        change24h: 0.8
      }
    ]
    setRecentActivity(mockRecentActivity)
  }

  const checkForAlerts = () => {
    // Mock alert checking - randomly show alert sometimes
    if (Math.random() > 0.7) { // 30% chance of alert
      setAlert('ALERT: Massive Burn Detected!')
    } else {
      setAlert(null)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 dark:bg-gray-900 text-gray-100 p-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
              🔥
            </div>
            <h1 className="text-2xl font-bold">Crypto Burn Tracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search token or address..."
              className="px-3 py-1 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="text-cyan-400">BTC $65,432</div>
            <button
              className="px-4 py-2 bg-transparent border border-cyan-500 text-cyan-500 rounded hover:bg-cyan-900/20 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        </header>

        {/* Total Burned Statistics */}
        {burnData && (
          <section className="mb-6">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  🔥
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Total Burned</h2>
                <p className="text-4xl font-bold">
                  {burnData.burn_amount.toLocaleString()}
                </p>
                <div className="h-0.5 bg-gray-700 mt-2 mb-2">
                  <div className="h-full bg-cyan-500 w-1/3" />
                </div>
                <div className="text-sm text-gray-400">
                  Supply Remaining: <span className="block w-32 bg-gray-700 h-1.5 rounded"> </span> 65%
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-sm text-gray-400">Burn Rate</div>
                <div className="text-lg font-bold text-green-500">3.5% / hr</div>
                <div className="h-1 bg-gray-700 mt-1">
                  <div className="h-full bg-green-500 w-1/2" />
                </div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-sm text-gray-400">Supply Remaining</div>
                <div className="text-lg font-bold">68.2B</div>
                <div className="h-1 bg-gray-700 mt-1">
                  <div className="h-full bg-cyan-500 w-4/5" />
                </div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-sm text-gray-400">24h Burn Change</div>
                <div className="text-lg font-bold text-green-500">+8.2%</div>
              </div>
            </div>
          </section>
        )}

        {/* Alert */}
        {alert && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-red-500">⚠️</span>
              </div>
              <div className="text-red-400">{alert}</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Left Side: Chart and Top Burning Tokens */}
          <div className="space-y-6">
            {/* Burn Analysis Chart */}
            <section className="bg-gray-800 rounded p-4">
              <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                <span>Burn Analysis</span>
                <div className="flex space-x-2 text-sm text-gray-400">
                  <button className="px-2 py-1 border border-gray-700 rounded">{'1D'}</button>
                  <button className="px-2 py-1 border border-gray-700 rounded">{'1W'}</button>
                  <button className="px-2 py-1 border border-gray-700 rounded">{'1M'}</button>
                  <button className="px-2 py-1 border border-gray-700 rounded">{'ALL'}</button>
                </div>
              </h2>
              <div className="h-48 bg-gray-900 rounded relative overflow-hidden">
                {/* In a real app, we'd use a charting library like Chart.js or Recharts */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-20" />
                <div className="absolute inset-0 pointer-events-none">
                  {/* Mock chart line - in reality this would be a proper chart */}
                  <div className="h-full w-full relative">
                    {chartData.map((point, index) => {
                      const x = (index / (chartData.length - 1)) * 100
                      const y = 100 - ((point.value - 200) / (300 - 200)) * 100 // Scale 200-300 to 0-100%
                      return (
                        <div
                          key={index}
                          className="absolute"
                          style={{
                            left: `${x}%`,
                            bottom: `${y}%`,
                            width: '2px',
                            height: '4px',
                            backgroundColor: 'cyan'
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Top Burning Tokens */}
            <section className="bg-gray-800 rounded p-4">
              <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                <span>Top Burning Tokens</span>
                <button
                  className="px-3 py-1 bg-transparent border border-gray-600 text-gray-300 rounded hover:bg-gray-700/50 text-sm"
                >
                  View All Tokens
                </button>
              </h2>
              <div className="grid gap-3">
                {topTokens.map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded"
                  >
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                      {token.icon}
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-sm text-gray-400">{token.name}</span>
                      </div>
                      <div className="text-lg font-bold">{token.burned}</div>
                    </div>
                    <button
                      className="px-2 py-1 bg-transparent border border-gray-600 text-gray-300 rounded text-xs hover:bg-gray-700/50"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Side: Alerts & Latest Burns, and Table */}
          <div className="space-y-6">
            {/* Alerts & Latest Burns */}
            <section className="bg-gray-800 rounded p-4">
              <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                <span>Latest Burns</span>
                {alert && (
                  <div className="flex items-start space-x-2 text-sm">
                    <div className="flex-shrink-0">
                      <span className="text-red-500">⚠️</span>
                    </div>
                    <div className="text-red-400">{alert}</div>
                  </div>
                )}
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.hash} className="flex items-start space-x-3 p-2 bg-gray-900/50 rounded">
                    <div className="w-8 h-8 flex-shrink-0 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                      {activity.icon}
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span className="font-medium">{activity.amount} {activity.token}</span>
                        <span className={
                          `text-sm font-medium ${activity.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`
                        }>
                          {activity.change24h >= 0 ? `+${activity.change24h}%` : `${activity.change24h}%`}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.hash} • {activity.timeAgo}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="w-full mt-4 px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded hover:bg-gray-700/50 flex items-center justify-center space-x-2 text-sm"
                >
                  <span>🔥</span> View All Tokens
                </button>
              </div>
            </section>

            {/* Top Burned Tokens Table */}
            <section className="bg-gray-800 rounded p-4">
              <h2 className="text-xl font-semibold mb-4">Top Burned Tokens</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Burned</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">24h Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr className="bg-gray-900">
                      <td className="px-4 py-3 text-sm font-medium text-gray-100">#1</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-100">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-500">🔺</span>
                          <span>MATIC</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">(Polygon)</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-100">678M</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-500">+12.5%</td>
                    </tr>
                    <tr className="bg-gray-900">
                      <td className="px-4 py-3 text-sm font-medium text-gray-100">#2</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-100">
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-500">🔷</span>
                          <span>PTT</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">(Solana)</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-100">345M</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-500">+8.7%</td>
                    </tr>
                    <tr className="bg-gray-900">
                      <td className="px-4 py-3 text-sm font-medium text-gray-100">#3</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-100">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-500">🔶</span>
                          <span>CRO</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">(Cronos)</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-100">210M</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-500">-2.1%</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4">
                  <button
                    className="w-full px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded hover:bg-gray-700/50 flex items-center justify-center space-x-2 text-sm"
                  >
                    <span>🔥</span> View All Tokens
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}