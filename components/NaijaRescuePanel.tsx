"use client";

import { useEffect, useState } from "react";
import { fetchMetrics } from "@/lib/nrApi";

type Metrics = Awaited<ReturnType<typeof fetchMetrics>>;

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
      setM(data); setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? "fetch error"); setM(null);
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
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">NaijaRescue — Live Ops</h2>
        <button onClick={refresh} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50" aria-label="refresh">
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
            <Tile label="Avg Ack Time" value={m.times.ackAvgMins != null ? `${m.times.ackAvgMins} min` : "—"} sub="Ack → Created" />
            <Tile label="Avg Dispatch Time" value={m.times.dispatchAvgMins != null ? `${m.times.dispatchAvgMins} min` : "—"} sub="Assigned → Created" />
            <Tile label="Active Cases" value={m.statusCounts?.["Active"] ?? 0} sub="Status: Active" />
          </div>

          {/* Top Locations */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-700">Top locations</div>
            <div className="flex flex-wrap gap-2">
              {m.topLocations.length
                ? m.topLocations.map((l) => (
                    <span key={l.name} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      {l.name} · {l.count}
                    </span>
                  ))
                : <span className="text-xs text-gray-400">No data yet</span>}
            </div>
          </div>

          <footer className="text-xs text-gray-400">Updated {new Date(m.generatedAt).toLocaleString()}</footer>
        </>
      )}
    </section>
  );
}
