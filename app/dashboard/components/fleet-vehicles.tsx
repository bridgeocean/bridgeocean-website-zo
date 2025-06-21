"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Plus, Edit, Trash2, Eye } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface Vehicle {
  id: string
  name: string
  model: string
  year: number
  vehicle_type: string
  status: string
  price_per_hour: number
  passengers: number
  features: string[]
  created_at: string
}

export function FleetVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      setLoading(true)

      if (!isSupabaseConfigured()) {
        // Demo data
        setVehicles([
          {
            id: "1",
            name: "Toyota Camry 2020",
            model: "Camry",
            year: 2020,
            vehicle_type: "Sedan",
            status: "available",
            price_per_hour: 15000,
            passengers: 4,
            features: ["AC", "GPS", "Bluetooth"],
            created_at: "2025-06-01T10:00:00Z",
          },
          {
            id: "2",
            name: "GMC Terrain 2021",
            model: "Terrain",
            year: 2021,
            vehicle_type: "SUV",
            status: "booked",
            price_per_hour: 25000,
            passengers: 7,
            features: ["AC", "GPS", "Entertainment System"],
            created_at: "2025-06-02T11:00:00Z",
          },
        ])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("fleet_vehicles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading vehicles:", error)
        setVehicles([])
      } else {
        setVehicles(data || [])
      }
    } catch (error) {
      console.error("Error in loadVehicles:", error)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-500"
      case "booked":
        return "bg-red-500"
      case "maintenance":
        return "bg-yellow-500"
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

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No vehicles in fleet</h3>
        <p className="text-muted-foreground mb-4">Add vehicles to your charter fleet to start accepting bookings.</p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
    )
  }

  const availableVehicles = vehicles.filter((v) => v.status === "available").length
  const bookedVehicles = vehicles.filter((v) => v.status === "booked").length
  const avgPrice = vehicles.reduce((sum, v) => sum + (v.price_per_hour || 0), 0) / vehicles.length

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableVehicles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Booked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{bookedVehicles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price/Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{Math.round(avgPrice).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Fleet Overview</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Passengers</TableHead>
            <TableHead>Price/Hour</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-sm text-muted-foreground">{vehicle.model}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{vehicle.vehicle_type}</TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell>{vehicle.passengers}</TableCell>
              <TableCell className="font-medium">₦{vehicle.price_per_hour?.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
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
