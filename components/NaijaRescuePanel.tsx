"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMetrics, fetchEvents } from "@/lib/nrApi";

type Metrics = Awaited<ReturnType<typeof fetchMetrics>>;
type Events  = Awaited<ReturnType<typeof fetchEvents>>;

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
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [events, setEvents]   = useState<Events | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    try {
      const [m, e] = await Promise.all([fetchMetrics(), fetchEvents(25)]);
      setMetrics(m); setEvents(e); setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? "fetch error");
    }
  }

  useEffect(() => {
    refresh();
    const t1 = setInterval(refresh, 15000);
    return () => { clearInterval(t1); };
  }, []);

  const activeCount = useMemo(() => {
    if (!metrics) return 0;
    return metrics.statusCounts["Active"] ?? 0;
  }, [metrics]);

  return (
    <section className="w-full space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">NaijaRescue — Live KPIs</h2>
        <button
          onClick={refresh}
          className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
          aria-label="refresh"
        >
          Refresh
        </button>
      </header>

      {/* Tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="SOS Today" value={metrics?.totals.today ?? "—"} sub={`All: ${metrics?.totals.all ?? 0}`} />
        <Tile label="Verified Rate" value={`${metrics?.totals.verifiedRate ?? 0}%`} sub={`Verified: ${metrics?.totals.verified ?? 0}`} />
        <Tile label="Avg Ack Time" value={`${metrics?.times.ackAvgMins ?? "—"} min`} sub="Time to first reply" />
        <Tile label="Active Cases" value={activeCount} sub="Status: Active" />
      </div>

      {/* Top locations */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 text-sm font-medium text-gray-700">Top locations (last 10)</div>
        <div className="flex flex-wrap gap-2">
          {(metrics?.topLocations ?? []).map((l) => (
            <span key={l.name} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
              {l.name} · {l.count}
            </span>
          ))}
          {!metrics?.topLocations?.length && <span className="text-xs text-gray-400">No data yet</span>}
        </div>
      </div>

      {/* Events feed */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-medium text-gray-700">Recent Events</div>
        <ul className="space-y-2 max-h-80 overflow-auto pr-1">
          {(events?.items ?? []).map((it, i) => (
            <li key={i} className="flex items-start justify-between gap-4 rounded-lg bg-gray-50 px-3 py-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {it.emergencyId || "—"} <span className="text-gray-400">•</span> {it.eventType}
                </div>
                <div className="truncate text-xs text-gray-500">
                  {it.timestamp} — {it.location || "—"} — {it.status || "—"} {it.paymentStatus ? `— ${it.paymentStatus}` : ""}
                </div>
              </div>
              <div className="shrink-0 text-xs text-gray-400">{it.patientPhone || ""}</div>
            </li>
          ))}
          {!events?.items?.length && <li className="text-xs text-gray-400">No events yet</li>}
        </ul>
        {err && <div className="mt-3 text-xs text-red-600">Error: {err}</div>}
      </div>

      <footer className="text-xs text-gray-400">
        Updated {metrics?.generatedAt ? new Date(metrics.generatedAt).toLocaleString() : "—"}
      </footer>
    </section>
  );
}
