import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const RESET_CODE = process.env.GAPPERPRO_RESET_CODE || "RESET2024"

export async function POST(request: NextRequest) {
  try {
    const { resetCode, newPassword } = await request.json()

    if (resetCode !== RESET_CODE) {
      return NextResponse.json({ success: false, error: "Invalid reset code" }, { status: 401 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Clear auth cookie to force re-login
    const cookieStore = await cookies()
    cookieStore.delete("gapperpro-auth")

    return NextResponse.json({
      success: true,
      message: `Password reset successful! Set GAPPERPRO_PASSWORD="${newPassword}" in your environment variables.`,
    })
  } catch (error) {
    console.error("Reset error:", error)
    return NextResponse.json({ success: false, error: "Reset failed" }, { status: 500 })
  }
}
