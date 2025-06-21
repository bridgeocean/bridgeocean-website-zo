"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Ambulance, Clock, Phone, Zap, Users, Navigation, AlertCircle } from "lucide-react"

export default function LiveDemo() {
  const [activeEmergencies, setActiveEmergencies] = useState([])
  const [ambulances, setAmbulances] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setCurrentTime(new Date())

      // Update ambulance positions (simulate movement)
      setAmbulances((prev) =>
        prev.map((ambulance) => ({
          ...ambulance,
          lat: ambulance.lat + (Math.random() - 0.5) * 0.001,
          lng: ambulance.lng + (Math.random() - 0.5) * 0.001,
          lastUpdate: new Date().toISOString(),
        })),
      )
    }, 2000)

    // Initialize demo data
    setActiveEmergencies([
      {
        id: "EM-001",
        type: "accident",
        location: "Lekki Expressway, Lagos",
        lat: 6.4281,
        lng: 3.4219,
        status: "dispatched",
        priority: "high",
        timeRequested: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        estimatedArrival: "4 mins",
        assignedAmbulance: "AMB-001",
      },
      {
        id: "EM-002",
        type: "medical",
        location: "Victoria Island, Lagos",
        lat: 6.4281,
        lng: 3.4219,
        status: "pending",
        priority: "medium",
        timeRequested: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        estimatedArrival: "Calculating...",
        assignedAmbulance: null,
      },
    ])

    setAmbulances([
      {
        id: "AMB-001",
        driver: "John Adebayo",
        lat: 6.425,
        lng: 3.42,
        status: "en-route",
        assignedTo: "EM-001",
        lastUpdate: new Date().toISOString(),
      },
      {
        id: "AMB-002",
        driver: "Sarah Okafor",
        lat: 6.43,
        lng: 3.425,
        status: "available",
        assignedTo: null,
        lastUpdate: new Date().toISOString(),
      },
      {
        id: "AMB-003",
        driver: "Michael Eze",
        lat: 6.42,
        lng: 3.418,
        status: "busy",
        assignedTo: "EM-003",
        lastUpdate: new Date().toISOString(),
      },
    ])

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "dispatched":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "en-route":
        return "bg-green-100 text-green-800 border-green-300"
      case "available":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "busy":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Live Emergency Coordination Demo</h1>
        <p className="text-gray-600">Real-time simulation of Nexus Emergency Logistics platform</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live updates every 2 seconds</span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="emergencies">Active Emergencies</TabsTrigger>
          <TabsTrigger value="ambulances">Ambulance Fleet</TabsTrigger>
          <TabsTrigger value="ai-dispatch">AI Dispatch</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Emergencies</p>
                    <h3 className="text-3xl font-bold text-red-600">{activeEmergencies.length}</h3>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Available Ambulances</p>
                    <h3 className="text-3xl font-bold text-green-600">
                      {ambulances.filter((a) => a.status === "available").length}
                    </h3>
                  </div>
                  <Ambulance className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">En Route</p>
                    <h3 className="text-3xl font-bold text-blue-600">
                      {ambulances.filter((a) => a.status === "en-route").length}
                    </h3>
                  </div>
                  <Navigation className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg Response Time</p>
                    <h3 className="text-3xl font-bold text-purple-600">6.2m</h3>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Simulated Map View */}
          <Card>
            <CardHeader>
              <CardTitle>Real-Time GPS Tracking Map</CardTitle>
              <CardDescription>Live positions of ambulances and emergency locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>

                {/* Simulated map elements */}
                <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Lagos, Nigeria</span>
                  </div>
                </div>

                {/* Emergency markers */}
                {activeEmergencies.map((emergency, index) => (
                  <div
                    key={emergency.id}
                    className="absolute bg-red-600 text-white p-2 rounded-full animate-pulse"
                    style={{
                      top: `${20 + index * 15}%`,
                      left: `${30 + index * 20}%`,
                    }}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </div>
                ))}

                {/* Ambulance markers */}
                {ambulances.map((ambulance, index) => (
                  <div
                    key={ambulance.id}
                    className={`absolute p-2 rounded-full ${
                      ambulance.status === "available"
                        ? "bg-green-600"
                        : ambulance.status === "en-route"
                          ? "bg-blue-600"
                          : "bg-gray-600"
                    } text-white`}
                    style={{
                      top: `${40 + index * 15}%`,
                      left: `${20 + index * 25}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Ambulance className="h-4 w-4" />
                  </div>
                ))}

                <div className="text-center z-10">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Interactive GPS Map</p>
                  <p className="text-sm text-gray-500">Real-time tracking with Google Maps integration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergencies">
          <div className="space-y-4">
            {activeEmergencies.map((emergency) => (
              <Card key={emergency.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-full ${emergency.type === "accident" ? "bg-red-100" : "bg-blue-100"}`}
                      >
                        {emergency.type === "accident" ? (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Phone className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold">{emergency.id}</h3>
                          <Badge variant="outline" className={getStatusColor(emergency.status)}>
                            {emergency.status}
                          </Badge>
                          <span className={`text-sm font-medium ${getPriorityColor(emergency.priority)}`}>
                            {emergency.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{emergency.location}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {Math.floor((Date.now() - new Date(emergency.timeRequested).getTime()) / 60000)} mins ago
                          </div>
                          <div className="flex items-center gap-1">
                            <Navigation className="h-3 w-3" />
                            ETA: {emergency.estimatedArrival}
                          </div>
                          {emergency.assignedAmbulance && (
                            <div className="flex items-center gap-1">
                              <Ambulance className="h-3 w-3" />
                              {emergency.assignedAmbulance}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Track
                      </Button>
                      <Button size="sm">Update</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ambulances">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ambulances.map((ambulance) => (
              <Card key={ambulance.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold">{ambulance.id}</h3>
                    <Badge variant="outline" className={getStatusColor(ambulance.status)}>
                      {ambulance.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{ambulance.driver}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>
                        {ambulance.lat.toFixed(4)}, {ambulance.lng.toFixed(4)}
                      </span>
                    </div>
                    {ambulance.assignedTo && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                        <span>Assigned to {ambulance.assignedTo}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Updated {new Date(ambulance.lastUpdate).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-dispatch">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Intelligent Dispatch Engine
              </CardTitle>
              <CardDescription>
                Real-time decision making based on emergency type, location, and resource availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Current AI Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Emergency Classification Accuracy:</span>
                      <span className="font-medium">97.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Dispatch Time:</span>
                      <span className="font-medium">23 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Route Optimization:</span>
                      <span className="font-medium">Active</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Recent AI Decisions</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">EM-001: Road Accident</p>
                        <p className="text-xs text-gray-600">
                          AI classified as high priority, dispatched AMB-001 (closest available, 2.3km away)
                        </p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">EM-002: Medical Emergency</p>
                        <p className="text-xs text-gray-600">
                          AI analyzing symptoms, calculating optimal response strategy
                        </p>
                        <p className="text-xs text-gray-500">30 seconds ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Predictive Analytics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Peak Emergency Hours</p>
                      <p className="font-medium">6-9 PM (Current: High Risk)</p>
                    </div>
                    <div>
                      <p className="text-gray-600">High Risk Areas</p>
                      <p className="font-medium">Lekki Expressway, Third Mainland</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
