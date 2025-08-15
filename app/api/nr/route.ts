import { google } from "googleapis";

type Out = {
  totals: { all: number; today: number; last7Days: number; verified: number; verifiedRate: number };
  times: { ackAvgMins: number | null; dispatchAvgMins: number | null };
  statusCounts: Record<string, number>;
  topLocations: { name: string; count: number }[];
  generatedAt: string;
};

export async function GET(req: Request) {
  const email = process.env.GOOGLE_CLIENT_EMAIL || "";
  const key = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const sheetId = process.env.NR_SHEET_ID || "";
  const tab = process.env.NR_EMERGENCY_SHEET_NAME || "Sheet1";

  if (!email || !key || !sheetId) {
    return json({ error: "Missing Google env" }, 500);
  }

  try {
    const auth = new google.auth.JWT({ email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] });
    const sheets = google.sheets({ version: "v4", auth });

    // Pull a generous range; we rely on header row for mapping.
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${tab}!A1:Z2000`,
      valueRenderOption: "FORMATTED_VALUE",
      majorDimension: "ROWS",
    });

    const table = data.values || [];
    if (table.length < 2) return json(emptyOut());

    const headers = table[0] as string[];
    const idx = (h: string) => headers.indexOf(h);

    const iTs = idx("Timestamp");
    const iAck = idx("Ack Time");
    const iAssigned = idx("Assigned Time");
    const iStatus = idx("Status");
    const iPay = idx("Payment Status");
    const iLoc = idx("Location");

    const rows = table.slice(1);

    // Helpers
    const parseTs = (v: any): Date | null => {
      if (!v) return null;
      if (v instanceof Date && !isNaN(v.getTime())) return v;
      const s = String(v).trim();
      const m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})$/);
      if (m) return new Date(`${m[1]}T${m[2]}+01:00`); // GMT+1
      const t = Date.parse(s);
      return isNaN(t) ? null : new Date(t);
    };
    const dayKey = (d: Date) =>
      new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
    const now = new Date();
    const nowKey = dayKey(now);
    const seven = 7 * 24 * 60 * 60 * 1000;

    // Accumulators
    const total = rows.length;
    let today = 0, last7 = 0, verified = 0;
    let ackSum = 0, ackCnt = 0, dispatchSum = 0, dispatchCnt = 0;
    const statusCounts: Record<string, number> = {};
    const locCounts: Record<string, number> = {};

    for (const r of rows) {
      const created  = iTs >= 0 ? parseTs(r[iTs]) : null;
      const ack      = iAck >= 0 ? parseTs(r[iAck]) : null;
      const assigned = iAssigned >= 0 ? parseTs(r[iAssigned]) : null;

      const status = (iStatus >= 0 ? String(r[iStatus] || "New") : "New").trim();
      const pay = (iPay >= 0 ? String(r[iPay] || "") : "").trim().toLowerCase();
      const loc = (iLoc >= 0 ? String(r[iLoc] || "") : "").trim().toLowerCase();

      if (created) {
        if (dayKey(created) === nowKey) today++;
        if (now.getTime() - created.getTime() <= seven) last7++;
        if (ack)      { ackSum      += (ack.getTime() - created.getTime()) / 60000; ackCnt++; }
        if (assigned) { dispatchSum += (assigned.getTime() - created.getTime()) / 60000; dispatchCnt++; }
      }

      statusCounts[status] = (statusCounts[status] || 0) + 1;
      if (pay === "verified") verified++;
      if (loc) locCounts[loc] = (locCounts[loc] || 0) + 1;
    }

    const avg = (s: number, c: number) => (c > 0 ? Math.round((s / c) * 10) / 10 : null);
    const verifiedRate = total > 0 ? Math.round((verified / total) * 1000) / 10 : 0;
    const topLocations = Object.entries(locCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const out: Out = {
      totals: { all: total, today, last7Days: last7, verified, verifiedRate },
      times: { ackAvgMins: avg(ackSum, ackCnt), dispatchAvgMins: avg(dispatchSum, dispatchCnt) },
      statusCounts,
      topLocations,
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
    times: { ackAvgMins: null, dispatchAvgMins: null },
    statusCounts: {},
    topLocations: [],
    generatedAt: new Date().toISOString(),
  };
}

function json(o: unknown, status = 200) {
  return new Response(JSON.stringify(o), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
