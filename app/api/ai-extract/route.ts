// app/api/ai-extract/route.ts
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type ExtractOut = {
  success: boolean;
  source?: string;
  data?: Partial<{
    customerName: string;
    vehicleType: string;
    servicePrice: number;
    amountPaid: number;
    serviceDate: string; // dd/mm/yyyy
    duration: string;
    isEmergency: boolean;
    isFirstTimer: boolean;
  }>;
  error?: string;
  debug?: string;
  availableKeys?: string[];
};

function json(o: unknown, status = 200) {
  return new Response(JSON.stringify(o), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

// basic server-side fallback to sanity-check amounts
function scanAmounts(chat: string) {
  const all: number[] = [];
  const patterns = [
    /₦\s*(\d{1,3}(?:,\d{3})+)/g,               // ₦100,000
    /(\d{1,3}(?:,\d{3})+)\s*naira/gi,          // 150,000 naira
    /(\d+)\s*thousand/gi,                      // 150 thousand
  ];
  for (const p of patterns) {
    let m: RegExpExecArray | null;
    while ((m = p.exec(chat)) !== null) {
      let v = parseInt(m[1].replace(/,/g, ""), 10);
      if (/thousand/i.test(p.source)) v = v * 1000;
      if (v >= 1000) all.push(v);
    }
  }
  return all;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const chat: string = body?.chat ?? "";

    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    if (!chat.trim()) {
      return json<ExtractOut>({ success: false, error: "empty chat" }, 400);
    }
    if (!key) {
      return json<ExtractOut>({
        success: false,
        error: "No GOOGLE_GENERATIVE_AI_API_KEY configured",
        availableKeys: Object.keys(process.env || {}),
      });
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Ask for JSON directly
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
Extract a clean JSON from the WhatsApp conversation below.
- Only use values that are explicitly implied by the chat.
- Do NOT invent prices or names.
- If unknown, omit the field entirely.

Return JSON with these optional keys:
{
  "customerName": string,
  "vehicleType": string,
  "servicePrice": number, // in NGN
  "amountPaid": number,   // in NGN
  "serviceDate": "dd/mm/yyyy",
  "duration": string,
  "isEmergency": boolean,
  "isFirstTimer": boolean
}

Conversation:
"""${chat}"""
`;

    const r = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const text = r.response?.text?.() ?? "";

    // The model returns JSON because of responseMimeType, but still parse defensively
    let data: any = {};
    try { data = JSON.parse(text); } catch { /* leave empty */ }

    // Normalize numbers
    if (typeof data?.servicePrice === "string") data.servicePrice = parseInt(data.servicePrice.replace(/[^\d]/g, ""), 10);
    if (typeof data?.amountPaid === "string")  data.amountPaid  = parseInt(data.amountPaid.replace(/[^\d]/g, ""), 10);

    // If servicePrice is missing/0, try server-side scan
    const amounts = scanAmounts(chat);
    if ((!data?.servicePrice || data.servicePrice < 1000) && amounts.length) {
      data.servicePrice = Math.max(...amounts);
    }
    // If amountPaid missing, try smaller amount heuristic
    if ((data?.amountPaid == null || isNaN(data.amountPaid)) && amounts.length >= 2) {
      data.amountPaid = Math.min(...amounts);
    }

    // Very conservative success criteria: servicePrice OR amountPaid OR some field present
    const hasSomething =
      (data && Object.keys(data).length > 0) ||
      (amounts && amounts.length > 0);

    if (!hasSomething) {
      return json<ExtractOut>({ success: false, error: "nothing extracted", debug: text?.slice?.(0, 200) || "" }, 200);
    }

    return json<ExtractOut>({
      success: true,
      source: "Google Gemini 1.5 Flash (JSON)",
      data,
      debug: text?.slice?.(0, 200) || "",
    });
  } catch (e: any) {
    return json<ExtractOut>({ success: false, error: e?.message || "server error" }, 500);
  }
}
