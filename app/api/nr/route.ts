// app/api/nr/route.ts
import { google } from "googleapis";

export const runtime = "nodejs";

// ---- Response shape ----
type Out = {
  totals: { all: number; today: number; last7Days: number; verified: number; verifiedRate: number };
  times: { ackAvgMins: number | null; dispatchAvgMins: number | null; closeAvgMins: number | null };
  statusCounts: Record<string, number>;
  topLocations: { name: string; count: number }[];
  // NEW
  sla: { ack5: number; dispatch10: number; close45: number };      // percentages 0-100
  risk: { staleActive30m: number; pending: number; stalePending10m: number };
  weekly: { labels: string[]; counts: number[] };                   // last 7 days (Lagos)
  drivers: { name: string; assigned: number; avgDispatchMins: number | null; avgCloseMins: number | null }[];
  generatedAt: string;
};

export async function GET(req: Request) {
  const email   = process.env.GOOGLE_CLIENT_EMAIL || "";
  const key     = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const sheetId = process.env.NR_SHEET_ID || "";
  const tab     = process.env.NR_EMERGENCY_SHEET_NAME || "Sheet1"; // e.g. "Emergencies"

  if (!email || !key || !sheetId) return json({ error: "Missing Google env" }, 500);

  try {
    const auth = new google.auth.JWT({ email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] });
    const sheets = google.sheets({ version: "v4", auth });

    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${tab}!A1:Z4000`,
      valueRenderOption: "FORMATTED_VALUE",
      majorDimension: "ROWS",
    });

    const table = data.values || [];
    if (table.length < 2) return json(emptyOut());

    const headers = table[0] as string[];
    const idx = (h: string) => headers.indexOf(h);

    const iId        = idx("Emergency ID");
    const iTs        = idx("Timestamp");
    const iAck       = idx("Ack Time");
    const iAssigned  = idx("Assigned Time");
    const iClosed    = idx("Closed Time");
    const iStatus    = idx("Status");
    const iPay       = idx("Payment Status");
    const iLoc       = idx("Location");
    const iDriver    = idx("Driver Assigned");

    const rows = table.slice(1);

    // ---- Helpers ----
    const parseTs = (v: any): Date | null => {
      if (!v) return null;
      const s = String(v).trim();
      const m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})$/);
      if (m) return new Date(`${m[1]}T${m[2]}+01:00`); // GMT+1
      const t = Date.parse(s);
      return isNaN(t) ? null : new Date(t);
    };
    const dayKey = (d: Date) =>
      new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" })
        .format(d);
    const now = new Date();
    const nowMs = now.getTime();
    const sevenMs = 7 * 24 * 60 * 60 * 1000;
    const nowKey = dayKey(now);
    const mins = (a: Date, b: Date) => (a.getTime() - b.getTime()) / 60000;

    // ---- Accumulators ----
    const total = rows.length;
    let today = 0, last7 = 0, verified = 0;

    let ackSum = 0, ackCnt = 0;
    let dispatchSum = 0, dispatchCnt = 0;
    let closeSum = 0, closeCnt = 0;

    let ackSLAok = 0, dispatchSLAok = 0, closeSLAok = 0;
    let ackSLAden = 0, dispatchSLAden = 0, closeSLAden = 0;

    const statusCounts: Record<string, number> = {};
    const locCounts: Record<string, number> = {};
    const driverAgg: Record<string, { assigned: number; dispatchSum: number; dispatchCnt: number; closeSum: number; closeCnt: number; }> = {};

    let staleActive30m = 0;
    let pending = 0;
    let stalePending10m = 0; // Using Ack Time as the "instructions sent" timestamp (your Apps Script stamps Ack after sending payment instructions)

    // Weekly buckets (last 7 days ending today)
    const weeklyKeys: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(nowMs - i * 24 * 60 * 60 * 1000);
      weeklyKeys.push(dayKey(d));
    }
    const weeklyMap: Record<string, number> = Object.fromEntries(weeklyKeys.map(k => [k, 0]));

    for (const r of rows) {
      const id        = iId >= 0 ? String(r[iId] || "") : "";
      const created   = iTs >= 0 ? parseTs(r[iTs]) : null;
      const ack       = iAck >= 0 ? parseTs(r[iAck]) : null;
      const assigned  = iAssigned >= 0 ? parseTs(r[iAssigned]) : null;
      const closed    = iClosed >= 0 ? parseTs(r[iClosed]) : null;

      const status    = (iStatus >= 0 ? String(r[iStatus] || "New") : "New").trim();
      const pay       = (iPay >= 0 ? String(r[iPay] || "") : "").trim().toLowerCase();
      const loc       = (iLoc >= 0 ? String(r[iLoc] || "") : "").trim().toLowerCase();
      const driver    = (iDriver >= 0 ? String(r[iDriver] || "") : "").trim();

      if (created) {
        // Daily counts
        const dk = dayKey(created);
        if (dk === nowKey) today++;
        if (nowMs - created.getTime() <= sevenMs) last7++;
        if (dk in weeklyMap) weeklyMap[dk] = (weeklyMap[dk] || 0) + 1;

        // Averages
        if (ack)      { const v = mins(ack, created);      if (isFinite(v)) { ackSum += v;      ackCnt++;      ackSLAden++; if (v <= 5)  ackSLAok++; } }
        if (assigned) { const v = mins(assigned, created); if (isFinite(v)) { dispatchSum += v; dispatchCnt++; dispatchSLAden++; if (v <= 10) dispatchSLAok++; } }
        if (closed)   { const v = mins(closed, created);   if (isFinite(v)) { closeSum += v;    closeCnt++;    closeSLAden++; if (v <= 45) closeSLAok++; } }
      }

      // Risk chips
      if ((status || "").toLowerCase() === "active" && assigned) {
        if (nowMs - assigned.getTime() > 30 * 60 * 1000) staleActive30m++;
      }
      if (pay === "pending") {
        pending++;
        // stale-pending (>10m after Ack, no verification yet)
        if (ack && (!closed || pay !== "verified")) {
          if (nowMs - ack.getTime() > 10 * 60 * 1000) stalePending10m++;
        }
      }

      // Status / locations / verified
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      if (pay === "verified") verified++;
      if (loc) locCounts[loc] = (locCounts[loc] || 0) + 1;

      // Driver aggregates
      if (driver) {
        const bucket = driverAgg[driver] || { assigned: 0, dispatchSum: 0, dispatchCnt: 0, closeSum: 0, closeCnt: 0 };
        bucket.assigned++;
        if (created && assigned) { const v = mins(assigned, created); if (isFinite(v)) { bucket.dispatchSum += v; bucket.dispatchCnt++; } }
        if (created && closed)   { const v = mins(closed, created);   if (isFinite(v)) { bucket.closeSum += v;    bucket.closeCnt++; } }
        driverAgg[driver] = bucket;
      }
    }

    // ---- Build response ----
    const avg = (s: number, c: number) => (c > 0 ? Math.round((s / c) * 10) / 10 : null);
    const pct = (ok: number, den: number) => (den > 0 ? Math.round((ok / den) * 1000) / 10 : 0);

    const verifiedRate = total > 0 ? Math.round((verified / total) * 1000) / 10 : 0;
    const topLocations = Object.entries(locCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const drivers = Object.entries(driverAgg)
      .map(([name, b]) => ({
        name,
        assigned: b.assigned,
        avgDispatchMins: avg(b.dispatchSum, b.dispatchCnt),
        avgCloseMins: avg(b.closeSum, b.closeCnt),
      }))
      .sort((a, b) => b.assigned - a.assigned)
      .slice(0, 8);

    const weekly = {
      labels: weeklyKeys,                         // yyyy-mm-dd strings (Lagos)
      counts: weeklyKeys.map(k => weeklyMap[k] || 0),
    };

    const out: Out = {
      totals: { all: total, today, last7Days: last7, verified, verifiedRate },
      times: { ackAvgMins: avg(ackSum, ackCnt), dispatchAvgMins: avg(dispatchSum, dispatchCnt), closeAvgMins: avg(closeSum, closeCnt) },
      statusCounts,
      topLocations,
      sla: { ack5: pct(ackSLAok, ackSLAden), dispatch10: pct(dispatchSLAok, dispatchSLAden), close45: pct(closeSLAok, closeSLAden) },
      risk: { staleActive30m, pending, stalePending10m },
      weekly,
      drivers,
      generatedAt: new Date().toISOString(),
    };

    return json(out, 200);
  } catch (e: any) {
    return json({ error: e?.message || "server error" }, 500);
  }
}

function emptyOut(): Out {
  return {
    totals: { all: 0, today: 0, last7Days: 0, verified: 0, verifiedRate: 0 },
    times: { ackAvgMins: null, dispatchAvgMins: null, closeAvgMins: null },
    statusCounts: {},
    topLocations: [],
    sla: { ack5: 0, dispatch10: 0, close45: 0 },
    risk: { staleActive30m: 0, pending: 0, stalePending10m: 0 },
    weekly: { labels: [], counts: [] },
    drivers: [],
    generatedAt: new Date().toISOString(),
  };
}

function json(o: unknown, status = 200) {
  return new Response(JSON.stringify(o), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
