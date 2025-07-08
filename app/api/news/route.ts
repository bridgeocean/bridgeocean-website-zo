import { NextResponse, type NextRequest } from "next/server"
import { getStockNews } from "@/lib/stock-service"

// POST /api/news  { symbols: string[] }
export async function POST(req: NextRequest) {
  try {
    const { symbols } = await req.json()
    const news = await getStockNews(Array.isArray(symbols) ? symbols : [])
    return NextResponse.json({ success: true, news })
  } catch (error) {
    console.error("News API error:", error)
    return NextResponse.json({ success: false, news: [] }, { status: 500 })
  }
}
