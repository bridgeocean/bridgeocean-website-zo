"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Zap, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GapperPro Scanner</h1>
                <p className="text-sm text-gray-600">Real-time premarket gap analysis</p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              LIVE
            </Badge>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Gap Scanner</h2>
          <p className="text-xl text-gray-600 mb-8">
            Real-time Finviz Elite integration • 5 custom filters • Live news feed
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/public-dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="w-5 h-5 mr-2" />
                Launch Scanner
              </Button>
            </Link>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/yourusername/gapper-scanner" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                View Source
              </a>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Live Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Real-time Finviz Elite API integration with 30-second auto-refresh</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Smart Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                5 criteria: Price $1-5, Volume 5x+, Gap 5%+, Performance +10%, Float &lt;20M
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Visual Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">🔥 Hot stocks, ⚡ Momentum alerts, 📢 Catalyst news, ⚠️ Risk warnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📊 Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">LIVE</div>
                <div className="text-sm text-gray-600">Data Status</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{currentTime.toLocaleTimeString()}</div>
                <div className="text-sm text-gray-600">EST Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">6</div>
                <div className="text-sm text-gray-600">Stocks Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">30s</div>
                <div className="text-sm text-gray-600">Refresh Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 How to Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📱 Direct Access</h3>
                <p className="text-gray-600 mb-3">Click "Launch Scanner" above or visit:</p>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">/public-dashboard</code>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🌐 Deploy Your Own</h3>
                <p className="text-gray-600 mb-3">
                  1. Click "Deploy" button in v0
                  <br />
                  2. Connect GitHub account
                  <br />
                  3. Set FINVIZ_API_TOKEN variable
                  <br />
                  4. Get your unique URL
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
