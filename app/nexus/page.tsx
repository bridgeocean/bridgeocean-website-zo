"use client"

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import {
  Satellite,
  MapPin,
  Clock,
  Heart,
  Users,
  Shield,
  Zap,
  Navigation,
  Phone,
  Mail,
  Activity,
  Radio,
  Cpu,
  Network,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Lock,
  Globe,
  Server,
  Layers,
  HeartPulse,
  Briefcase,
  LandPlot,
} from "lucide-react"

export default function NexusPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <MainNav />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative w-full py-16 md:py-28 lg:py-36 overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff000015_1px,transparent_1px),linear-gradient(to_bottom,#ff000015_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />

          <div className="container relative px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Image src="/nexus-logo.svg" alt="Nexus" width={48} height={48} className="h-12 w-12" />
                  <Badge className="bg-red-600/20 text-red-400 border border-red-600/40 text-sm px-3 py-1">
                    LIVE PLATFORM
                  </Badge>
                </div>
                <h1 className="text-4xl font-black tracking-tight sm:text-6xl xl:text-7xl leading-none">
                  <span className="text-white">Nexus</span>
                  <br />
                  <span className="text-red-500">Emergency</span>
                  <br />
                  <span className="text-white">Platform</span>
                </h1>
                <p className="text-lg text-gray-300 max-w-[560px] leading-relaxed">
                  Africa's first AI-driven, satellite-powered emergency coordination infrastructure.
                  Nexus connects the distressed public, ambulance networks, hospitals, and first responders
                  into a single real-time command layer — so no one dies waiting.
                </p>

                {/* Live status indicators */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {[
                    { label: "AI Engine", color: "green" },
                    { label: "Satellite Layer", color: "green" },
                    { label: "Dispatch Network", color: "green" },
                    { label: "NaijaRescue SOS", color: "green" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-gray-300">{s.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row pt-2">
                  <Link href="https://app.bridgeocean.xyz">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2">
                      <Activity className="h-4 w-4" />
                      Access Nexus Platform
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 gap-2"
                    onClick={() => window.open("https://wa.me/2349069183165?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20Nexus%20for%20my%20organisation", "_blank")}>
                    WhatsApp Us
                  </Button>
                </div>
              </div>

              {/* System status panel */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Nexus Command Layer</span>
                  <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle2 className="h-3 w-3" /> All Systems Operational</span>
                </div>
                {[
                  { name: "SOS Intake Engine", val: "Active", sub: "NaijaRescue + Panic Button feeds", icon: AlertTriangle, color: "text-red-400" },
                  { name: "AI Triage & Dispatch", val: "Active", sub: "Route optimisation running", icon: Cpu, color: "text-blue-400" },
                  { name: "Satellite-GPS Layer", val: "Locked", sub: "Real-time vehicle positions", icon: Satellite, color: "text-purple-400" },
                  { name: "Hospital Integration", val: "Active", sub: "Facility capacity sync", icon: Heart, color: "text-pink-400" },
                  { name: "Charter Panic Network", val: "Active", sub: "Fleet Nexus-enabled", icon: Shield, color: "text-green-400" },
                  { name: "Ambulance Coordination", val: "Live", sub: "Multi-unit dispatch stack", icon: Navigation, color: "text-yellow-400" },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <row.icon className={`h-4 w-4 ${row.color}`} />
                      <div>
                        <p className="text-sm font-medium text-white">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.sub}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── The Problem ── */}
        <section className="w-full py-16 md:py-24 bg-zinc-950">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 space-y-3">
              <Badge className="bg-red-600/20 border-red-600/40 text-red-400">Why Nexus Exists</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Emergency Response is Broken in Africa</h2>
              <p className="text-gray-400 max-w-2xl mx-auto md:text-lg">
                Every year, tens of thousands of Nigerians die from emergencies that were survivable — delayed by a broken system.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  title: "No Facility Visibility",
                  body: "Patients in crisis cannot quickly identify which nearby hospital has capacity, the right equipment, or is even open. Minutes lost become lives lost.",
                  color: "border-red-800 bg-red-950/30",
                  iconColor: "text-red-500",
                },
                {
                  icon: Clock,
                  title: "Uncoordinated Dispatch",
                  body: "45% of Nigerians use private vehicles during emergencies because ambulance dispatch is slow, untracked, and uncoordinated. There is no central command layer.",
                  color: "border-orange-800 bg-orange-950/30",
                  iconColor: "text-orange-500",
                },
                {
                  icon: Users,
                  title: "Zero Data Infrastructure",
                  body: "Hospitals, ambulances, and patients operate in silos. No shared real-time data means every emergency starts from scratch — response time averages over 45 minutes.",
                  color: "border-yellow-800 bg-yellow-950/30",
                  iconColor: "text-yellow-500",
                },
              ].map((c) => (
                <Card key={c.title} className={`border ${c.color} bg-transparent text-white`}>
                  <CardHeader>
                    <c.icon className={`h-10 w-10 ${c.iconColor} mb-2`} />
                    <CardTitle className="text-white">{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm leading-relaxed">{c.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 bg-red-950/40 border border-red-800/50 rounded-xl p-6 max-w-4xl mx-auto text-center">
              <p className="text-lg font-semibold text-red-300">
                15 people die globally every minute from preventable emergencies — 10 of those due to poor coordination.
              </p>
              <p className="text-gray-400 mt-2 text-sm">Nigeria accounts for a disproportionate share — 227M+ people, one fragmented system.</p>
            </div>
          </div>
        </section>

        {/* ── How Nexus Works ── */}
        <section className="w-full py-16 md:py-24 bg-black">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-14 space-y-3">
              <Badge className="bg-blue-600/20 border-blue-600/40 text-blue-400">Architecture</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">How Nexus Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto md:text-lg">
                A coordinated response loop — from distress signal to hospital arrival — in under 60 minutes.
              </p>
            </div>

            {/* Flow steps */}
            <div className="relative">
              <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-600/40 to-transparent mx-24" />
              <div className="grid gap-6 md:grid-cols-5">
                {[
                  { step: "01", icon: AlertTriangle, label: "SOS Signal", body: "NaijaRescue app, Charter panic button, or direct call triggers an emergency alert with GPS coordinates.", color: "text-red-500 bg-red-600/10 border-red-600/30" },
                  { step: "02", icon: Cpu, label: "AI Triage", body: "Nexus AI classifies emergency severity, pulls nearby facility inventory, and identifies optimal response units.", color: "text-blue-500 bg-blue-600/10 border-blue-600/30" },
                  { step: "03", icon: Navigation, label: "Dispatch", body: "Nearest available ambulance or Nexus-enabled charter vehicle is dispatched via real-time optimised routing.", color: "text-purple-500 bg-purple-600/10 border-purple-600/30" },
                  { step: "04", icon: Radio, label: "Live Tracking", body: "Patient, responder, and receiving hospital are kept in sync via the Nexus satellite-GPS coordination layer.", color: "text-yellow-500 bg-yellow-600/10 border-yellow-600/30" },
                  { step: "05", icon: Heart, label: "Hospital Ready", body: "Receiving facility is pre-alerted with patient vitals and ETA so the team is ready on arrival — not after.", color: "text-green-500 bg-green-600/10 border-green-600/30" },
                ].map((s, i) => (
                  <div key={s.step} className="relative flex flex-col items-center text-center">
                    <div className={`h-20 w-20 rounded-full border-2 flex items-center justify-center mb-4 ${s.color}`}>
                      <s.icon className={`h-8 w-8 ${s.color.split(" ")[0]}`} />
                    </div>
                    <span className="text-xs text-gray-500 font-mono mb-1">STEP {s.step}</span>
                    <h3 className="font-bold text-white mb-2">{s.label}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.body}</p>
                    {i < 4 && (
                      <ArrowRight className="hidden md:block absolute -right-3 top-9 h-5 w-5 text-red-600/40" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Platform Components ── */}
        <section className="w-full py-16 md:py-24 bg-zinc-950">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-14 space-y-3">
              <Badge className="bg-purple-600/20 border-purple-600/40 text-purple-400">Platform Stack</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Platform Components</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Six tightly integrated layers that together form Africa's emergency response nervous system.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Cpu,
                  title: "AI Coordination Engine",
                  desc: "Machine-learning dispatch core that ranks available responders by proximity, availability, and load — then routes automatically. Learns from every incident.",
                  tags: ["ML Dispatch", "Auto-Routing", "Load Balancing"],
                  color: "border-blue-800",
                  accent: "text-blue-400",
                },
                {
                  icon: Satellite,
                  title: "Satellite-GPS Layer",
                  desc: "Real-time positional data for all tracked units — ambulances, charter vehicles, and on-foot responders. Works in urban corridors and remote areas alike.",
                  tags: ["Real-Time Tracking", "Offline Fallback", "Multi-Unit"],
                  color: "border-purple-800",
                  accent: "text-purple-400",
                },
                {
                  icon: Network,
                  title: "Hospital Integration Bus",
                  desc: "Live capacity sync with partner hospitals. Nexus knows which ER has beds, which has the right surgical team, and routes patients accordingly — before they arrive.",
                  tags: ["Capacity Sync", "Pre-Alerts", "ETA Sharing"],
                  color: "border-pink-800",
                  accent: "text-pink-400",
                },
                {
                  icon: AlertTriangle,
                  title: "NaijaRescue SOS Portal",
                  desc: "Public-facing emergency submission layer. One-tap SOS from the NaijaRescue web app sends location, contact, and incident type directly into the Nexus dispatch queue.",
                  tags: ["Public Access", "GPS Auto-Detect", "Instant Triage"],
                  color: "border-red-800",
                  accent: "text-red-400",
                },
                {
                  icon: Shield,
                  title: "Charter Panic Button Network",
                  desc: "Every Bridgeocean charter vehicle carries a hardware Nexus panic button. One press triggers silent emergency dispatch, live tracking, and hospital pre-alert — for passengers and drivers.",
                  tags: ["In-Vehicle Hardware", "Silent Alert", "Fleet Tracking"],
                  color: "border-green-800",
                  accent: "text-green-400",
                },
                {
                  icon: Server,
                  title: "Operations Command Centre",
                  desc: "Internal dashboard for Nexus operators. Full incident timeline, unit status board, live map, and escalation tools. The backbone of coordinated response.",
                  tags: ["Incident Timeline", "Live Map", "Operator Tools"],
                  color: "border-yellow-800",
                  accent: "text-yellow-400",
                },
              ].map((c) => (
                <Card key={c.title} className={`border ${c.color} bg-white/3 text-white hover:bg-white/5 transition-colors`}>
                  <CardHeader>
                    <c.icon className={`h-8 w-8 ${c.accent} mb-2`} />
                    <CardTitle className="text-white text-lg">{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400 leading-relaxed">{c.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {c.tags.map((t) => (
                        <span key={t} className={`text-xs ${c.accent} bg-white/5 border border-white/10 rounded-full px-2 py-0.5`}>{t}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who Nexus Is For ── */}
        <section className="w-full py-16 md:py-24 bg-black">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-14 space-y-3">
              <Badge className="bg-green-600/20 border-green-600/40 text-green-400">Who It's For</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Nexus Is Built for Institutions That Carry Responsibility</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Whether you run a state government, a health plan, or a corporate campus — Nexus gives you the infrastructure to protect the people in your care.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: LandPlot,
                  badge: "B2G",
                  badgeColor: "bg-blue-600",
                  title: "Government & Agencies",
                  body: "Deploy Nexus as your state or federal emergency operations platform. Coordinate ambulances, hospitals, and first responders on one live dashboard.",
                  bullet: [
                    "City-wide emergency operations dashboard",
                    "Live coordination with LASEMA, NEMA & state hospitals",
                    "SaaS licensing — deploy on your existing network",
                    "Measurable response time improvements from day one",
                  ],
                  cta: "Discuss Government Licensing",
                  href: "https://app.bridgeocean.xyz",
                  accent: "border-blue-600/50 bg-blue-950/20",
                  btnClass: "bg-blue-600 hover:bg-blue-700",
                  dotColor: "bg-blue-400",
                },
                {
                  icon: HeartPulse,
                  badge: "HMO",
                  badgeColor: "bg-violet-600",
                  title: "HMOs & Health Insurers",
                  body: "Bundle real emergency coordination into your health plan. Your members get a coordinated response when they need it most — not a busy tone.",
                  bullet: [
                    "Emergency coordination as a premium health plan benefit",
                    "Reduce claims from delayed emergency response",
                    "National and state health insurance integration pathways",
                    "Branded emergency channel for your members",
                  ],
                  cta: "Explore HMO Partnership",
                  href: "https://app.bridgeocean.xyz",
                  accent: "border-violet-600/50 bg-violet-950/20",
                  btnClass: "bg-violet-600 hover:bg-violet-700",
                  dotColor: "bg-violet-400",
                },
                {
                  icon: Briefcase,
                  badge: "B2B",
                  badgeColor: "bg-amber-600",
                  title: "Corporations & Enterprises",
                  body: "Your duty of care doesn't end when staff leave the office. Nexus extends real emergency coverage to every person, site, and vehicle in your operation.",
                  bullet: [
                    "Emergency dispatch for staff across every site",
                    "Panic button hardware for vehicles and campus zones",
                    "Real-time incident dashboard for your safety team",
                    "Corporate charter fleet with active Nexus protection",
                  ],
                  cta: "Get a Corporate Proposal",
                  href: "https://app.bridgeocean.xyz",
                  accent: "border-amber-600/50 bg-amber-950/20",
                  btnClass: "bg-amber-600 hover:bg-amber-700",
                  dotColor: "bg-amber-400",
                },
              ].map((tier) => (
                <Card key={tier.title} className={`border ${tier.accent} text-white flex flex-col`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <tier.icon className="h-7 w-7 text-white/70" />
                      <span className={`text-xs text-white font-bold px-2 py-0.5 rounded-full ${tier.badgeColor}`}>{tier.badge}</span>
                    </div>
                    <CardTitle className="text-white text-xl">{tier.title}</CardTitle>
                    <p className="text-sm text-gray-400 leading-relaxed pt-1">{tier.body}</p>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <ul className="space-y-2">
                      {tier.bullet.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${tier.dotColor}`} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link href={tier.href} className="block pt-2">
                      <Button className={`w-full ${tier.btnClass} text-white gap-2`}>
                        {tier.cta} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Scale & Impact ── */}
        <section className="w-full py-14 bg-red-600">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-4 text-center text-white">
              {[
                { val: "227M+", label: "People in Nigeria", sub: "Our primary coverage target" },
                { val: "15/min", label: "Global emergency deaths", sub: "That coordinated response prevents" },
                { val: "45%", label: "Use private cars in emergencies", sub: "Due to zero ambulance coordination" },
                { val: "<60 min", label: "Golden Hour target", sub: "Nexus response-to-hospital benchmark" },
              ].map((s) => (
                <div key={s.val} className="space-y-1">
                  <p className="text-4xl font-black">{s.val}</p>
                  <p className="font-semibold text-sm">{s.label}</p>
                  <p className="text-xs text-red-200">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Traction ── */}
        <section className="w-full py-16 md:py-24 bg-zinc-950">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-14 space-y-3">
              <Badge className="bg-yellow-600/20 border-yellow-600/40 text-yellow-400">Proven Foundation</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">What We've Already Built</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Nexus isn't a concept. It's a live, operating platform with real infrastructure underneath it.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  icon: Layers,
                  title: "Live Platform Infrastructure",
                  points: [
                    "Nexus command centre is live and operating",
                    "NaijaRescue SOS intake is active with real incident data",
                    "Charter fleet is Nexus-enabled with panic button hardware",
                    "AI dispatch engine running on live cases",
                  ],
                  color: "text-blue-400",
                },
                {
                  icon: Globe,
                  title: "Operational Track Record",
                  points: [
                    "Years of GPS-tracked logistics operations in Nigeria",
                    "Deep Nigerian market knowledge — routes, facilities, constraints",
                    "AI-driven healthcare platform development experience",
                    "Proven ability to deploy tech at scale in emerging market conditions",
                  ],
                  color: "text-green-400",
                },
              ].map((c) => (
                <Card key={c.title} className="border-white/10 bg-white/3 text-white">
                  <CardHeader>
                    <c.icon className={`h-8 w-8 ${c.color} mb-2`} />
                    <CardTitle className="text-white">{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {c.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-gray-400">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="w-full py-16 md:py-24 bg-black">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                Your organisation protects lives.<br />Give it the platform to do it.
              </h2>
              <p className="text-gray-400 md:text-lg">
                Government, HMO, or enterprise — Nexus has a deployment pathway built for your scale and sector. Talk to us and we will walk you through it.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
                <Link href="https://app.bridgeocean.xyz">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto gap-2">
                    <Activity className="h-4 w-4" />
                    Access Nexus Platform
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 w-full sm:w-auto gap-2"
                  onClick={() => window.open("https://wa.me/2349069183165?text=Hi%2C%20I%27d%20like%20to%20discuss%20Nexus%20for%20my%20organisation", "_blank")}>
                  <Phone className="h-4 w-4" />
                  WhatsApp Us
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>bridgeocean@bridgeocean.xyz</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+234 913 563 0154</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
