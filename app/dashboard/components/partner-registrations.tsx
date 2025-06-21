"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, User, Phone, Mail, CheckCircle, XCircle, Clock } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface Partner {
  id: string
  name: string
  email: string
  phone: string
  business_name: string
  vehicle_type: string
  experience_years: number
  status: string
  created_at: string
}

export function PartnerRegistrations() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      setLoading(true)

      if (!isSupabaseConfigured()) {
        // Demo data
        setPartners([
          {
            id: "1",
            name: "Michael Johnson",
            email: "michael@example.com",
            phone: "+234 803 456 7890",
            business_name: "MJ Transport Services",
            vehicle_type: "Toyota Camry",
            experience_years: 5,
            status: "pending",
            created_at: "2025-06-08T09:00:00Z",
          },
          {
            id: "2",
            name: "Sarah Williams",
            email: "sarah@example.com",
            phone: "+234 804 567 8901",
            business_name: "SW Logistics",
            vehicle_type: "GMC Terrain",
            experience_years: 3,
            status: "approved",
            created_at: "2025-06-07T14:30:00Z",
          },
          {
            id: "3",
            name: "David Chen",
            email: "david@example.com",
            phone: "+234 805 678 9012",
            business_name: "Chen Motors",
            vehicle_type: "Honda Pilot",
            experience_years: 7,
            status: "rejected",
            created_at: "2025-06-06T11:15:00Z",
          },
        ])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("partner_registrations")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading partners:", error)
        setPartners([])
      } else {
        setPartners(data || [])
      }
    } catch (error) {
      console.error("Error in loadPartners:", error)
      setPartners([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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

  if (partners.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No partner registrations</h3>
        <p className="text-muted-foreground mb-4">Partner applications will appear here when submitted.</p>
        <Button>View Partner Portal</Button>
      </div>
    )
  }

  const approvedPartners = partners.filter((p) => p.status === "approved").length
  const pendingPartners = partners.filter((p) => p.status === "pending").length
  const rejectedPartners = partners.filter((p) => p.status === "rejected").length

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedPartners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingPartners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedPartners}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Partner Applications</h3>
        <Button variant="outline">Export List</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partner Details</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{partner.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {partner.email}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {partner.phone}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-sm">{partner.business_name}</div>
              </TableCell>
              <TableCell>{partner.vehicle_type}</TableCell>
              <TableCell>{partner.experience_years} years</TableCell>
              <TableCell>
                <Badge className={getStatusColor(partner.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(partner.status)}
                    {partner.status}
                  </div>
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(partner.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                  {partner.status === "pending" && (
                    <>
                      <Button size="sm" variant="default">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
