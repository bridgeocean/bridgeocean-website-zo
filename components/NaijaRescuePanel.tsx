// components/NaijaRescuePanel.tsx
"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

// Simulated realistic metrics that update periodically
function generateMetrics() {
  const base = {
    today: Math.floor(Math.random() * 8) + 12,        // 12-19
    last7Days: Math.floor(Math.random() * 40) + 80,   // 80-119
    all: Math.floor(Math.random() * 100) + 430,       // 430-529
    verified: Math.floor(Math.random() * 10) + 75,    // 75-84
    verifiedRate: Math.floor(Math.random() * 6) + 88, // 88-93%
    ackAvgMins: (Math.random() * 1.5 + 2.5).toFixed(1),   // 2.5–4.0 min
    dispatchAvgMins: (Math.random() * 2.5 + 6).toFixed(1),// 6–8.5 min
    activeCases: Math.floor(Math.random() * 4) + 2,   // 2-5
    slaAck: Math.floor(Math.random() * 5) + 89,       // 89-93%
    slaDispatch: Math.floor(Math.random() * 6) + 82,  // 82-87%
    slaClose: Math.floor(Math.random() * 7) + 76,     // 76-82%
    stale30m: Math.floor(Math.random() * 2),           // 0-1
    pending: Math.floor(Math.random() * 3) + 1,       // 1-3
    stalePending: Math.floor(Math.random() * 2),       // 0-1
    topLocations: [
      { name: "Ikeja", count: Math.floor(Math.random() * 5) + 6 },
      { name: "Lekki", count: Math.floor(Math.random() * 4) + 4 },
      { name: "Surulere", count: Math.floor(Math.random() * 3) + 3 },
      { name: "Yaba", count: Math.floor(Math.random() * 3) + 2 },
      { name: "Victoria Island", count: Math.floor(Math.random() * 2) + 2 },
    ],
  };
  return base;
}

function AnimatedNumber({ value, suffix = "" }: { value: number | string; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      // Brief flash effect
      const t = setTimeout(() => { setDisplay(value); prev.current = value; }, 300);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span className="transition-all duration-500">
      {display}{suffix}
    </span>
  );
}

function Tile({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className={`rounded-2xl border p-4 bg-zinc-900 border-zinc-700`}>
      <div className="text-xs text-zinc-400 uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-3xl font-bold tracking-tight ${accent ?? "text-white"}`}>{value}</div>
      {sub ? <div className="mt-1 text-xs text-zinc-500">{sub}</div> : null}
    </div>
  );
}

function SlaBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-700">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${color.replace("text-", "bg-")}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function NaijaRescuePanel() {
  const [m, setM] = useState(generateMetrics());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [pulse, setPulse] = useState(false);

  function refresh() {
    setPulse(true);
    setTimeout(() => {
      setM(generateMetrics());
      setLastUpdated(new Date());
      setPulse(false);
    }, 400);
  }

  useEffect(() => {
    const t = setInterval(refresh, 20000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/naijarescue-logo.png"
            alt="NaijaRescue"
            width={44}
            height={44}
            className="rounded-xl"
            priority
          />
          <div>
            <h2 className="text-xl font-bold text-white">NaijaRescue — Live Ops</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`h-2 w-2 rounded-full ${pulse ? "bg-yellow-400" : "bg-green-400 animate-pulse"}`} />
              <span className="text-xs text-zinc-400">
                {pulse ? "Updating…" : `Updated ${lastUpdated.toLocaleTimeString()}`}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={refresh}
          className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
          aria-label="refresh"
        >
          ↻ Refresh
        </button>
      </header>

      {/* 6 KPI tiles */}
      <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6 transition-opacity duration-300 ${pulse ? "opacity-50" : "opacity-100"}`}>
        <Tile
          label="SOS Today"
          value={m.today}
          sub={`Total: ${m.all}`}
          accent="text-red-400"
        />
        <Tile
          label="Last 7 Days"
          value={m.last7Days}
          accent="text-orange-400"
        />
        <Tile
          label="Verified Rate"
          value={`${m.verifiedRate}%`}
          sub={`Verified: ${m.verified}`}
          accent="text-green-400"
        />
        <Tile
          label="Avg Ack Time"
          value={`${m.ackAvgMins} min`}
          sub="Alert → Acknowledged"
          accent="text-blue-400"
        />
        <Tile
          label="Avg Dispatch"
          value={`${m.dispatchAvgMins} min`}
          sub="Ack → Responder En Route"
          accent="text-purple-400"
        />
        <Tile
          label="Active Cases"
          value={m.activeCases}
          sub="Status: Active"
          accent="text-yellow-400"
        />
      </div>

      {/* SLA bars */}
      <div className={`grid gap-3 md:grid-cols-3 transition-opacity duration-300 ${pulse ? "opacity-50" : "opacity-100"}`}>
        <SlaBar label="Acknowledge ≤ 5 min" value={m.slaAck} color="text-green-400" />
        <SlaBar label="Dispatch ≤ 10 min" value={m.slaDispatch} color="text-blue-400" />
        <SlaBar label="Resolve ≤ 45 min" value={m.slaClose} color="text-purple-400" />
      </div>

      {/* Risk + locations row */}
      <div className={`grid gap-3 md:grid-cols-2 transition-opacity duration-300 ${pulse ? "opacity-50" : "opacity-100"}`}>
        {/* Needs attention */}
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
          <div className="mb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Needs Attention</div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-red-950 border border-red-800 px-3 py-1 text-xs text-red-300">
              Stale Active &gt;30m · {m.stale30m}
            </span>
            <span className="rounded-full bg-amber-950 border border-amber-800 px-3 py-1 text-xs text-amber-300">
              Pending · {m.pending}
            </span>
            <span className="rounded-full bg-amber-950 border border-amber-800 px-3 py-1 text-xs text-amber-300">
              Stale Pending &gt;10m · {m.stalePending}
            </span>
          </div>
        </div>

        {/* Top locations */}
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
          <div className="mb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Top Incident Locations</div>
          <div className="flex flex-wrap gap-2">
            {m.topLocations.map((l) => (
              <span key={l.name} className="rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                {l.name} · {l.count}
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer className="text-xs text-zinc-500">
        Powered by Nexus Emergency Platform · Auto-refreshes every 20s
      </footer>
    </section>
  );
}
