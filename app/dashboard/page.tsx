"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Car, Users, UserPlus, Settings, Plus } from "lucide-react"
import { CharterBookings } from "./components/charter-bookings"
import { FleetVehicles } from "./components/fleet-vehicles"
import { PartnerRegistrations } from "./components/partner-registrations"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalVehicles: 0,
    totalPartners: 0,
    pendingPartners: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("bridgeoceanAdminAuth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      loadDashboardStats()
    } else {
      router.push("/admin-login")
    }
  }, [router])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)

      if (!isSupabaseConfigured()) {
        // Demo data when Supabase is not configured
        setStats({
          totalBookings: 18,
          totalVehicles: 12,
          totalPartners: 8,
          pendingPartners: 3,
        })
        setLoading(false)
        return
      }

      // Load real data from Supabase
      const [bookingsResult, vehiclesResult, partnersResult] = await Promise.allSettled([
        supabase.from("charter_bookings").select("id", { count: "exact" }),
        supabase.from("fleet_vehicles").select("id", { count: "exact" }),
        supabase.from("partner_registrations").select("id, status", { count: "exact" }),
      ])

      let totalBookings = 0
      let totalVehicles = 0
      let totalPartners = 0
      let pendingPartners = 0

      // Handle bookings result
      if (bookingsResult.status === "fulfilled" && !bookingsResult.value?.error) {
        totalBookings = bookingsResult.value.count || bookingsResult.value.data?.length || 0
      }

      // Handle vehicles result
      if (vehiclesResult.status === "fulfilled" && !vehiclesResult.value?.error) {
        totalVehicles = vehiclesResult.value.count || vehiclesResult.value.data?.length || 0
      }

      // Handle partners result
      if (partnersResult.status === "fulfilled" && !partnersResult.value?.error) {
        const partners = partnersResult.value.data || []
        totalPartners = partners.length
        pendingPartners = partners.filter((p) => p.status === "pending").length
      }

      setStats({
        totalBookings,
        totalVehicles,
        totalPartners,
        pendingPartners,
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
      // Fallback to demo data on any error
      setStats({
        totalBookings: 18,
        totalVehicles: 12,
        totalPartners: 8,
        pendingPartners: 3,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Charter & Partner Dashboard</h2>
            <p className="text-muted-foreground">Manage charter bookings, fleet vehicles, and partner registrations</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/charter/book">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Booking
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {!isSupabaseConfigured() && (
          <Alert>
            <Car className="h-4 w-4" />
            <AlertDescription>
              Database not configured. Showing demo data. Add your Supabase environment variables to see live data.
              <br />
              <strong>Required:</strong> NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Charter Bookings</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : stats.totalBookings}
              </div>
              <p className="text-xs text-muted-foreground">Total bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fleet Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : stats.totalVehicles}
              </div>
              <p className="text-xs text-muted-foreground">Available vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : stats.totalPartners}
              </div>
              <p className="text-xs text-muted-foreground">Registered partners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Partners</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : stats.pendingPartners}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Charter Bookings</TabsTrigger>
            <TabsTrigger value="vehicles">Fleet Vehicles</TabsTrigger>
            <TabsTrigger value="partners">Partner Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Charter Bookings</CardTitle>
                <CardDescription>Manage all charter service bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <CharterBookings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Vehicles</CardTitle>
                <CardDescription>Manage your charter vehicle fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <FleetVehicles />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Partner Registrations</CardTitle>
                <CardDescription>Manage partner applications and registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <PartnerRegistrations />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
