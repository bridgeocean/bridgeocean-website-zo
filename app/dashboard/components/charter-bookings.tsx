"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { CalendarDays, Car, MapPin, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

interface Booking {
  id: string
  customer_name: string
  customer_phone: string
  pickup_location: string
  destination: string
  pickup_date: string
  pickup_time: string
  vehicle_type: string
  total_amount: number
  status: string
  created_at: string
}

/* -------------------------------------------------------------------------- */
/*                              Demo / Fallback                               */
/* -------------------------------------------------------------------------- */

const DEMO_BOOKINGS: Booking[] = [
  {
    id: "1",
    customer_name: "John Doe",
    customer_phone: "+234 801 234 5678",
    pickup_location: "Victoria Island, Lagos",
    destination: "Murtala Muhammed Airport",
    pickup_date: "2025-06-15",
    pickup_time: "14:00",
    vehicle_type: "Toyota Camry",
    total_amount: 25_000,
    status: "confirmed",
    created_at: "2025-06-08T10:30:00Z",
  },
  {
    id: "2",
    customer_name: "Sarah Williams",
    customer_phone: "+234 802 345 6789",
    pickup_location: "Ikeja GRA",
    destination: "Lekki Phase 1",
    pickup_date: "2025-06-16",
    pickup_time: "09:30",
    vehicle_type: "GMC Terrain",
    total_amount: 35_000,
    status: "pending",
    created_at: "2025-06-08T11:15:00Z",
  },
]

/* -------------------------------------------------------------------------- */
/*                               Helper Utils                                 */
/* -------------------------------------------------------------------------- */

function isSupabaseReady() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-500"
    case "pending":
      return "bg-yellow-500"
    case "completed":
      return "bg-blue-500"
    case "cancelled":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

/* -------------------------------------------------------------------------- */
/*                               React Widget                                 */
/* -------------------------------------------------------------------------- */

export function CharterBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)

      /* ---------- Use demo when Supabase is not configured ---------- */
      if (!isSupabaseReady()) {
        console.info("Supabase env vars missing – using demo data.")
        setBookings(DEMO_BOOKINGS)
        setLoading(false)
        return
      }

      /* ---------- Create client on the fly (browser-side only) ---------- */
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      /* ---------- Run query with a 5 s timeout ---------- */
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      try {
        const { data, error } = await supabase
          .from("charter_bookings")
          .select("*")
          .order("created_at", { ascending: false })
          .abortSignal(controller.signal)

        if (cancelled) return

        if (error) {
          console.error("Supabase error:", error.message)
          setBookings(DEMO_BOOKINGS)
        } else if (!data || data.length === 0) {
          console.warn("No bookings returned – showing demo data.")
          setBookings(DEMO_BOOKINGS)
        } else {
          setBookings(data as Booking[])
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Fetch failed:", err)
          setBookings(DEMO_BOOKINGS)
        }
      } finally {
        clearTimeout(timeout)
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  /* ---------------------------- UI helpers ---------------------------- */

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="py-8 text-center">
        <CalendarDays className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No bookings yet</h3>
        <p className="mb-4 text-muted-foreground">
          Charter bookings will appear here once customers make reservations.
        </p>
        <Button>Create Test Booking</Button>
      </div>
    )
  }

  /* ------------------------------ Render ------------------------------ */

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter((b) => new Date(b.pickup_date).toDateString() === new Date().toDateString()).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{bookings.reduce((sum, b) => sum + (b.total_amount ?? 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{b.customer_name}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {b.customer_phone}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{b.pickup_location}</div>
                    <div className="text-xs text-muted-foreground">→ {b.destination}</div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{new Date(b.pickup_date).toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">{b.pickup_time}</div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{b.vehicle_type}</span>
                </div>
              </TableCell>

              <TableCell className="font-medium">₦{b.total_amount.toLocaleString()}</TableCell>

              <TableCell>
                <Badge className={statusColor(b.status)}>{b.status}</Badge>
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
