"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, BarChart3 } from "lucide-react"
import { getChartData } from "@/lib/stock-service"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ChartPopupProps {
  symbol: string
  onClose: () => void
}

interface ChartData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export default function ChartPopup({ symbol, onClose }: ChartPopupProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChart = async () => {
      try {
        const data = await getChartData(symbol)
        setChartData(data)
      } catch (error) {
        console.error("Failed to load chart:", error)
      } finally {
        setLoading(false)
      }
    }

    loadChart()
  }, [symbol])

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatPrice = (value: number) => {
    return `$${value.toFixed(2)}`
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close if clicking the backdrop (not the card)
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {symbol} - 5 Minute Chart
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 animate-pulse mx-auto mb-2" />
                <p>Loading chart data...</p>
              </div>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tickFormatter={formatTime} interval="preserveStartEnd" />
                  <YAxis domain={["dataMin - 0.1", "dataMax + 0.1"]} tickFormatter={formatPrice} />
                  <Tooltip
                    labelFormatter={(value) => `Time: ${formatTime(value as string)}`}
                    formatter={(value: number) => [formatPrice(value), "Price"]}
                  />
                  <Line type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-4 text-sm text-gray-600 text-center">
            Click outside this popup to close • Data updates every 5 minutes
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
