"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import Image from "next/image"
import Link from "next/link"
import {
  Shield, Clock, Navigation,
  Briefcase, Car,
  Phone, ArrowRight, AlertTriangle, LandPlot,
  Server, Network, HeartPulse
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <MainNav />
      <main className="flex-1">

        {/* ── SECTION 1: Hero ── */}
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
                  <p className="max-w-[560px] text-zinc-300 md:text-xl leading-relaxed font-medium">
                    Your organisation is responsible for lives. Nexus gives you the coordination infrastructure to protect them — real-time dispatch, GPS routing, and hospital integration, deployed at the scale you need.
                  </p>
                  <p className="max-w-[560px] text-zinc-500 md:text-base leading-relaxed">
                    Licensed by governments, HMOs, corporations, and enterprises across Nigeria.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/nexus">
                    <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                      Access Nexus Platform <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    onClick={() => window.open("https://wa.me/2349069183165?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20Nexus%20for%20my%20organisation", "_blank")}>
                    Talk to us on WhatsApp
                  </Button>
                </div>
              </div>

              {/* Dispatcher photo */}
              <div className="relative flex items-center justify-center h-72 lg:h-[420px] rounded-2xl overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('/images/dispatcher.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 rounded-full px-3 py-1.5 backdrop-blur-sm border border-green-800/40">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse inline-block" />
                  <span className="text-xs text-green-400 font-medium">Nexus · Live in Nigeria</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Impact Stats Bar ── */}
        <section className="w-full py-8 bg-red-600 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { number: "15", label: "deaths every minute globally — 10 caused by poor coordination" },
                { number: "227M+", label: "people in Nigeria Nexus aims to protect" },
                { number: "45%", label: "of Nigerians use private cars during emergencies — no dispatch, no coordination" },
                { number: "< 60 min", label: "golden hour for trauma survival — response time is everything" },
              ].map(({ number, label }) => (
                <div key={label} className="space-y-1">
                  <p className="text-3xl font-bold">{number}</p>
                  <p className="text-red-100 text-sm leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 2: Who We Serve ── */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-zinc-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
              <Badge variant="outline" className="border-red-500 text-red-500">Who We Serve</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Built for Every Institution That Protects Lives
              </h2>
              <p className="max-w-[640px] text-zinc-400 md:text-lg">
                Nexus is licensed by organisations that carry legal and moral responsibility for the people in their care — across sectors, not just healthcare.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">

              {/* B2G */}
              <div className="relative border border-blue-800/40 bg-zinc-900 rounded-2xl p-8 space-y-5">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-600 text-white text-xs">B2G</Badge>
                </div>
                <div className="h-12 w-12 bg-blue-950/60 border border-blue-800/40 rounded-xl flex items-center justify-center">
                  <LandPlot className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Government & Agencies</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Run your state or federal emergency operations on Nexus. One platform connecting ambulances, hospitals, and first responders — citywide or nationwide.
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "City-wide emergency operations dashboard",
                    "Live coordination with LASEMA, NEMA & state hospitals",
                    "SaaS licensing — deploy Nexus on your network",
                    "Public infrastructure contracts at scale",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="https://app.bridgeocean.xyz">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Discuss Government Licensing <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {/* HMOs */}
              <div className="relative border border-violet-800/40 bg-zinc-900 rounded-2xl p-8 space-y-5">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-violet-600 text-white text-xs">HMO</Badge>
                </div>
                <div className="h-12 w-12 bg-violet-950/60 border border-violet-800/40 rounded-xl flex items-center justify-center">
                  <HeartPulse className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">HMOs & Health Insurers</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Bundle emergency coordination into your health plan as a premium benefit. When your members need help, they get a coordinated response — not a busy tone.
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Emergency coordination as a plan premium feature",
                    "Reduce claims from delayed or failed emergency response",
                    "National and state health insurance integration",
                    "Branded emergency channel for your members",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="https://app.bridgeocean.xyz">
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                    Explore HMO Partnership <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {/* B2B */}
              <div className="relative border border-amber-800/40 bg-zinc-900 rounded-2xl p-8 space-y-5">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-amber-600 text-white text-xs">B2B</Badge>
                </div>
                <div className="h-12 w-12 bg-amber-950/60 border border-amber-800/40 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Corporations & Enterprises</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Your duty of care doesn&apos;t end when staff leave the office. Nexus extends real emergency coverage to every person, site, and vehicle in your operation.
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Emergency dispatch for staff across every site",
                    "Panic button hardware for vehicles and campus zones",
                    "Real-time incident dashboard for your safety team",
                    "Corporate charter fleet with active Nexus protection",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="https://app.bridgeocean.xyz">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Get a Corporate Proposal <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION 3: What Nexus Powers ── */}
        <section className="w-full py-16 md:py-24 bg-black">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
              <Badge variant="outline" className="border-red-500 text-red-500">Nexus in Action</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Nexus Powers</h2>
              <p className="max-w-[600px] text-zinc-400 md:text-lg">
                Two live products built on Nexus — proving the platform works at real scale across Nigeria.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">

              {/* NaijaRescue */}
              <Card className="relative overflow-hidden bg-zinc-950 border-zinc-800">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-2 overflow-hidden bg-black">
                    <Image src="/naijarescue-logo.png" alt="NaijaRescue" width={40} height={40} className="object-contain" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl text-white">NaijaRescue</CardTitle>
                    <span className="flex items-center gap-1 bg-green-950/40 border border-green-800/40 rounded-full px-2 py-0.5 text-xs text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                      Live
                    </span>
                  </div>
                  <CardDescription className="text-zinc-400">
                    Public emergency response powered by Nexus. Any Nigerian taps once — a coordinated response is dispatched. No login, no delay, GPS-accurate.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5 text-sm text-zinc-400">
                    <div className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" /><span>One-tap SOS for any Nigerian</span></div>
                    <div className="flex items-center gap-2"><Navigation className="h-3.5 w-3.5 text-red-500 flex-shrink-0" /><span>GPS-accurate live dispatch</span></div>
                    <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-red-500 flex-shrink-0" /><span>Zero login · zero barrier</span></div>
                  </div>
                  <Link href="/nexus/naijarescue">
                    <Button variant="outline" className="w-full bg-transparent border-red-600/50 text-red-400 hover:bg-red-950/30 hover:border-red-500">
                      Access NaijaRescue <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Charter */}
              <Card className="relative overflow-hidden bg-zinc-950 border-zinc-800">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 bg-emerald-950/50 border border-emerald-600/30 rounded-lg flex items-center justify-center mb-2">
                    <Car className="h-5 w-5 text-emerald-500" />
                  </div>
                  <CardTitle className="text-xl text-white mb-1">Charter Services</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Corporate vehicle hire with Nexus built in. Every car carries an active panic button wired directly into emergency dispatch — safety infrastructure on every journey.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5 text-sm text-zinc-400">
                    <div className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /><span>Nexus panic button on every vehicle</span></div>
                    <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /><span>24/7 corporate availability</span></div>
                    <div className="flex items-center gap-2"><Briefcase className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /><span>Corporate retainer packages</span></div>
                  </div>
                  <Link href="/charter">
                    <Button variant="outline" className="w-full bg-transparent border-emerald-600/50 text-emerald-400 hover:bg-emerald-950/30 hover:border-emerald-500">
                      View Fleet & Pricing <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: How Nexus Works ── */}
        <section className="w-full py-16 md:py-24 bg-zinc-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
              <Badge variant="outline" className="border-zinc-600 text-zinc-400">How It Works</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">From Emergency to Response — in Real Time</h2>
              <p className="max-w-[580px] text-zinc-400 md:text-lg">
                Nexus does in seconds what manual coordination cannot do at all.
              </p>
            </div>
            <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Emergency Reported",
                  body: "A panic button, SOS call, or operator alert reaches Nexus instantly — GPS location captured, incident classified.",
                  color: "text-red-400",
                  border: "border-red-900/40",
                },
                {
                  step: "02",
                  title: "Responder Dispatched",
                  body: "Nexus AI identifies the nearest qualified responder and routes them in real time — no phone calls, no delays, no guesswork.",
                  color: "text-amber-400",
                  border: "border-amber-900/40",
                },
                {
                  step: "03",
                  title: "Hospital Pre-Alerted",
                  body: "The receiving hospital is notified before arrival — bed prepared, team ready. The golden hour is protected.",
                  color: "text-green-400",
                  border: "border-green-900/40",
                },
              ].map(({ step, title, body, color, border }) => (
                <div key={step} className={`border ${border} bg-zinc-900 rounded-2xl p-8 space-y-4`}>
                  <p className={`text-4xl font-black ${color}`}>{step}</p>
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link href="/nexus">
                <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                  See the Full Nexus Platform <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: Enterprise CTA ── */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="outline" className="border-red-500 text-red-500">Ready to Deploy</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Your organisation protects lives.<br />Give it the infrastructure to do it.
              </h2>
              <p className="max-w-[600px] text-zinc-400 md:text-xl">
                Nexus is deployed for governments, HMOs, corporate campuses, gated estates, hospitals, and schools. If you carry responsibility for people, we have a pathway for you.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row flex-wrap justify-center pt-2">
                <Link href="/nexus">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                    Access Nexus Platform <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-900"
                  onClick={() => window.open("https://wa.me/2349069183165?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20Nexus%20for%20my%20organisation", "_blank")}>
                  WhatsApp Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0 bg-zinc-950 text-zinc-400 border-zinc-800">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Bridgeocean" width={200} height={136} className="h-8 w-auto" />
            <p className="text-sm">© 2026 Bridgeocean Limited. All rights reserved.</p>
          </div>
          <div className="flex gap-4 text-sm flex-wrap justify-center">
            <a href="https://www.facebook.com/profile.php?id=61557691785062" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
            <a href="https://www.instagram.com/bridgeoceanlimited/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="mailto:bridgeocean@bridgeocean.xyz" className="hover:text-white transition-colors">bridgeocean@bridgeocean.xyz</a>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="https://app.bridgeocean.xyz" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
