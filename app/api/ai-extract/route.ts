// app/api/ai-extract/route.ts
export const runtime = "edge";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

type Extracted = {
  customerName: string | null;
  servicePrice: number | null;   // NGN, integer
  amountPaid: number | null;     // NGN, integer
  vehicleType: string | null;    // e.g., "GMC Terrain Charter Service"
  serviceDate: string | null;    // dd/MM/yyyy (UI expects en-GB)
  duration: string | null;       // e.g., "Full day service"
  isEmergency: boolean | null;
  isFirstTimer: boolean | null;
};

type Out =
  | { success: true; source: string; data: Required<Extracted>; debug?: string; availableKeys?: string[] }
  | { success: false; error: string; debug?: string; availableKeys?: string[] };

function json(o: Out, status = 200) {
  return new Response(JSON.stringify(o), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

// helpers
const toInt = (v: any) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return Math.round(v);
  const s = String(v).replace(/[^0-9]/g, "");
  return s ? parseInt(s, 10) : 0;
};

function toGbDate(isoLike: string | null): string {
  if (!isoLike) return new Date().toLocaleDateString("en-GB");
  // Accept "YYYY-MM-DD", "DD/MM/YYYY", or raw text; try best-effort
  const s = String(isoLike).trim();
  let d: Date | null = null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) d = new Date(s + "T00:00:00Z");
  else if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [dd, mm, yyyy] = s.split("/").map(Number);
    d = new Date(Date.UTC(yyyy, mm - 1, dd));
  } else {
    const t = Date.parse(s);
    if (!Number.isNaN(t)) d = new Date(t);
  }

  if (!d || Number.isNaN(d.getTime())) d = new Date();
  return d.toLocaleDateString("en-GB");
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const availableKeys = Object.keys(process.env || {}).filter((k) =>
    /GOOGLE|NR_|NEXT_PUBLIC_/.test(k)
  );

  if (!apiKey) {
    return json(
      {
        success: false,
        error: "Missing GOOGLE_GENERATIVE_AI_API_KEY",
        availableKeys,
      },
      500
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ success: false, error: "Invalid JSON" }, 400);
  }

  const chat: string = (body?.chat || "").toString().trim();
  if (!chat || chat.length < 10) {
    return json({ success: false, error: "Empty or too-short chat text" }, 400);
  }

  // Prompt: ask Gemini to return strict JSON
  const instructions = `
You extract invoice fields from WhatsApp-style chats.
Return ONLY strict JSON (no commentary) with this schema:

{
  "customerName": string | null,
  "servicePrice": number | null,  // NGN, integer
  "amountPaid": number | null,    // NGN, integer (0 if not stated)
  "vehicleType": string | null,   // e.g., "GMC Terrain Charter Service" or "Toyota Camry Charter Service"
  "serviceDate": string | null,   // "YYYY-MM-DD" if possible; otherwise any parseable date text
  "duration": string | null,      // e.g., "Full day service" or "10 hours"
  "isEmergency": boolean | null,
  "isFirstTimer": boolean | null
}

Rules:
- Currency is Nigerian Naira (₦). Convert words like "two hundred thousand" to 200000 if stated.
- If multiple numbers appear, the LARGEST typical "service price" is the servicePrice;
  an explicit "deposit", "half", or smaller amount near payment words is amountPaid.
- If no payment amount is clearly stated, amountPaid = 0.
- Detect emergency from words like "emergency", "urgent", "right now".
- Detect first-timer from "first time", "new customer", etc.
- If you can't find a value, use null.

Now extract from this chat:
---
${chat}
---
`;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
    encodeURIComponent(apiKey);

  const payload = {
    contents: [{ role: "user", parts: [{ text: instructions }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 512,
      response_mime_type: "application/json",
    },
    // Optional: relax safety so normal business text never blocks
    safetySettings: [
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    ],
  };

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await r.text();
    if (!r.ok) {
      return json(
        {
          success: false,
          error: `Gemini error ${r.status}: ${raw.slice(0, 200)}`,
          availableKeys,
        },
        500
      );
    }

    let modelJson: any;
    try {
      modelJson = JSON.parse(raw);
    } catch {
      return json({ success: false, error: "Gemini returned non-JSON body" }, 500);
    }

    // Gemini returns JSON-in-text inside candidates[].content.parts[].text
    const contentText =
      modelJson?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let extracted: Extracted;
    try {
      extracted = JSON.parse(contentText);
    } catch {
      // Sometimes returns already-structured object in the root; try that
      extracted = modelJson as Extracted;
    }

    // Normalize and fill defaults for UI component
    const out: Required<Extracted> = {
      customerName: extracted.customerName || "Valued Customer",
      servicePrice: toInt(extracted.servicePrice),
      amountPaid: toInt(extracted.amountPaid),
      vehicleType:
        extracted.vehicleType ||
        "Charter Service", // UI applies business mapping later
      serviceDate: toGbDate(extracted.serviceDate),
      duration: extracted.duration || "Full day service",
      isEmergency: Boolean(extracted.isEmergency),
      isFirstTimer: Boolean(extracted.isFirstTimer),
    };

    const debug = `usage: ${JSON.stringify(modelJson?.usageMetadata || {})}`;

    return json({
      success: true,
      source: "Google Gemini 1.5 Flash",
      data: out,
      debug,
      availableKeys,
    });
  } catch (e: any) {
    return json({
      success: false,
      error: e?.message || "Server error",
      availableKeys,
    }, 500);
  }
}
