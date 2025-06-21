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
import { Loader2 } from "lucide-react"
import { createEmergencyRequest } from "@/lib/nexus-actions"

export default function RequestEmergency() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [locating, setLocating] = useState(false)

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
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocating(false)
        toast({
          title: "Location detected",
          description: "Your current location has been detected.",
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

    const formData = new FormData(event.target)
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      emergencyType: formData.get("emergencyType"),
      description: formData.get("description"),
      location: location,
    }

    try {
      await createEmergencyRequest(data)
      toast({
        title: "Emergency request submitted",
        description: "Help is on the way. You will receive updates shortly.",
      })
      router.push("/nexus/request-confirmation")
    } catch (error) {
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
      <Card className="max-w-lg mx-auto">
        <CardHeader className="bg-red-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Request Emergency Help</CardTitle>
          <CardDescription className="text-white/90">
            Please provide the following information to get immediate assistance
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyType">Emergency Type</Label>
              <Select name="emergencyType" required defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Select emergency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accident">Road Accident</SelectItem>
                  <SelectItem value="medical">Medical Emergency</SelectItem>
                  <SelectItem value="fire">Fire Emergency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brief Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please describe the emergency situation"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Your Location</Label>
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
                      Detecting...
                    </>
                  ) : (
                    "Detect My Location"
                  )}
                </Button>
              </div>
              {location.lat && location.lng && <p className="text-sm text-green-600">Location detected successfully</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading || !location.lat}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Request Emergency Help"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
