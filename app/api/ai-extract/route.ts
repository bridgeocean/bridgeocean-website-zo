// app/api/ai-extract/route.ts
// Uses Gemini REST API (no SDK). Keep your API key in env: GOOGLE_GENERATIVE_AI_API_KEY
export const runtime = "nodejs";

type Extracted = {
  customerName?: string;
  vehicleType?: string;
  servicePrice?: number; // NGN
  amountPaid?: number;   // NGN
  serviceDate?: string;  // DD/MM/YYYY
  duration?: string;
  isEmergency?: boolean;
  isFirstTimer?: boolean;
};

function buildPrompt(chat: string) {
  return `
You extract billing facts from a WhatsApp-style charter negotiation.

Return ONLY a compact JSON object with these optional keys:
- customerName (string)
- vehicleType (string)
- servicePrice (number, NGN) — pick the FINAL agreed price (look for "deal", "agree", "final", "new total")
- amountPaid (number, NGN) — the last figure near "pay", "paid", "transfer", "deposit", "upfront", "advance"
- serviceDate (string DD/MM/YYYY if mentioned)
- duration (string, e.g. "10 hours", "2 days" if mentioned)
- isEmergency (boolean)
- isFirstTimer (boolean)

Prefer the latest values. Do not explain. JSON only.

CHAT:
"""${chat ?? ""}"""
`.trim();
}

export async function POST(req: Request) {
  const { chat } = await req.json().catch(() => ({ chat: "" }));
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" }, { status: 500 });
  }

  try {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      encodeURIComponent(apiKey);

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt(chat || "") }],
        },
      ],
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return Response.json({ success: false, error: `Gemini HTTP ${r.status}: ${text.slice(0, 300)}` }, { status: 502 });
    }

    const json = await r.json();

    // text is inside candidates[0].content.parts[].text
    const text: string =
      json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join("\n") ?? "";

    const clean = (text || "").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    let data: Extracted = {};
    try {
      data = clean ? JSON.parse(clean) : {};
    } catch {
      data = {};
    }

    return Response.json({ success: true, data, source: "Google Gemini (REST)" });
  } catch (e: any) {
    return Response.json(
      { success: false, error: e?.message || "Gemini call failed" },
      { status: 500 }
    );
  }
}
