// app/api/ai-extract/route.ts
export const runtime = "edge"; // or "nodejs" if you prefer

type ExtractOut = {
  success: boolean;
  data?: {
    customerName?: string;
    vehicleType?: string;
    servicePrice?: number;
    amountPaid?: number;
    serviceDate?: string; // e.g. 10/08/2025 (DD/MM/YYYY)
    duration?: string;
    isEmergency?: boolean;
    isFirstTimer?: boolean;
  };
  source?: string;
  error?: string;
  debug?: string;
};

function json(o: unknown, status = 200) {
  return new Response(JSON.stringify(o), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function POST(req: Request) {
  let chat = "";
  try {
    const body = await req.json();
    chat = (body?.chat || "").toString();
  } catch {
    return json({ success: false, error: "Invalid JSON body" } as ExtractOut, 400);
  }
  if (!chat || chat.trim().length < 10) {
    return json({ success: false, error: "chat is required" } as ExtractOut, 400);
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return json({ success: false, error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" } as ExtractOut, 500);
  }

  const schema = `Return ONLY JSON (no backticks) with keys:
{
  "customerName": string,            // person's name if present
  "vehicleType": string,             // e.g. "GMC Terrain Charter Service" or "Toyota Camry Charter Service"
  "servicePrice": number,            // price discussed for the service, in naira
  "amountPaid": number,              // any payment amount mentioned, 0 if none
  "serviceDate": string,             // date in DD/MM/YYYY if a date is clear; else today's date in that format
  "duration": string,                // e.g. "10 hours" or "Full day service"
  "isEmergency": boolean,
  "isFirstTimer": boolean
}`;

  const prompt = [
    `You are an extraction model. Read the WhatsApp-style chat and extract structured fields.`,
    `- Detect all monetary amounts; pick the most likely service price and any amount paid.`,
    `- If a day name appears (e.g. Saturday), set serviceDate to the next occurrence of that weekday.`,
    `- If no clear date, use today's date in DD/MM/YYYY.`,
    `- Vehicle keywords: "GMC", "Terrain", "Toyota", "Camry" should map to human labels.`,
    `- Return strictly valid JSON. Do not include any commentary.`,
    ``,
    schema,
    ``,
    `CHAT:\n${chat}`,
  ].join("\n");

  // Call Gemini 1.5 Flash via REST
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
    encodeURIComponent(apiKey);

  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0, topP: 0.1, topK: 1, maxOutputTokens: 512 },
    }),
  });

  if (!r.ok) {
    const dbg = await r.text().catch(() => "");
    return json({ success: false, error: `Gemini HTTP ${r.status}`, debug: dbg } as ExtractOut, 502);
  }

  const data = await r.json().catch(() => ({}));
  const text: string =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || "").join("") || "";

  // Try to parse JSON from the model response
  let parsed: any = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/); // grab first {...} block
    if (m) {
      try {
        parsed = JSON.parse(m[0]);
      } catch {
        /* ignore */
      }
    }
  }

  if (!parsed || typeof parsed !== "object") {
    return json({ success: false, error: "Model did not return valid JSON", debug: text.slice(0, 400) } as ExtractOut, 200);
  }

  // Sanitize & coerce
  const clean = {
    customerName: parsed.customerName ? String(parsed.customerName) : undefined,
    vehicleType: parsed.vehicleType ? String(parsed.vehicleType) : undefined,
    servicePrice:
      typeof parsed.servicePrice === "number" && parsed.servicePrice >= 0 ? Number(parsed.servicePrice) : undefined,
    amountPaid:
      typeof parsed.amountPaid === "number" && parsed.amountPaid >= 0 ? Number(parsed.amountPaid) : 0,
    serviceDate: parsed.serviceDate ? String(parsed.serviceDate) : undefined,
    duration: parsed.duration ? String(parsed.duration) : undefined,
    isEmergency: !!parsed.isEmergency,
    isFirstTimer: !!parsed.isFirstTimer,
  };

  return json({ success: true, data: clean, source: "Google Gemini 1.5 Flash" } as ExtractOut, 200);
}

// Optional ping
export async function GET() {
  return json({ ok: true }, 200);
}
