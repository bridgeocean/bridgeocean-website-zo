import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Ambulance, MapPin, Bell, Phone, Zap, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-red-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Ambulance className="h-6 w-6" />
            <h1 className="text-xl font-bold">Nexus Emergency Logistics</h1>
          </div>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/live-demo" className="hover:underline">
                  Live Demo
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-red-500 to-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Satellite-Powered Emergency Coordination</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connecting patients with emergency services and hospitals in Nigeria when every second counts.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Link href="/request-emergency">Request Emergency Help</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-red-700">
                <Link href="/live-demo">View Live Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Technology Showcase */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Advanced Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI Intelligent Coordination</h3>
                  <p>
                    Smart dispatch system that analyzes emergency type, location, and available resources to make
                    optimal decisions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Satellite-GPS Routing Engine</h3>
                  <p>
                    Real-time GPS tracking with optimized routing for fastest response times and live location updates.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-3 rounded-full mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Partner Integration Gateway</h3>
                  <p>
                    Seamless integration with ambulance services, hospitals, and emergency responders across Nigeria.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-red-100 p-3 rounded-full mb-4">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Request</h3>
                  <p className="text-sm">Emergency request via app, web, or USSD</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-yellow-100 p-3 rounded-full mb-4">
                    <Zap className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Verify</h3>
                  <p className="text-sm">AI validates emergency and location data</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <Ambulance className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Dispatch</h3>
                  <p className="text-sm">Nearest ambulance automatically dispatched</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Route</h3>
                  <p className="text-sm">Optimal GPS routing with real-time traffic</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-3 rounded-full mb-4">
                    <Bell className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Notify</h3>
                  <p className="text-sm">Real-time updates via SMS and app</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Market Opportunity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">11,800+</div>
                <p className="text-lg font-medium">Road traffic accidents in 3 months (2021)</p>
                <p className="text-sm text-gray-600">~10,200 injured & ~1,700 deaths</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">227M</div>
                <p className="text-lg font-medium">Current Nigerian population</p>
                <p className="text-sm text-gray-600">Projected to 359M by 2050</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">7.7M</div>
                <p className="text-lg font-medium">Additional people to be protected</p>
                <p className="text-sm text-gray-600">From health emergencies by 2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">The Critical Problem</h2>
              <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
                <p className="text-lg font-medium text-red-800 text-center mb-4">
                  ~15 people die globally every minute due to lack of effective emergency medical response
                </p>
              </div>
              <ul className="list-disc pl-6 space-y-3 mb-6">
                <li className="text-lg">
                  <strong>Delay in deciding to seek care:</strong> Patients struggle to quickly identify appropriate
                  nearby facilities
                </li>
                <li className="text-lg">
                  <strong>Delay in reaching care:</strong> Uncoordinated and slow ambulance dispatch with inefficient
                  navigation
                </li>
                <li className="text-lg">
                  <strong>Delay in receiving adequate care:</strong> Fragmentation between patient, transport, and
                  hospital
                </li>
              </ul>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-center font-medium">
                  The chances of survival for a trauma patient are significantly higher if they receive definitive care
                  within the first hour after injury - the "Golden Hour"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-red-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience the Future of Emergency Response</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              See our advanced prototype in action with real-time GPS tracking, AI dispatch, and live notifications.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Link href="/live-demo">
                  View Live Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-red-700">
                <Link href="/request-emergency">Request Emergency</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Nexus Emergency Logistics</h3>
              <p>Satellite-Powered Emergency Coordination</p>
              <p className="text-sm text-gray-400 mt-2">Building Africa's emergency response infrastructure</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p>bridgeocean@cyberservices.com</p>
              <p>08135261568</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/live-demo" className="hover:underline">
                    Live Demo
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="hover:underline">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; {new Date().getFullYear()} Nexus Emergency Logistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
