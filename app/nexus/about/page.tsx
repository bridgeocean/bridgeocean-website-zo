import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ambulance, Globe, Users, Clock } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About Nexus Emergency Logistics</h1>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg">
            To establish a reliable digital platform for emergency healthcare logistics in Nigeria, building a
            foundational 'central nervous system' for coordinating critical response and resource deployment across
            Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>The Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>In Nigeria, medical emergencies become tragedies because of:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Difficulty for patients to quickly identify appropriate nearby facilities.</li>
                <li>Uncoordinated and slow ambulance dispatch with inefficient navigation.</li>
                <li>Fragmentation between patient, transport, and hospital costing vital time and lives.</li>
              </ul>
              <p className="font-medium text-red-600">
                The chances of survival for a trauma patient are significantly higher if they receive definitive care
                within the first hour after injury.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Nexus Emergency Logistics - A Coordinated Emergency Response Platform</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium mb-1">Speed</h3>
                  <p className="text-sm text-gray-600">Rapid response to emergencies</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium mb-1">Reliability</h3>
                  <p className="text-sm text-gray-600">Consistent service delivery</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium mb-1">Coordination</h3>
                  <p className="text-sm text-gray-600">Seamless integration of services</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium mb-1">Technology</h3>
                  <p className="text-sm text-gray-600">Satellite-GPS powered routing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-medium mb-2">Request</h3>
              <p className="text-sm text-gray-600">Patient or bystander requests emergency assistance</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-amber-100 p-3 rounded-full mb-4">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-medium mb-2">Verify</h3>
              <p className="text-sm text-gray-600">System verifies the emergency and location</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Ambulance className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Dispatch</h3>
              <p className="text-sm text-gray-600">Nearest available ambulance is dispatched</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-2">Route & Notify</h3>
              <p className="text-sm text-gray-600">Optimal routing and real-time notifications</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Technology & Satellite Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Satellite-Powered Routing Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Using GPS technology to provide accurate location data and optimal routing for emergency vehicles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Intelligent Dispatch Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  AI-powered system that determines the most appropriate response based on emergency type and available
                  resources.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Partner Integration Gateway</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Seamless integration with ambulance services, hospitals, and other emergency response partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dr. Seun Omolade</CardTitle>
                <CardDescription>Founder</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  <li>Nigerian with over a decade international experience</li>
                  <li>Ph.D in Molecular Biology (Germany)</li>
                  <li>Over 10 years experience in Healthcare</li>
                  <li>5+ years business experience in Nigeria</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ms. Yetunde Fatolu</CardTitle>
                <CardDescription>Management (Operations and Finance)</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  <li>B.Sc. Account and Finance (Nigeria)</li>
                  <li>Vast business experience in Nigeria</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
