export async function fetchMetrics() {
  const r = await fetch(`/api/nr?action=metrics`, { cache: "no-store" });
  if (!r.ok) throw new Error(`metrics ${r.status}`);
  return r.json() as Promise<{
    totals: { all: number; today: number; last7Days: number; verified: number; verifiedRate: number };
    times: { ackAvgMins: number | null; dispatchAvgMins: number | null };
    statusCounts: Record<string, number>;
    topLocations: { name: string; count: number }[];
    generatedAt: string;
  }>;
}
