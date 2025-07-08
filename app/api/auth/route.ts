import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const DEFAULT_PASSWORD = process.env.GAPPERPRO_PASSWORD || "trader123"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === DEFAULT_PASSWORD) {
      const cookieStore = await cookies()
      cookieStore.set("gapperpro-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/",
        sameSite: "lax",
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
