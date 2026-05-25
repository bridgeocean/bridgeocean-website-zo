"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import Image from "next/image"
import Link from "next/link"
import {
  Satellite, Shield, Clock, Navigation, MapPin,
  Zap, HeartPulse, Briefcase, Car,
  Building2, Users, Phone, ArrowRight, AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">

        {/* Hero */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-black text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_480px] lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="w-fit border-red-500 text-red-400 bg-red-950/30">
                    Emergency Tech · Nigeria & Africa
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Africa&apos;s Emergency<br />Response Infrastructure
                  </h1>
                  <p className="max-w-[580px] text-zinc-400 md:text-lg leading-relaxed">
                    Nexus coordinates ambulances, hospitals, and first responders in real time —
                    powered by AI, satellite-GPS, and intelligent routing so the first hour after
                    injury doesn&apos;t become the last.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => window.open("https://nexus.anytaskchill.com", "_blank")}
                  >
                    <Satellite className="h-4 w-4" />
                    Access Nexus Platform
                  </Button>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-900 hover:text-white w-full sm:w-auto bg-transparent">
                      Partner With Us
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Nexus live platform card */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                    <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HeartPulse className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Nexus Emergency Platform</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                        <span className="text-xs text-green-400">Live · Active in Nigeria</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "AI Dispatch", icon: Zap, color: "text-red-400", bg: "bg-red-950/40" },
                      { label: "GPS Routing", icon: Navigation, color: "text-blue-400", bg: "bg-blue-950/40" },
                      { label: "Hospital Match", icon: Building2, color: "text-emerald-400", bg: "bg-emerald-950/40" },
                      { label: "24/7 Response", icon: Clock, color: "text-amber-400", bg: "bg-amber-950/40" },
                    ].map(({ label, icon: Icon, color, bg }) => (
                      <div key={label} className={`${bg} rounded-lg p-3 flex items-center gap-2`}>
                        <Icon className={`h-4 w-4 ${color} flex-shrink-0`} />
                        <span className="text-xs text-zinc-300 font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-zinc-800 space-y-2.5">
                    {[
                      { label: "NaijaRescue SOS", status: "Operational" },
                      { label: "Panic Button (Charter)", status: "Active" },
                      { label: "Ambulance Network", status: "Live" },
                    ].map(({ label, status }) => (
                      <div key={label} className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">{label}</span>
                        <span className="text-green-400 font-medium">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats Bar */}
        <section className="w-full py-8 bg-red-600 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { number: "~15", label: "deaths per minute from poor EMS globally" },
                { number: "227M+", label: "people in Nigeria we aim to protect" },
                { number: "45%", label: "use private cars during emergencies" },
                { number: "< 1hr", label: "golden hour for trauma survival" },
              ].map(({ number, label }) => (
                <div key={label} className="space-y-1">
                  <p className="text-3xl font-bold">{number}</p>
                  <p className="text-red-100 text-sm leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
              <Badge variant="outline" className="border-red-500 text-red-500">Our Platforms</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Three Products, One Mission
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Emergency response coordination, public SOS tooling, and protected premium transport — all on one infrastructure
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">

              {/* Nexus — Flagship */}
              <Card className="relative overflow-hidden border-red-500 border-2">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-red-600 text-white text-xs">Flagship</Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 bg-red-100 dark:bg-red-950 rounded-lg flex items-center justify-center mb-2">
                    <HeartPulse className="h-5 w-5 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Nexus Emergency Platform</CardTitle>
                  <CardDescription>
                    AI + satellite-powered emergency coordination. Real-time dispatch, hospital matching, and trauma routing. Our core IP.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-red-500 flex-shrink-0" /><span>AI intelligent dispatch</span></div>
                    <div className="flex items-center gap-2"><Navigation className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" /><span>Satellite-GPS routing engine</span></div>
                    <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /><span>Live hospital network</span></div>
                    <div className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" /><span>Panic button integration</span></div>
                  </div>
                  <div className="pt-2 space-y-2">
                    <Button className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => window.open("https://nexus.anytaskchill.com", "_blank")}>
                      Access Nexus <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Link href="/nexus">
                      <Button variant="outline" className="w-full">Learn More</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* NaijaRescue */}
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-2 overflow-hidden bg-black">
                    <Image src="/naijarescue-logo.png" alt="NaijaRescue" width={40} height={40} className="object-contain" />
                  </div>
                  <CardTitle className="text-xl">NaijaRescue</CardTitle>
                  <CardDescription>
                    Public-facing SOS emergency tool powered by Nexus. Connects Nigerians to real-time emergency dispatch and coordination.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" /><span>One-tap SOS alert system</span></div>
                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-red-500 flex-shrink-0" /><span>Live location dispatch</span></div>
                    <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-red-500 flex-shrink-0" /><span>24/7 emergency coordination</span></div>
                    <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-red-500 flex-shrink-0" /><span>Powered by Nexus platform</span></div>
                  </div>
                  <div className="pt-2 space-y-2">
                    <Link href="/nexus/naijarescue">
                      <Button variant="outline" className="w-full border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                        Open NaijaRescue <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                    <Link href="/nexus">
                      <Button variant="ghost" className="w-full">About the Platform</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Charter */}
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950 rounded-lg flex items-center justify-center mb-2">
                    <Car className="h-5 w-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">Charter Services</CardTitle>
                  <CardDescription>
                    Premium protected vehicle charter. Every car is Nexus-enabled with an active panic button linked to emergency dispatch.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /><span>Nexus panic button on every car</span></div>
                    <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /><span>24/7 availability</span></div>
                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /><span>GPS-tracked premium fleet</span></div>
                    <div className="flex items-center gap-2"><Briefcase className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /><span>Corporate & personal hire</span></div>
                  </div>
                  <div className="pt-2 space-y-2">
                    <Button variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                      onClick={() => window.open("https://app.bridgeocean.xyz/corporate-app", "_blank")}>
                      View Fleet <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Link href="/charter/book">
                      <Button variant="ghost" className="w-full">Book a Charter</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="w-full py-16 md:py-24 bg-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
              <Badge variant="outline" className="border-red-500 text-red-500">Audiences</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Who We Serve</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg">
                Purpose-built solutions for every stakeholder in Nigeria&apos;s emergency response ecosystem
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  icon: Building2,
                  title: "Hospitals & Clinics",
                  iconColor: "text-red-600",
                  iconBg: "bg-red-100 dark:bg-red-950",
                  dotColor: "bg-red-500",
                  items: ["Real-time bed availability updates", "Incoming patient pre-alerts", "Ambulance coordination", "B2B partner dashboard access"],
                },
                {
                  icon: Users,
                  title: "The Public",
                  iconColor: "text-blue-600",
                  iconBg: "bg-blue-100 dark:bg-blue-950",
                  dotColor: "bg-blue-500",
                  items: ["NaijaRescue SOS access", "One-tap emergency dispatch", "Nearest hospital routing", "Real-time responder tracking"],
                },
                {
                  icon: Briefcase,
                  title: "Corporate Clients",
                  iconColor: "text-emerald-600",
                  iconBg: "bg-emerald-100 dark:bg-emerald-950",
                  dotColor: "bg-emerald-500",
                  items: ["Nexus-protected charter fleet", "Panic button on every vehicle", "VIP concierge transport", "24/7 emergency escalation"],
                },
              ].map(({ icon: Icon, title, iconColor, iconBg, dotColor, items }) => (
                <Card key={title} className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <div className={`h-10 w-10 ${iconBg} rounded-lg flex items-center justify-center mb-2`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${dotColor} flex-shrink-0`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link href="/contact">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Partner With Us <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Partner CTA */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="outline" className="border-red-500 text-red-500">Get Involved</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Partner With Bridgeocean</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Whether you&apos;re a hospital, government body, corporate entity, or vehicle owner — there&apos;s a partnership pathway for you
              </p>
              <div className="flex flex-col gap-3 sm:flex-row flex-wrap justify-center">
                <Button size="lg" className="bg-red-600 hover:bg-red-700"
                  onClick={() => window.open("https://app.bridgeocean.xyz", "_blank")}>
                  Emergency Logistics Partnership
                </Button>
                <Link href="/charter/partner">
                  <Button size="lg" variant="outline">Register Your Vehicle</Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="ghost">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0 bg-zinc-950 text-zinc-400">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
          <div className="flex items-center gap-2">
            <Image src="/images/bridgeocean-logo.jpg" alt="Bridgeocean Logo" width={24} height={24} className="h-6 w-auto rounded-full" />
            <p className="text-sm">© 2025 Bridgeocean Limited. All rights reserved.</p>
          </div>
          <div className="flex gap-4 text-sm flex-wrap justify-center">
            <a href="https://www.facebook.com/profile.php?id=61557691785062" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
            <a href="https://www.instagram.com/bridgeoceanlimited/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
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
