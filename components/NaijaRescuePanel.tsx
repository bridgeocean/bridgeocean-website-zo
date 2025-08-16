// components/NaijaRescuePanel.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchMetrics } from "@/lib/nrApi";

// Extend the fetchMetrics type with the new fields returned by the API
type Metrics = Awaited<ReturnType<typeof fetchMetrics>> & {
  sla?: { ack5: number; dispatch10: number; close45: number };
  risk?: { staleActive30m: number; pending: number; stalePending10m: number };
};

function Tile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
      {sub ? <div className="mt-1 text-xs text-gray-400">{sub}</div> : null}
    </div>
  );
}

export default function NaijaRescuePanel() {
  const [m, setM] = useState<Metrics | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const data = await fetchMetrics();
      setM(data);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? "fetch error");
      setM(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 20000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="w-full space-y-6">
      {/* Header with logo */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/naijarescue-logo.png"
            alt="NaijaRescue"
            width={28}
            height={28}
            className="rounded"
            priority
          />
          <h2 className="text-xl font-semibold">NaijaRescue — Live Ops</h2>
        </div>
        <button
          onClick={refresh}
          className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
          aria-label="refresh"
        >
          Refresh
        </button>
      </header>

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          Loading live KPIs…
        </div>
      )}

      {!loading && err && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 shadow-sm">
          Couldn’t load metrics. Check service-account access to the sheet. Error: {err}
        </div>
      )}

      {!!m && !err && (
        <>
          {/* 6 KPI tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <Tile label="SOS Today" value={m.totals.today} sub={`All: ${m.totals.all}`} />
            <Tile label="Last 7 Days" value={m.totals.last7Days} />
            <Tile label="Verified Rate" value={`${m.totals.verifiedRate}%`} sub={`Verified: ${m.totals.verified}`} />
            <Tile
              label="Avg Ack Time"
              value={m.times.ackAvgMins != null ? `${m.times.ackAvgMins} min` : "—"}
              sub="Ack → Created"
            />
            <Tile
              label="Avg Dispatch Time"
              value={m.times.dispatchAvgMins != null ? `${m.times.dispatchAvgMins} min` : "—"}
              sub="Assigned → Created"
            />
            <Tile label="Active Cases" value={m.statusCounts?.["Active"] ?? 0} sub="Status: Active" />
          </div>

          {/* SLA bars */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Ack ≤ 5 min", value: m?.sla?.ack5 ?? 0 },
              { label: "Dispatch ≤ 10 min", value: m?.sla?.dispatch10 ?? 0 },
              { label: "Close ≤ 45 min", value: m?.sla?.close45 ?? 0 },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border p-4 bg-white shadow-sm">
                <div className="text-sm text-gray-600">{s.label}</div>
                <div className="mt-2 h-2 rounded bg-gray-100">
                  <div className="h-2 rounded bg-black/80" style={{ width: `${s.value}%` }} />
                </div>
                <div className="mt-1 text-xs text-gray-500">{s.value}%</div>
              </div>
            ))}
          </div>

          {/* Risk chips */}
          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-700">Needs attention</div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-800">
                Stale Active &gt;30m · {m?.risk?.staleActive30m ?? 0}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">
                Pending · {m?.risk?.pending ?? 0}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">
                Stale Pending &gt;10m · {m?.risk?.stalePending10m ?? 0}
              </span>
            </div>
          </div>

          {/* Top Locations */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-700">Top locations</div>
            <div className="flex flex-wrap gap-2">
              {m.topLocations.length ? (
                m.topLocations.map((l) => (
                  <span key={l.name} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    {l.name} · {l.count}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No data yet</span>
              )}
            </div>
          </div>

          <footer className="text-xs text-gray-400">
            Updated {new Date(m.generatedAt).toLocaleString()}
          </footer>
        </>
      )}
    </section>
  );
}
