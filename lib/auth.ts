"use server"

import { cookies } from "next/headers"

// Simple password for development - in production use proper hashing
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || "password123"
const RESET_CODE = process.env.RESET_CODE || "RESET2024"

export async function verifyPassword(password: string) {
  try {
    // Simple password comparison for development
    const isValid = password === DASHBOARD_PASSWORD

    if (isValid) {
      const cookieStore = await cookies()
      cookieStore.set("dashboard-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/",
        sameSite: "lax",
      })
      return { success: true }
    }

    return { success: false, error: "Invalid password" }
  } catch (error) {
    console.error("Auth error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

export async function resetPassword(resetCode: string, newPassword: string) {
  if (resetCode !== RESET_CODE) {
    return { success: false, error: "Invalid reset code" }
  }

  if (newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  // In production, you'd update the database here
  // For now, we'll just clear the auth cookie to force re-login
  const cookieStore = await cookies()
  cookieStore.delete("dashboard-auth")

  return {
    success: true,
    message: "Password reset successful. Please set DASHBOARD_PASSWORD environment variable to the new password.",
  }
}

export async function checkAuth() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("dashboard-auth")
    return authCookie?.value === "authenticated"
  } catch (error) {
    console.error("Check auth error:", error)
    return false
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("dashboard-auth")
}
