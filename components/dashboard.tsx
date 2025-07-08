"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  RefreshCw,
  LogOut,
  Clock,
  TrendingUp,
  Wifi,
  WifiOff,
} from "lucide-react"
import { getGapperStocks, type Stock, type NewsItem } from "@/lib/stock-service"
import ChartPopup from "./chart-popup"

type SortField = "symbol" | "price" | "gap" | "volume" | "relativeVolume" | "float" | "performance"
type SortDirection = "asc" | "desc"

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [sortField, setSortField] = useState<SortField>("gap")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isLiveData, setIsLiveData] = useState(false)

  const loadData = async () => {
    try {
      // const [stocksData, newsData] = await Promise.all([getGapperStocks(), getStockNews(stocks.map((s) => s.symbol))])
      // 1️⃣ live stocks (still works fine in the browser)
      const stocksData = await getGapperStocks()

      // 2️⃣ fresh news – fetched server-side to avoid CORS
      const newsRes = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols: stocksData.map((s) => s.symbol) }),
      })
      const { news: newsData = [] } = await newsRes.json()

      setStocks(stocksData)
      setNews(newsData)
      setLastUpdate(new Date())

      // Check if we're getting real data (not mock)
      setIsLiveData(stocksData.length > 0 && stocksData[0].symbol !== "DEMO")
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadData()
    }, 30000) // 30 seconds for real-time data

    return () => clearInterval(interval)
  }, [autoRefresh, stocks])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedStocks = [...stocks].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const multiplier = sortDirection === "asc" ? 1 : -1

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * multiplier
    }

    return (Number(aVal) - Number(bVal)) * multiplier
  })

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
    return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
  }

  const getSentimentIcon = (sentiment: NewsItem["sentiment"]) => {
    switch (sentiment) {
      case "bullish":
        return "🟢"
      case "bearish":
        return "🔴"
      case "neutral":
        return "⚪"
      default:
        return "⚪"
    }
  }

  const getVisualIndicators = (stock: Stock) => {
    const indicators = []

    // 🔥 Hot: Gap >20% + Volume >10x
    if (stock.gap > 20 && stock.relativeVolume > 10) {
      indicators.push(
        <Badge key="hot" variant="destructive" className="bg-red-500 hover:bg-red-600">
          🔥 Hot
        </Badge>,
      )
    }

    // ⚡ Momentum: High performance (simulating consistent green candles)
    if (stock.performance > 20) {
      indicators.push(
        <Badge key="momentum" variant="default" className="bg-yellow-500 hover:bg-yellow-600">
          ⚡ Momentum
        </Badge>,
      )
    }

    // 📢 Catalyst: Fresh news <15 minutes (simulated with newsCount > 2)
    if (stock.newsCount > 2) {
      indicators.push(
        <Badge key="catalyst" variant="default" className="bg-blue-500 hover:bg-blue-600">
          📢 Catalyst
        </Badge>,
      )
    }

    // ⚠️ Risk: High volatility warning (gap >15% or very high volume)
    if (stock.gap > 15 || stock.relativeVolume > 15) {
      indicators.push(
        <Badge key="risk" variant="outline" className="border-orange-500 text-orange-600">
          ⚠️ Risk
        </Badge>,
      )
    }

    return indicators
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours}h ${diffMins % 60}m ago`
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      onLogout()
    } catch (error) {
      console.error("Logout error:", error)
      onLogout()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading Finviz Elite data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📈 GapperPro Scanner</h1>
            <div className="text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                Last update: {formatTime(lastUpdate)} EST | Found: {stocks.length}/10 stocks
              </span>
              {isLiveData ? (
                <Badge variant="default" className="bg-green-500">
                  <Wifi className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              ) : (
                <Badge variant="outline" className="border-orange-500 text-orange-600">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Demo Data
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
              Auto: {autoRefresh ? "ON" : "OFF"}
            </Button>
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* API Status Alert */}
        {!isLiveData && (
          <Alert>
            <AlertDescription>
              <strong>Demo Mode:</strong> Using sample data. Add your FINVIZ_API_TOKEN environment variable for live
              data.
            </AlertDescription>
          </Alert>
        )}

        {/* Filters Badge */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">✅ Price: $1-5</Badge>
              <Badge variant="secondary">✅ Volume: 5x+</Badge>
              <Badge variant="secondary">✅ Gap: 5%+</Badge>
              <Badge variant="secondary">✅ Performance: +10%</Badge>
              <Badge variant="secondary">✅ Float: &lt;20M</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Visual Indicators Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Smart Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="bg-red-500">
                  🔥 Hot
                </Badge>
                <span className="text-gray-600">Gap &gt;20% + Vol &gt;10x</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-yellow-500">
                  ⚡ Momentum
                </Badge>
                <span className="text-gray-600">Strong performance trend</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-blue-500">
                  📢 Catalyst
                </Badge>
                <span className="text-gray-600">Fresh news &lt;15 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-orange-500 text-orange-600">
                  ⚠️ Risk
                </Badge>
                <span className="text-gray-600">High volatility warning</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stocks Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top 10 Gapper Stocks
              {isLiveData && (
                <Badge variant="default" className="bg-green-500 text-xs">
                  LIVE
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("symbol")} className="h-auto p-0 font-semibold">
                        Symbol {getSortIcon("symbol")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("price")} className="h-auto p-0 font-semibold">
                        Price {getSortIcon("price")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("gap")} className="h-auto p-0 font-semibold">
                        Gap% {getSortIcon("gap")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("relativeVolume")}
                        className="h-auto p-0 font-semibold"
                      >
                        Vol {getSortIcon("relativeVolume")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("float")} className="h-auto p-0 font-semibold">
                        Float {getSortIcon("float")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("performance")}
                        className="h-auto p-0 font-semibold"
                      >
                        Perf% {getSortIcon("performance")}
                      </Button>
                    </TableHead>
                    <TableHead>Indicators</TableHead>
                    <TableHead>Chart</TableHead>
                    <TableHead>News</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStocks.map((stock, index) => (
                    <TableRow key={stock.symbol}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-bold">{stock.symbol}</TableCell>
                      <TableCell>${stock.price.toFixed(2)}</TableCell>
                      <TableCell className="text-green-600 font-semibold">+{stock.gap.toFixed(1)}%</TableCell>
                      <TableCell>{stock.relativeVolume.toFixed(1)}x</TableCell>
                      <TableCell>{(stock.float / 1000000).toFixed(1)}M</TableCell>
                      <TableCell className="text-green-600 font-semibold">+{stock.performance.toFixed(1)}%</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">{getVisualIndicators(stock)}</div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setSelectedChart(stock.symbol)}>
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stock.newsCount > 0 ? "default" : "secondary"}>{stock.newsCount}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* News Feed */}
        <Card>
          <CardHeader>
            <CardTitle>📰 Catalyst News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {news.length === 0 ? (
                <Alert>
                  <AlertDescription>No recent news for current stocks.</AlertDescription>
                </Alert>
              ) : (
                news.map((item, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getSentimentIcon(item.sentiment)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{item.symbol}</Badge>
                          <span className="text-sm text-gray-500">{getTimeAgo(item.publishedAt)}</span>
                          <span className="text-sm text-gray-500">• {item.source}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-700 text-sm mb-2">{item.summary}</p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          💬 Full Story →
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Popup */}
      {selectedChart && <ChartPopup symbol={selectedChart} onClose={() => setSelectedChart(null)} />}
    </div>
  )
}
