import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("gapperpro-auth")
    const authenticated = authCookie?.value === "authenticated"

    return NextResponse.json({ authenticated })
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}
