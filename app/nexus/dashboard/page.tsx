"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Ambulance, MapPin, Clock, AlertCircle, CheckCircle, User } from "lucide-react"
import { getEmergencyRequests } from "@/lib/nexus-actions"

export default function Dashboard() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getEmergencyRequests()
        setRequests(data)
      } catch (error) {
        console.error("Failed to fetch requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()

    // For demo purposes, let's add some mock data
    setRequests([
      {
        id: "EM-123456",
        name: "John Doe",
        phone: "08012345678",
        emergencyType: "accident",
        description: "Car accident on Lekki Expressway",
        status: "pending",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        location: { lat: 6.4281, lng: 3.4219 },
      },
      {
        id: "EM-123457",
        name: "Jane Smith",
        phone: "08087654321",
        emergencyType: "medical",
        description: "Severe chest pain",
        status: "dispatched",
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        location: { lat: 6.455, lng: 3.3841 },
      },
      {
        id: "EM-123458",
        name: "Robert Johnson",
        phone: "08023456789",
        emergencyType: "fire",
        description: "Building fire at Victoria Island",
        status: "completed",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        location: { lat: 6.4281, lng: 3.4219 },
      },
    ])
    setLoading(false)
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        )
      case "dispatched":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Dispatched
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Nexus Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Welcome, Admin</span>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <h3 className="text-3xl font-bold">{requests.length}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Dispatches</p>
                <h3 className="text-3xl font-bold">{requests.filter((r) => r.status === "dispatched").length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Ambulance className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="text-3xl font-bold">{requests.filter((r) => r.status === "completed").length}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Requests</CardTitle>
          <CardDescription>Manage and respond to emergency requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="dispatched">Dispatched</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No emergency requests found</div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            {request.emergencyType === "accident" && (
                              <div className="bg-red-100 p-2 rounded-full">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              </div>
                            )}
                            {request.emergencyType === "medical" && (
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Ambulance className="h-5 w-5 text-blue-600" />
                              </div>
                            )}
                            {request.emergencyType === "fire" && (
                              <div className="bg-orange-100 p-2 rounded-full">
                                <AlertCircle className="h-5 w-5 text-orange-600" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{request.id}</h4>
                                {getStatusBadge(request.status)}
                              </div>
                              <p className="text-sm text-gray-600">{request.description}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {request.name}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTime(request.createdAt)}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {request.location.lat.toFixed(4)}, {request.location.lng.toFixed(4)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 self-end md:self-center">
                            {request.status === "pending" && <Button size="sm">Dispatch</Button>}
                            {request.status === "dispatched" && (
                              <Button size="sm" variant="outline">
                                Track
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              <div className="space-y-4">
                {requests
                  .filter((request) => request.status === "pending")
                  .map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        {/* Same content as above, filtered for pending */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-red-100 p-2 rounded-full">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{request.id}</h4>
                                {getStatusBadge(request.status)}
                              </div>
                              <p className="text-sm text-gray-600">{request.description}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {request.name}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTime(request.createdAt)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 self-end md:self-center">
                            <Button size="sm">Dispatch</Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Similar content for other tabs */}
            <TabsContent value="dispatched">{/* Filtered content for dispatched requests */}</TabsContent>

            <TabsContent value="completed">{/* Filtered content for completed requests */}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
