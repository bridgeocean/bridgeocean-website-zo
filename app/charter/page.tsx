"use client"

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Users, Shield, Clock, CheckCircle2, Phone, Mail, AlertTriangle, Star } from "lucide-react"

const vehicles = [
  {
    name: "GMC Terrain",
    year: "2011",
    category: "Compact SUV",
    passengers: 5,
    color: "Black",
    fuel: "Petrol",
    image: "https://app.bridgeocean.xyz/vehicles/gmc-terrain-2011.png",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Fully insured"],
  },
  {
    name: "Honda Cross Tour",
    year: "2013",
    category: "Crossover",
    passengers: 5,
    color: "Grey",
    fuel: "Petrol",
    image: "https://app.bridgeocean.xyz/vehicles/honda-crosstour-2013.jpeg",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Fully insured"],
  },
  {
    name: "Toyota Prado",
    year: "2023",
    category: "Premium SUV",
    passengers: 7,
    color: "Black",
    fuel: "Petrol",
    image: "https://app.bridgeocean.xyz/vehicles/toyota-prado-2023.jpeg",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Luxury interior"],
  },
  {
    name: "Lexus GX 460",
    year: "2024",
    category: "Luxury SUV",
    passengers: 7,
    color: "Black",
    fuel: "Petrol",
    image: "https://app.bridgeocean.xyz/vehicles/lexus-gx460-2024.jpeg",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Premium luxury"],
  },
  {
    name: "Chevrolet Suburban",
    year: "2024",
    category: "Full-Size SUV",
    passengers: 8,
    color: "Black",
    fuel: "Petrol",
    image: "https://app.bridgeocean.xyz/vehicles/chevrolet-suburban-2024.jpeg",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Maximum capacity"],
  },
  {
    name: "Mercedes-Benz GLC",
    year: "2023",
    category: "Luxury SUV",
    passengers: 7,
    color: "Black",
    fuel: "Petrol",
    image: "https://app.bridgeocean.xyz/vehicles/mercedes-glc-2023.jpeg",
    features: ["Nexus panic button", "GPS tracked", "Professional driver", "Executive class"],
  },
]

const trustItems = [
  { icon: Shield, title: "Nexus Panic Button", body: "Every vehicle has a hardware emergency button wired directly into the Nexus dispatch network." },
  { icon: Clock, title: "24 / 7 Availability", body: "Round-the-clock charter with professional drivers — airport runs, corporate events, personal hires." },
  { icon: Star, title: "Vetted Drivers", body: "All drivers are background-checked, trained, and familiar with Lagos routes and emergency protocols." },
  { icon: AlertTriangle, title: "Emergency Ready", body: "If something happens on the road, Nexus dispatches ambulance and alerts the nearest hospital automatically." },
]

export default function CharterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <MainNav />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative w-full py-16 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff000010_1px,transparent_1px),linear-gradient(to_bottom,#ff000010_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black to-black" />
          <div className="container relative px-4 md:px-6">
            <div className="max-w-3xl space-y-6">
              <Badge className="bg-red-600/20 border-red-600/40 text-red-400">Nexus-Protected Fleet</Badge>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl xl:text-7xl leading-none">
                Charter That
                <span className="text-red-500"> Protects You</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                Every Bridgeocean charter vehicle is equipped with a Nexus panic button — wired directly to emergency
                dispatch. One press and help is on the way. Premium transport with life-safety built in.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="https://wa.me/2349135630154?text=Hi%2C%20I%27d%20like%20to%20book%20a%20charter%20vehicle" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 gap-2">
                    <Phone className="h-4 w-4" /> Book via WhatsApp
                  </Button>
                </a>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                    Request a Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust bar ── */}
        <section className="w-full py-12 bg-zinc-950 border-y border-white/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trustItems.map((t) => (
                <div key={t.title} className="flex items-start gap-3">
                  <t.icon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white text-sm">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fleet Grid ── */}
        <section className="w-full py-16 md:py-24 bg-black">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-3 mb-12">
              <Badge className="bg-white/5 border-white/20 text-gray-300">Our Fleet</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nexus-Enabled Vehicles</h2>
              <p className="max-w-[600px] text-gray-400 md:text-lg">
                Premium SUVs and crossovers — GPS-tracked, fully insured, and every one protected by Nexus emergency technology
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {vehicles.map((v) => (
                <Card key={`${v.name}-${v.year}`} className="overflow-hidden bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors">
                  {/* Vehicle image */}
                  <div className="relative h-48 w-full bg-zinc-800">
                    <Image
                      src={v.image}
                      alt={`${v.color} ${v.name} ${v.year}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {/* NEXUS badge overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/80 border border-red-600/60 rounded-full px-2 py-1">
                      <Image src="/nexus-logo.svg" alt="Nexus" width={14} height={14} />
                      <span className="text-red-400 text-xs font-bold tracking-wider">NEXUS</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-zinc-900/90 border-zinc-600 text-zinc-300 text-xs">{v.category}</Badge>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-white leading-tight">{v.name}</h3>
                        <p className="text-zinc-500 text-sm">{v.year} · {v.color}</p>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-400 text-sm">
                        <Users className="h-3.5 w-3.5" />
                        <span>{v.passengers}</span>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {v.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`https://wa.me/2349135630154?text=Hi%2C%20I%27d%20like%20to%20book%20the%20${encodeURIComponent(v.name + " " + v.year)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-1 gap-2">
                        <Phone className="h-3.5 w-3.5" /> Book This Vehicle
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Book CTA ── */}
        <section className="w-full py-16 bg-zinc-950 border-t border-white/5">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to Book?</h2>
              <p className="text-gray-400 md:text-lg">
                Contact us via WhatsApp or email and our team will confirm your vehicle, driver, and schedule.
                All vehicles available for airport transfers, corporate events, and personal hire.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a href="https://wa.me/2349135630154?text=Hi%2C%20I%27d%20like%20to%20book%20a%20charter%20vehicle" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full sm:w-auto">
                    <Phone className="h-4 w-4" /> WhatsApp +234 913 563 0154
                  </Button>
                </a>
                <a href="https://wa.me/2349069183165?text=Hi%2C%20I%27d%20like%20to%20book%20a%20charter%20vehicle" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full sm:w-auto">
                    <Phone className="h-4 w-4" /> WhatsApp +234 906 918 3165
                  </Button>
                </a>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 gap-2 w-full sm:w-auto">
                    <Mail className="h-4 w-4" /> Send an Email
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Bridgeocean" width={200} height={136} className="h-8 w-auto" />
            <span className="text-sm text-gray-400">© 2026 Bridgeocean Limited. All rights reserved.</span>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            <span>bridgeocean@bridgeocean.xyz</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
