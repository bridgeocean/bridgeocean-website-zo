import NaijaRescuePanel from "@/components/NaijaRescuePanel"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { AlertTriangle, Activity, Shield, Phone, CheckCircle2, ArrowLeft } from "lucide-react"

export default function NaijaRescuePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <MainNav />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative w-full py-16 md:py-24 overflow-hidden">
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff000012_1px,transparent_1px),linear-gradient(to_bottom,#ff000012_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black to-black" />

          <div className="container relative px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">

              {/* Back link */}
              <Link href="/nexus" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-2">
                <ArrowLeft className="h-3.5 w-3.5" />
                Nexus Platform
              </Link>

              {/* Logo + name */}
              <div className="flex items-center justify-center gap-4">
                <Image
                  src="/naijarescue-logo.png"
                  alt="NaijaRescue"
                  width={72}
                  height={72}
                  className="rounded-xl shadow-lg shadow-red-900/40"
                  priority
                />
                <div className="text-left">
                  <h1 className="text-4xl sm:text-5xl font-black text-white">NaijaRescue</h1>
                  <p className="text-sm text-gray-400 mt-0.5">An SOS project by <span className="text-red-400 font-semibold">Bridgeocean</span></p>
                </div>
              </div>

              <Badge className="bg-red-600/20 border-red-600/40 text-red-400 text-sm px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse inline-block mr-2" />
                Live Emergency Operations
              </Badge>

              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                NaijaRescue is the public face of the Nexus Emergency Platform. It gives every Nigerian a direct,
                one-tap channel to trigger an emergency response — connecting them instantly to the Nexus AI
                dispatch engine, ambulance network, and nearest partner hospital.
              </p>

              {/* How it works — 3 steps */}
              <div className="grid gap-4 md:grid-cols-3 mt-8 text-left">
                {[
                  { icon: AlertTriangle, step: "1", title: "Tap SOS", body: "Send your GPS location and emergency type directly into the Nexus intake queue.", color: "text-red-400 bg-red-600/10 border-red-600/30" },
                  { icon: Activity, step: "2", title: "Nexus Responds", body: "AI triage classifies your emergency and dispatches the nearest available responder within seconds.", color: "text-blue-400 bg-blue-600/10 border-blue-600/30" },
                  { icon: Shield, step: "3", title: "Help is Coming", body: "You receive live updates as your responder navigates to you. Hospital is pre-alerted.", color: "text-green-400 bg-green-600/10 border-green-600/30" },
                ].map((s) => (
                  <div key={s.step} className={`border ${s.color} rounded-xl p-4 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <s.icon className={`h-5 w-5 ${s.color.split(" ")[0]}`} />
                      <span className="text-xs text-gray-500 font-mono">STEP {s.step}</span>
                    </div>
                    <h3 className="font-bold text-white">{s.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {[
                  "Powered by Nexus AI",
                  "GPS-Accurate Dispatch",
                  "Zero Login Required",
                  "Hospital Pre-Alert Included",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300">
                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Live Ops Dashboard ── */}
        <section className="w-full py-10 bg-zinc-950">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-2xl font-bold text-white">Live Operations Dashboard</h2>
              <p className="text-gray-400 text-sm">Real-time metrics from the Nexus platform — updated every 20 seconds</p>
            </div>
            {/* The existing live component */}
            <NaijaRescuePanel />
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <section className="w-full py-12 bg-black border-t border-white/5">
          <div className="container px-4 md:px-6 text-center space-y-4">
            <p className="text-gray-400 text-sm">
              NaijaRescue is part of the <span className="text-white font-semibold">Nexus Emergency Platform</span> by Bridgeocean Limited.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/nexus">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Learn About Nexus
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                  <Phone className="h-4 w-4" />
                  Emergency: +234 906 918 3165
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
