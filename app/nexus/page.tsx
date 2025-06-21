import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MapPin, Bell, Phone } from "lucide-react"

export default function NexusHome() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-red-500 to-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Nexus Emergency Logistics</h1>
            <h2 className="text-2xl mb-4">Satellite-Powered Emergency Coordination</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connecting patients with emergency services and hospitals in Nigeria when every second counts.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Link href="/nexus/request-emergency">Request Emergency Help</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-red-700">
                <Link href="/nexus/register">Register as Partner</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-red-100 p-3 rounded-full mb-4">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Request</h3>
                  <p>Submit an emergency request through our app, website, or USSD.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-red-100 p-3 rounded-full mb-4">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Dispatch</h3>
                  <p>Our system locates and dispatches the nearest available ambulance.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-red-100 p-3 rounded-full mb-4">
                    <Bell className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Notify</h3>
                  <p>Receive real-time updates on ambulance location and estimated arrival time.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">The Problem</h2>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  In Nigeria, medical emergencies become tragedies because patients struggle to quickly identify
                  appropriate nearby facilities.
                </li>
                <li>Uncoordinated and slow ambulance dispatch with inefficient navigation.</li>
                <li>Fragmentation between patient, transport, and hospital costing vital time and lives.</li>
              </ul>
              <p className="text-lg font-medium text-red-600">
                The chances of survival for a trauma patient are significantly higher if they receive definitive care
                within the first hour after injury.
              </p>
              <p className="mt-4">
                Approximately 15 people die globally every minute due to lack of effective emergency medical response.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Technology & Satellite Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Satellite-Powered Routing Engine</h3>
                <p>
                  Using GPS technology to provide accurate location data and optimal routing for emergency vehicles.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Intelligent Dispatch Engine</h3>
                <p>
                  AI-powered system that determines the most appropriate response based on emergency type and available
                  resources.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Partner Integration Gateway</h3>
                <p>Seamless integration with ambulance services, hospitals, and other emergency response partners.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-red-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to save lives?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our network of emergency service providers or register as a user today.
            </p>
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Link href="/nexus/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
