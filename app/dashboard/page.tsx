import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Dashboard from "@/components/dashboard"

async function checkAuth() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("dashboard-auth")
    return authCookie?.value === "authenticated"
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
}

export default async function DashboardPage() {
  const isAuthenticated = await checkAuth()

  if (!isAuthenticated) {
    redirect("/login")
  }

  return <Dashboard />
}
