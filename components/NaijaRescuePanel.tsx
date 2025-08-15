"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMetrics } from "@/lib/nrApi";

type Metrics = Awaited<ReturnType<typeof fetchMetrics>>;

function Tile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
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
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    try {
      const m = await fetchMetrics();         // <- only metrics now
      setMetrics(m);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? "fetch error");
    }
  }

  useEffect(() => {
    refresh();
    const t1 = setInterval(refresh, 15000);
    return () => clearInterval(t1);
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
        <Tile
          label="SOS Today"
          value={metrics?.totals.today ?? "—"}
          sub={`All: ${metrics?.totals.all ?? 0}`}
        />
        <Tile
          label="Verified Rate"
          value={`${metrics?.totals.verifiedRate ?? 0}%`}
          sub={`Verified: ${metrics?.totals.verified ?? 0}`}
        />
        <Tile
          label="Avg Ack Time"
          value={`${metrics?.times.ackAvgMins ?? "—"} min`}
          sub="Time to first reply"
        />
        <Tile label="Active Cases" value={activeCount} sub="Status: Active" />
      </div>

      {/* Top locations (from metrics only) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 text-sm font-medium text-gray-700">
          Top locations (last 10)
        </div>
        <div className="flex flex-wrap gap-2">
          {(metrics?.topLocations ?? []).map((l) => (
            <span
              key={l.name}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
            >
              {l.name} · {l.count}
            </span>
          ))}
          {!metrics?.topLocations?.length && (
            <span className="text-xs text-gray-400">No data yet</span>
          )}
        </div>
      </div>

      {/* Status breakdown (replaces Events feed) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-medium text-gray-700">
          Status breakdown
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {Object.entries(metrics?.statusCounts ?? {}).map(([k, v]) => (
            <li key={k} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
              <div className="text-gray-600">{k || "—"}</div>
              <div className="text-lg font-semibold">{v as number}</div>
            </li>
          ))}
          {!metrics?.statusCounts || !Object.keys(metrics.statusCounts).length ? (
            <li className="text-xs text-gray-400">No status data yet</li>
          ) : null}
        </ul>
        {err && (
          <div className="mt-3 text-xs text-red-600">
            Can’t load metrics. Check Apps Script deploy & NR_API. Error: {err}
          </div>
        )}
      </div>

      <footer className="text-xs text-gray-400">
        Updated{" "}
        {metrics?.generatedAt
          ? new Date(metrics.generatedAt).toLocaleString()
          : "—"}
      </footer>
    </section>
  );
}
