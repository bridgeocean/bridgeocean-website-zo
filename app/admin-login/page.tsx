"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Check password
    if (password === "bridgeocean2024") {
      // Set authentication in localStorage
      localStorage.setItem("bridgeoceanAdminAuth", "true")
      localStorage.setItem("adminLoginTime", Date.now().toString())

      // Set user data for the auth provider
      const adminUser = {
        email: "admin@bridgeocean.com",
        name: "Admin User",
        role: "admin",
      }
      localStorage.setItem("user", JSON.stringify(adminUser))

      // Small delay to ensure localStorage is set
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } else {
      setError("Invalid password. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Bridgeocean Admin Login</CardTitle>
          <CardDescription className="text-center">Access your admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password:</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-gray-600">Contact system administrator for access credentials</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
