"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, MapPin, User, Phone, Car } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

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

export function CharterBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)

      if (!isSupabaseConfigured()) {
        // Demo data
        setBookings([
          {
            id: "1",
            customer_name: "John Doe",
            customer_phone: "+234 801 234 5678",
            pickup_location: "Victoria Island, Lagos",
            destination: "Murtala Muhammed Airport",
            pickup_date: "2025-06-15",
            pickup_time: "14:00",
            vehicle_type: "Toyota Camry",
            total_amount: 25000,
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
            total_amount: 35000,
            status: "pending",
            created_at: "2025-06-08T11:15:00Z",
          },
        ])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("charter_bookings")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading bookings:", error)
        setBookings([])
      } else {
        setBookings(data || [])
      }
    } catch (error) {
      console.error("Error in loadBookings:", error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
        <p className="text-muted-foreground mb-4">
          Charter bookings will appear here once customers make reservations.
        </p>
        <Button>Create Test Booking</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
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
              ₦{bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

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
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{booking.customer_name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {booking.customer_phone}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{booking.pickup_location}</div>
                    <div className="text-xs text-muted-foreground">→ {booking.destination}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{new Date(booking.pickup_date).toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">{booking.pickup_time}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.vehicle_type}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">₦{booking.total_amount?.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
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
