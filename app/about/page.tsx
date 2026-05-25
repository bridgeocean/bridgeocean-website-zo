"use client"

import { MainNav } from "@/components/main-nav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import {
  Heart,
  Shield,
  Clock,
  MapPin,
  Satellite,
  Users,
  Zap,
  CheckCircle2,
  Target,
  Globe,
  Activity,
  ArrowRight,
  Mail,
  Phone,
} from "lucide-react"

const timeline = [
  {
    year: "Founded",
    title: "Bridgeocean Limited Established",
    body: "Incorporated in Lagos, Nigeria with a founding mandate: close the gap between people in crisis and the emergency resources that can save them.",
  },
  {
    year: "Early Ops",
    title: "Logistics & Charter Operations",
    body: "Built operational muscle running GPS-tracked charter and logistics services across Lagos — accumulating deep knowledge of Nigerian roads, routes, and response constraints.",
  },
  {
    year: "2023",
    title: "Nexus Platform Development Begins",
    body: "Engineering begins on the Nexus Emergency Platform — AI dispatch engine, satellite-GPS layer, and hospital integration bus — in parallel with continued charter operations.",
  },
  {
    year: "2024",
    title: "NaijaRescue Goes Live",
    body: "NaijaRescue, Bridgeocean's public SOS tool powered by Nexus, is launched — giving ordinary Nigerians a direct line into the emergency dispatch network.",
  },
  {
    year: "2025–26",
    title: "Nexus Platform Live & Scaling",
    body: "Nexus enters active operations. Charter fleet becomes Nexus-enabled with in-vehicle panic buttons. Ambulance coordination and hospital partner integrations go live.",
  },
]

const values = [
  {
    icon: Heart,
    title: "Life First",
    body: "Every product decision, every line of code, every vehicle deployment is measured against one question: does this save time when someone's life is on the line?",
    color: "text-red-400 bg-red-600/10 border-red-600/30",
  },
  {
    icon: Shield,
    title: "Uncompromising Reliability",
    body: "Emergency infrastructure cannot go down. We build redundancy into every layer — satellite fallback, offline mode, multi-channel dispatch — so Nexus works when nothing else does.",
    color: "text-blue-400 bg-blue-600/10 border-blue-600/30",
  },
  {
    icon: Zap,
    title: "Speed as a Moral Obligation",
    body: "The golden hour is real. We treat response time not as a metric but as a moral obligation. Every second of engineering effort is aimed at shrinking it.",
    color: "text-yellow-400 bg-yellow-600/10 border-yellow-600/30",
  },
  {
    icon: Globe,
    title: "Built for Africa",
    body: "We don't import solutions and hope they work here. Nexus is engineered for Nigerian roads, Nigerian infrastructure constraints, and Nigerian population density.",
    color: "text-green-400 bg-green-600/10 border-green-600/30",
  },
  {
    icon: Target,
    title: "Accountability",
    body: "Every incident is tracked. Every SLA is measured. We publish our response metrics because emergency infrastructure should be held to a higher standard — and we hold ourselves to it.",
    color: "text-purple-400 bg-purple-600/10 border-purple-600/30",
  },
  {
    icon: Users,
    title: "Community Ownership",
    body: "NaijaRescue is free, public, and requires no login. The people who need emergency services most should have the fewest barriers to accessing them.",
    color: "text-pink-400 bg-pink-600/10 border-pink-600/30",
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <MainNav />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative w-full py-16 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff000010_1px,transparent_1px),linear-gradient(to_bottom,#ff000010_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black to-black" />

          <div className="container relative px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <Badge className="bg-red-600/20 border-red-600/40 text-red-400">About Bridgeocean</Badge>
                <h1 className="text-4xl font-black tracking-tight sm:text-6xl leading-none">
                  We're Building Africa's
                  <span className="text-red-500"> Emergency Nervous System</span>
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                  Bridgeocean Limited is a Lagos-based emergency response technology company. We operate the Nexus
                  Emergency Platform — AI-driven, satellite-powered infrastructure that connects the public, ambulance
                  networks, and hospitals into a single coordinated response layer.
                </p>
                <p className="text-gray-400 leading-relaxed max-w-xl">
                  Our charter service is the proof of concept: every vehicle in our fleet carries a Nexus panic button,
                  making us the first commercial transport company in Nigeria to operate with fully integrated emergency
                  response capability onboard.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/nexus">
                    <Button className="bg-red-600 hover:bg-red-700 gap-2">
                      <Activity className="h-4 w-4" /> See the Platform
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
                      Partner With Us <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats panel */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">Company at a Glance</p>
                {[
                  { label: "Headquarters", value: "Lagos, Nigeria", icon: MapPin },
                  { label: "Industry", value: "Emergency Response Technology", icon: Shield },
                  { label: "Flagship Platform", value: "Nexus Emergency Platform", icon: Satellite },
                  { label: "Public Product", value: "NaijaRescue SOS Tool", icon: Activity },
                  { label: "Charter Fleet", value: "Nexus-Enabled, Panic Button Equipped", icon: Shield },
                  { label: "Coverage Target", value: "Nigeria → Africa", icon: Globe },
                  { label: "Availability", value: "24 / 7 / 365", icon: Clock },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <row.icon className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-gray-400">{row.label}</span>
                    </div>
                    <span className="text-sm font-medium text-white text-right max-w-[220px]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="w-full py-16 md:py-24 bg-zinc-950">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-white/5 border-white/20 text-gray-300">Our Mission</Badge>
              <h2 className="text-3xl font-bold sm:text-5xl">
                No One Should Die <span className="text-red-500">Waiting for Help</span>
              </h2>
              <p className="text-gray-400 md:text-xl leading-relaxed">
                Nigeria loses tens of thousands of people each year to emergencies that were survivable — cardiac events,
                road accidents, obstetric crises — not because the medicine doesn't exist, but because the coordination
                infrastructure doesn't. There is no central dispatch. No real-time hospital visibility. No way to
                connect the person in crisis with the nearest available help.
              </p>
              <p className="text-gray-300 md:text-lg leading-relaxed">
                Nexus is our answer. A live platform that routes SOS signals, dispatches responders intelligently,
                pre-alerts receiving hospitals, and tracks every incident from alert to resolution. We are building the
                infrastructure that should have existed decades ago.
              </p>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="w-full py-16 md:py-24 bg-black">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-14 space-y-3">
              <Badge className="bg-blue-600/20 border-blue-600/40 text-blue-400">Our Journey</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">How We Got Here</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-0">
              {timeline.map((item, i) => (
                <div key={item.year} className="flex gap-6">
                  {/* Left: year + line */}
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-red-600/20 border border-red-600/50 flex items-center justify-center flex-shrink-0 z-10">
                      <span className="text-red-400 text-xs font-bold">{i + 1}</span>
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-red-600/30 to-transparent mt-1" />
                    )}
                  </div>
                  {/* Right: content */}
                  <div className={`pb-10 ${i === timeline.length - 1 ? "pb-0" : ""}`}>
                    <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">{item.year}</span>
                    <h3 className="font-bold text-white text-lg mt-1 mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="w-full py-16 md:py-24 bg-zinc-950">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-14 space-y-3">
              <Badge className="bg-purple-600/20 border-purple-600/40 text-purple-400">What Drives Us</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">Our Values</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                These aren't poster values. They're engineering constraints — each one shapes what we build and how.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {values.map((v) => (
                <Card key={v.title} className={`border ${v.color} bg-transparent text-white hover:bg-white/3 transition-colors`}>
                  <CardHeader>
                    <v.icon className={`h-8 w-8 ${v.color.split(" ")[0]} mb-2`} />
                    <CardTitle className="text-white">{v.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm leading-relaxed">{v.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── What We Operate ── */}
        <section className="w-full py-16 md:py-24 bg-black">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-14 space-y-3">
              <Badge className="bg-green-600/20 border-green-600/40 text-green-400">Operations</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">What Bridgeocean Operates</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Satellite,
                  title: "Nexus Emergency Platform",
                  badge: "Core IP",
                  badgeClass: "bg-red-600/20 text-red-400 border-red-600/40",
                  body: "AI + satellite-powered emergency coordination infrastructure. Handles SOS intake, triage, dispatch, live tracking, and hospital pre-alerting for Nigeria.",
                  bullets: ["AI dispatch engine", "Satellite-GPS layer", "Hospital integration bus", "Multi-responder coordination"],
                  link: "/nexus",
                  cta: "Explore Nexus",
                  accent: "border-red-800",
                },
                {
                  icon: Activity,
                  title: "NaijaRescue",
                  badge: "Public Product",
                  badgeClass: "bg-orange-600/20 text-orange-400 border-orange-600/40",
                  body: "Free public SOS tool powered by Nexus. One-tap emergency submission with GPS auto-detect — no login, no friction, immediate dispatch.",
                  bullets: ["Zero login required", "GPS auto-detect", "Instant triage", "Live status updates"],
                  link: "/nexus/naijarescue",
                  cta: "View NaijaRescue",
                  accent: "border-orange-800",
                },
                {
                  icon: Shield,
                  title: "Charter Fleet",
                  badge: "Nexus-Enabled",
                  badgeClass: "bg-blue-600/20 text-blue-400 border-blue-600/40",
                  body: "Premium corporate and private charter. Every vehicle carries a Nexus panic button — the first commercial fleet in Nigeria with integrated emergency dispatch.",
                  bullets: ["In-vehicle panic button", "Real-time GPS tracking", "Premium SUVs", "Corporate & private hire"],
                  link: "/charter",
                  cta: "View Fleet",
                  accent: "border-blue-800",
                },
              ].map((op) => (
                <Card key={op.title} className={`border ${op.accent} bg-white/3 text-white`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <op.icon className="h-7 w-7 text-white/70" />
                      <Badge className={`text-xs ${op.badgeClass} border`}>{op.badge}</Badge>
                    </div>
                    <CardTitle className="text-white text-xl">{op.title}</CardTitle>
                    <p className="text-sm text-gray-400 leading-relaxed mt-2">{op.body}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {op.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link href={op.link}>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 mt-2">
                        {op.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="w-full py-16 bg-red-600">
          <div className="container px-4 md:px-6 text-center space-y-5">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Work With Us</h2>
            <p className="text-red-100 max-w-2xl mx-auto md:text-lg">
              We partner with hospitals, government agencies, logistics companies, and investors who believe
              emergency infrastructure is foundational — not optional.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-bold w-full sm:w-auto gap-2">
                  <Mail className="h-4 w-4" /> Get In Touch
                </Button>
              </Link>
              <a href="https://wa.me/2349135630154" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto gap-2">
                  <Phone className="h-4 w-4" /> WhatsApp +234 913 563 0154
                </Button>
              </a>
            </div>
            <p className="text-red-200 text-sm pt-2">bridgeocean@bridgeocean.xyz</p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="Bridgeocean" width={32} height={32} className="rounded-full invert brightness-110" />
              <span className="text-sm text-gray-400">© 2026 Bridgeocean Limited. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link href="/nexus" className="hover:text-white transition-colors">Nexus</Link>
              <Link href="/nexus/naijarescue" className="hover:text-white transition-colors">NaijaRescue</Link>
              <Link href="/charter" className="hover:text-white transition-colors">Charter</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
