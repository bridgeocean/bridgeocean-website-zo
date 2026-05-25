"use client"

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Car, Users, Shield, Clock, MapPin, AlertTriangle, ArrowRight, Phone } from "lucide-react"

const vehicles = [
  {
    name: "GMC Terrain",
    year: "2011",
    category: "Compact SUV",
    passengers: 5,
    color: "Black",
    fuel: "Petrol",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Fully insured"],
  },
  {
    name: "Honda Cross Tour",
    year: "2013",
    category: "Crossover",
    passengers: 5,
    color: "Grey",
    fuel: "Petrol",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Fully insured"],
  },
  {
    name: "Toyota Prado",
    year: "2023",
    category: "Premium SUV",
    passengers: 7,
    color: "Black",
    fuel: "Petrol",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Luxury interior"],
  },
  {
    name: "Lexus GX 460",
    year: "2024",
    category: "Luxury SUV",
    passengers: 7,
    color: "Black",
    fuel: "Petrol",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Premium luxury"],
  },
  {
    name: "Chevrolet Suburban",
    year: "2024",
    category: "Full-Size SUV",
    passengers: 8,
    color: "Black",
    fuel: "Petrol",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Maximum capacity"],
  },
  {
    name: "Mercedes-Benz GLC",
    year: "2023",
    category: "Luxury SUV",
    passengers: 7,
    color: "Black",
    fuel: "Petrol",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Executive class"],
  },
]

export default function CharterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">

        {/* Hero */}
        <section className="w-full py-16 md:py-24 bg-black text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="max-w-2xl space-y-5">
              <Badge variant="outline" className="border-red-500 text-red-400">Nexus-Protected Fleet</Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-white">
                Premium Charter Services
              </h1>
              <p className="text-zinc-400 md:text-lg leading-relaxed">
                Every vehicle in our fleet is equipped with a Nexus emergency panic button — providing real-time emergency dispatch, GPS tracking, and 24/7 protection for every journey.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/charter/book">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 gap-2">
                    <Car className="h-4 w-4" /> Book a Charter
                  </Button>
                </Link>
                <Button size="lg" variant="outline"
                  className="border-zinc-700 text-white hover:bg-zinc-900 hover:text-white bg-transparent gap-2"
                  onClick={() => window.open("https://app.bridgeocean.xyz/corporate-app", "_blank")}>
                  View Fleet App <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Nexus protection callout */}
        <section className="w-full py-6 bg-red-600 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                <p className="font-medium">Every charter vehicle has an active Nexus panic button — instant emergency dispatch at the press of a button.</p>
              </div>
              <Link href="/nexus">
                <Button size="sm" variant="outline" className="border-white text-white hover:bg-red-700 bg-transparent whitespace-nowrap">
                  About Nexus
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="w-full py-10 border-b">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: Shield, label: "Fully Insured", sub: "All vehicles & passengers" },
                { icon: AlertTriangle, label: "Panic Button", sub: "Nexus emergency link" },
                { icon: MapPin, label: "GPS Tracked", sub: "Real-time on every ride" },
                { icon: Clock, label: "24/7 Available", sub: "Lagos & beyond" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 bg-red-100 dark:bg-red-950 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fleet Grid */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-3 mb-12">
              <Badge variant="outline" className="border-red-500 text-red-500">Our Fleet</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nexus-Enabled Vehicles</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg">
                Premium SUVs and crossovers — every vehicle GPS-tracked, fully insured, and protected by Nexus emergency technology
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {vehicles.map((v) => (
                <Card key={`${v.name}-${v.year}`} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Vehicle visual placeholder with color + name */}
                  <div className="h-44 bg-zinc-900 flex flex-col items-center justify-center relative">
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-600 text-white text-xs">NEXUS</Badge>
                    </div>
                    <Car className="h-16 w-16 text-zinc-600" />
                    <p className="text-zinc-500 text-xs mt-2">{v.color}</p>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{v.name}</h3>
                        <p className="text-muted-foreground text-sm">{v.year}</p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{v.category}</Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {v.passengers} seats</span>
                      <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5" /> {v.fuel}</span>
                    </div>
                    <ul className="space-y-1">
                      {v.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/charter/book">
                      <Button className="w-full bg-red-600 hover:bg-red-700 mt-2" size="sm">
                        Book This Vehicle
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Button variant="outline" size="lg"
                onClick={() => window.open("https://wa.me/2349135630154", "_blank")}>
                View Full Fleet on WhatsApp
              </Button>
            </div>
          </div>
        </section>

        {/* Book / Contact */}
        <section className="w-full py-16 md:py-24 bg-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Book?</h2>
              <p className="text-muted-foreground md:text-lg">
                Get in touch to reserve a vehicle or register your car to join our Nexus-protected fleet.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row justify-center">
                <Link href="/charter/book">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                    Book a Charter
                  </Button>
                </Link>
                <Link href="/charter/partner">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Register Your Vehicle
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                24/7 Hotline: <a href="tel:+2349069183165" className="font-medium hover:underline">+234 906 918 3165</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0 bg-zinc-950 text-zinc-400">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
          <p className="text-sm">© 2025 Bridgeocean Limited. All rights reserved.</p>
          <div className="flex gap-4 text-sm flex-wrap justify-center">
            <a href="mailto:bridgeocean@bridgeocean.xyz" className="hover:text-white transition-colors">bridgeocean@bridgeocean.xyz</a>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
