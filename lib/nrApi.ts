export async function fetchMetrics() {
  const r = await fetch(`/api/nr?action=metrics`, { cache: "no-store" });
  if (!r.ok) throw new Error("metrics fetch failed");
  return r.json() as Promise<{
    totals: { all: number; today: number; last7Days: number; verified: number; verifiedRate: number };
    times: { ackAvgMins: number | null; dispatchAvgMins: number | null; closeAvgMins: number | null };
    statusCounts: Record<string, number>;
    topLocations: { name: string; count: number }[];
    generatedAt: string;
  }>;
}

export async function fetchEvents(limit = 25) {
  const r = await fetch(`/api/nr?action=events&limit=${limit}`, { cache: "no-store" });
  if (!r.ok) throw new Error("events fetch failed");
  return r.json() as Promise<{ total: number; items: Array<{
    timestamp: string; eventType: string; emergencyId: string;
    patientPhone: string; location: string; status: string;
    paymentStatus: string; notes: string; raw: any;
  }> }>;
}
