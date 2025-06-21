"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, MapPin, Phone, Zap } from "lucide-react"
import { createEmergencyRequest } from "@/lib/actions"

export default function RequestEmergency() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState({ lat: null, lng: null, address: "" })
  const [locating, setLocating] = useState(false)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        // Simulate reverse geocoding
        const mockAddress = "Lekki Phase 1, Lagos State, Nigeria"

        setLocation({ lat, lng, address: mockAddress })
        setLocating(false)
        toast({
          title: "Location detected",
          description: `Location: ${mockAddress}`,
        })
      },
      (error) => {
        setLocating(false)
        toast({
          title: "Error",
          description: `Failed to get your location: ${error.message}`,
          variant: "destructive",
        })
      },
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setAiAnalyzing(true)

    const formData = new FormData(event.target)
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      emergencyType: formData.get("emergencyType"),
      description: formData.get("description"),
      location: location,
    }

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setAiAnalyzing(false)

      await createEmergencyRequest(data)
      toast({
        title: "Emergency request submitted",
        description: "AI has analyzed your request. Help is being dispatched.",
      })
      router.push("/request-confirmation")
    } catch (error) {
      setAiAnalyzing(false)
      toast({
        title: "Error",
        description: "Failed to submit emergency request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Request Emergency Help</h1>
          <p className="text-gray-600">
            Our AI system will analyze your request and dispatch the nearest available ambulance
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-red-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Phone className="h-6 w-6" />
              Emergency Request Form
            </CardTitle>
            <CardDescription className="text-white/90">
              Please provide accurate information for fastest response
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+234..." required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyType">Emergency Type *</Label>
                <Select name="emergencyType" required defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accident">Road Traffic Accident</SelectItem>
                    <SelectItem value="medical">Medical Emergency</SelectItem>
                    <SelectItem value="cardiac">Cardiac Emergency</SelectItem>
                    <SelectItem value="respiratory">Breathing Difficulty</SelectItem>
                    <SelectItem value="trauma">Trauma/Injury</SelectItem>
                    <SelectItem value="fire">Fire Emergency</SelectItem>
                    <SelectItem value="other">Other Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Brief Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please describe the emergency situation, number of people involved, and any immediate dangers"
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <Label>Your Location *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetLocation}
                    className="flex-1"
                    disabled={locating}
                  >
                    {locating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Detecting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Detect My Location
                      </>
                    )}
                  </Button>
                </div>
                {location.address && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Location Detected</p>
                        <p className="text-sm text-green-700">{location.address}</p>
                        <p className="text-xs text-green-600">
                          Coordinates: {location.lat?.toFixed(6)}, {location.lng?.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {aiAnalyzing && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
                    <div>
                      <p className="font-medium text-blue-800">AI Analysis in Progress</p>
                      <p className="text-sm text-blue-700">
                        Analyzing emergency type, location, and dispatching optimal response...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                disabled={loading || !location.lat}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {aiAnalyzing ? "AI Analyzing Emergency..." : "Submitting Request..."}
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-5 w-5" />
                    Request Emergency Help
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Emergency Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">While You Wait</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Stay calm and keep your phone nearby</li>
              <li>• If safe to do so, provide first aid to the injured</li>
              <li>• Do not move seriously injured persons unless in immediate danger</li>
              <li>• Keep the emergency area clear for ambulance access</li>
              <li>• You will receive SMS updates with ambulance location and ETA</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
