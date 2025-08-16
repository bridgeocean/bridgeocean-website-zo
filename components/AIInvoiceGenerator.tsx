"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Loader2,
  Copy,
  Brain,
  Receipt,
  CheckCircle,
  Zap,
  AlertTriangle,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --------------------- Types ---------------------
interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  serviceDate: string;  // dd/mm/yyyy
  dueDate: string;      // dd/mm/yyyy
  vehicle: string;
  duration: string;
  rate: number;
  quantity: number;
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  terms: string;
  amountPaid: number;
  balanceDue: number;
  source: string;
}

interface ReceiptData {
  transactionId: string;
  mccCode: string;
  paymentMethod: string;
  subtotal: number;
  serviceCharge: number;
  total: number;
  timestamp: string;
  customerName: string;
}

// --------------------- html2pdf utils (PDF FIX) ---------------------
// put these above generatePDF()
let _html2pdfPromise: Promise<any> | null = null;

async function loadHtml2pdf() {
  // Use bundled build so html2canvas/jsPDF are included
  if (!_html2pdfPromise) {
    _html2pdfPromise = import("html2pdf.js/dist/html2pdf.bundle.min.js");
  }
  const mod = await _html2pdfPromise;
  return (mod?.default ?? (globalThis as any).html2pdf) as any;
}

async function waitForAssets(root: HTMLElement) {
  try { await (document as any).fonts?.ready; } catch {}
  const imgs = Array.from(root.querySelectorAll("img")) as HTMLImageElement[];
  await Promise.all(
    imgs.map((img) => {
      try { if (!img.crossOrigin) img.crossOrigin = "anonymous"; } catch {}
      return img.complete
        ? Promise.resolve()
        : new Promise((res) => {
            img.addEventListener("load", res, { once: true });
            img.addEventListener("error", res, { once: true });
          });
    })
  );
}

function isIOSorSafari() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  return isIOS || isSafari;
}

// ----- REPLACE your generatePDF with this:
async function generatePDF(htmlContent: string, filename: string) {
  const host = document.createElement("div");
  // render off-screen but measurable (not display:none)
  host.style.position = "fixed";
  host.style.left = "-99999px";
  host.style.top = "0";
  host.style.width = "794px"; // ~A4 width @ 96dpi
  host.style.zIndex = "-1";
  host.innerHTML = htmlContent;
  document.body.appendChild(host);

  try {
    const html2pdf = await loadHtml2pdf();
    await waitForAssets(host);

    const opts = {
      margin: 10, // mm
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
      },
      jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
    };

    if (isIOSorSafari()) {
      await html2pdf().set(opts).from(host).toPdf().save();
    } else {
      await html2pdf().set(opts).from(host).save();
    }
  } catch (err) {
    // graceful fallback: download HTML
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.replace(/\.pdf$/i, ".html");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    throw new Error("PDF generation failed; HTML downloaded instead.");
  } finally {
    host.remove();
  }
}

// --------------------- Component ---------------------
export function AIInvoiceGenerator() {
  const [whatsappChat, setWhatsappChat] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const [activeView, setActiveView] = useState<"invoice" | "receipt">("invoice");
  const [includeVAT, setIncludeVAT] = useState(false);
  const [aiSource, setAiSource] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [overrideDate, setOverrideDate] = useState<string>("");            // yyyy-mm-dd picker
  const [overridePaid, setOverridePaid] = useState<string>("");            // numeric NGN
  const { toast } = useToast();

  // Fallback knowledge base
  const bridgeoceanKnowledge = {
    vehicles: {
      "gmc terrain": { name: "GMC Terrain Charter Service", rate: 200000, minHours: 10 },
      gmc: { name: "GMC Terrain Charter Service", rate: 200000, minHours: 10 },
      "toyota camry": { name: "Toyota Camry Charter Service", rate: 100000, minHours: 10 },
      camry: { name: "Toyota Camry Charter Service", rate: 100000, minHours: 10 },
      toyota: { name: "Toyota Camry Charter Service", rate: 100000, minHours: 10 },
    },
    terms: {
      standard: "Payment terms as agreed in conversation",
      emergency: "Full payment required for emergency services",
    },
    notes: {
      standard: "Professional charter service with driver and fuel included.",
      firstTimer: "First timer discount applied. Professional charter service with driver and fuel included.",
      emergency: "Emergency response service with immediate dispatch.",
    },
  };

  // --------- Helpers ----------
  const toGBPDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" });

  const isoToGb = (yyyyMmDd: string) => {
    if (!yyyyMmDd) return "";
    const [y, m, d] = yyyyMmDd.split("-");
    return `${d}/${m}/${y}`;
  };

  // Generate Receipt Data (with fallback if amountPaid is 0)
  const generateReceiptData = (invoice: InvoiceData): ReceiptData => {
    const now = new Date();
    const timestamp =
      now.toLocaleDateString("en-GB") +
      " " +
      now.toLocaleTimeString("en-GB", { hour12: false, hour: "2-digit", minute: "2-digit" });

    const transactionId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const mccCode = "4121" + Math.random().toString(36).substring(2, 6).toUpperCase();

    // If amountPaid is 0, fall back to total (prevents empty/zero receipts)
    const paid = invoice.amountPaid && invoice.amountPaid > 0 ? invoice.amountPaid : invoice.total;

    return {
      transactionId,
      mccCode,
      paymentMethod: "Bank Transfer",
      subtotal: paid,
      serviceCharge: 0,
      total: paid,
      timestamp,
      customerName: invoice.customerName,
    };
  };

  // ---- AI extraction via your /api/ai-extract (will fallback if fails) ----
  const aiExtraction = async (chat: string) => {
    const res = await fetch("/api/ai-extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat }),
    });
    const result = await res.json();
    if (result.debug || result.availableKeys) {
      setDebugInfo(
        `Debug: ${result.debug || "No debug info"}, Available keys: ${result.availableKeys?.join(", ") || "None"}`
      );
    }
    if (result.success && result.data) {
      return {
        customerName: result.data.customerName || "Valued Customer",
        servicePrice: result.data.servicePrice || 100000,
        amountPaid: result.data.amountPaid || 0,
        vehicleType: result.data.vehicleType || "Charter Service",
        serviceDate: result.data.serviceDate || toGBPDate(new Date()),
        duration: result.data.duration || "Full day service",
        isEmergency: result.data.isEmergency || false,
        isFirstTimer: result.data.isFirstTimer || false,
        source: result.source || "AI",
      };
    }
    throw new Error(result.error || "AI extraction failed");
  };

  // Hybrid parser (fallback)
  const hybridExtraction = (chat: string) => {
    const lowerChat = chat.toLowerCase();

    const allAmounts: number[] = [];
    const amountPatterns = [/₦\s*(\d+(?:,\d+)*)/g, /(\d+(?:,\d+)*)\s*naira/gi, /(\d+(?:,\d+)*)\s*thousand/gi];
    amountPatterns.forEach((p) => {
      let m;
      while ((m = p.exec(chat)) !== null) {
        let amt = Number.parseInt(m[1].replace(/,/g, ""));
        if (p.source.includes("thousand")) amt *= 1000;
        if (amt >= 1000) allAmounts.push(amt);
      }
    });

    const allNames: string[] = [];
    const namePatterns = [
      /mr\.?\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)*)/gi,
      /mrs\.?\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)*)/gi,
      /ms\.?\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)*)/gi,
      /my name is ([a-zA-Z\s]+)/gi,
      /i'm ([a-zA-Z\s]+)/gi,
      /this is ([a-zA-Z\s]+)/gi,
      /([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
    ];
    namePatterns.forEach((p) => {
      let m;
      while ((m = p.exec(chat)) !== null) {
        const name = m[1].trim();
        if (name.length > 2 && !["Good Morning", "Thank You"].includes(name)) {
          allNames.push(name);
        }
      }
    });

    // service date guess: today/tomorrow or keep today
    const d = new Date();
    if (lowerChat.includes("tomorrow")) d.setDate(d.getDate() + 1);

    // vehicle
    let vehicleType = "Charter Service";
    let vehicleRate = 100000;
    Object.entries(bridgeoceanKnowledge.vehicles).forEach(([k, info]) => {
      if (lowerChat.includes(k)) {
        vehicleType = info.name;
        vehicleRate = info.rate;
      }
    });

    const customerName = allNames[0] || "Valued Customer";
    const servicePrice = allAmounts.length ? Math.max(...allAmounts) : vehicleRate;

    // amount paid heuristic
    let amountPaid = 0;
    const paymentKeywords = ["pay", "transfer", "payment", "deposit"];
    const halfKeywords = ["half", "50%", "fifty percent"];
    if (halfKeywords.some((w) => lowerChat.includes(w))) amountPaid = Math.round(servicePrice * 0.5);
    else if (paymentKeywords.some((w) => lowerChat.includes(w))) {
      amountPaid = allAmounts.length >= 2 ? Math.min(...allAmounts) : servicePrice;
    }
    if (lowerChat.includes("full amount") || lowerChat.includes("complete payment")) {
      amountPaid = servicePrice;
    }

    return {
      customerName,
      servicePrice,
      amountPaid,
      vehicleType,
      serviceDate: toGBPDate(d),
    };
  };

  // Extract → build invoice
  const extractInvoiceDataWithAI = async (chat: string): Promise<InvoiceData> => {
    setIsGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 200)); // small UX delay
      let ex: any;
      try {
        ex = await aiExtraction(chat);
        setAiSource(ex.source);
        toast({ title: "✅ AI extraction", description: `${ex.source} analyzed your conversation` });
      } catch {
        const h = hybridExtraction(chat);
        ex = {
          customerName: h.customerName,
          servicePrice: h.servicePrice,
          amountPaid: h.amountPaid,
          vehicleType: h.vehicleType,
          serviceDate: h.serviceDate,
          duration: "Full day service",
          isEmergency: false,
          isFirstTimer: false,
          source: "Hybrid Logic",
        };
        setAiSource("Hybrid Logic");
        toast({ title: "⚡ Fallback parser", description: "Smart pattern matching used" });
      }

      let notes = bridgeoceanKnowledge.notes.standard;
      let finalRate = ex.servicePrice;
      if (ex.isFirstTimer) {
        notes = bridgeoceanKnowledge.notes.firstTimer;
        finalRate = Math.round(ex.servicePrice * 0.9);
      }
      if (ex.isEmergency) {
        notes = bridgeoceanKnowledge.notes.emergency;
        finalRate = Math.round(ex.servicePrice * 1.2);
      }

      const quantity = 1;
      const subtotal = finalRate * quantity;
      const vat = includeVAT ? Math.round(subtotal * 0.075) : 0;
      const total = subtotal + vat;

      const serviceDateObj = new Date(ex.serviceDate.split("/").reverse().join("-"));
      const due = new Date(serviceDateObj);
      due.setDate(serviceDateObj.getDate() + 1);

      const invoiceNumber = `INV${String(Date.now()).slice(-3)}-BO`;

      const amountPaid = typeof ex.amountPaid === "number" ? ex.amountPaid : 0;
      const balanceDue = total - amountPaid;

      return {
        invoiceNumber,
        customerName: ex.customerName,
        serviceDate: ex.serviceDate,
        dueDate: toGBPDate(due),
        vehicle: ex.vehicleType,
        duration: ex.duration,
        rate: finalRate,
        quantity,
        subtotal,
        vat,
        total,
        amountPaid,
        balanceDue,
        notes,
        terms: bridgeoceanKnowledge.terms.standard,
        source: ex.source,
      };
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate & apply overrides
  const handleGenerateInvoice = async () => {
    if (!whatsappChat.trim()) {
      toast({ title: "WhatsApp chat required", description: "Paste a conversation first", variant: "destructive" });
      return;
    }
    try {
      const data = await extractInvoiceDataWithAI(whatsappChat);
      // apply overrides if present (user can also edit after)
      const svcDate = overrideDate ? isoToGb(overrideDate) : data.serviceDate;
      const paid = overridePaid ? Math.max(0, Number(overridePaid.replace(/[^\d]/g, ""))) : data.amountPaid;
      const balance = data.total - paid;
      const newData = { ...data, serviceDate: svcDate, amountPaid: paid, balanceDue: balance };
      setInvoiceData(newData);
      setReceiptData(generateReceiptData(newData));
      toast({ title: "Invoice & Receipt ready", description: `Data extracted via ${newData.source}` });
    } catch {
      toast({ title: "Error generating invoice", description: "Try again or adjust inputs", variant: "destructive" });
    }
  };

  // Keep receipt in sync when invoice edits happen
  useEffect(() => {
    if (!invoiceData) return;
    setReceiptData(generateReceiptData(invoiceData));
  }, [invoiceData?.amountPaid, invoiceData?.customerName, invoiceData?.total]);

  // UI helpers
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  const exampleChats = [
    `Client (Mr. John Adebayo): Good morning. I'd like to charter a Toyota Camry for a full day. What's the cost?
Bridgeocean (Ms. Ada Eze): Good morning, Mr. Adebayo. The Toyota Camry full-day charter is ₦100,000 for 10 hours.
Client: That works. Can you book it for Saturday, August 10th?
Bridgeocean: Yes, reserved for Saturday, August 10th. To confirm, please make a 50% deposit.
Client: I’ll pay ₦50,000 now by transfer.
Bridgeocean: Thank you. Once received, your booking is confirmed.
Client: Payment done. My name is John Adebayo.
Bridgeocean: Confirmed, Mr. Adebayo. See you on August 10th.`,
    `Customer: Emergency ride needed right now at Ikeja. Do you have GMC Terrain?
Bridgeocean: Yes, GMC Terrain emergency service is ₦200,000 for up to 10 hours.
Customer: Ok, I’ll pay the full amount now.
Bridgeocean: Great. Please send the transfer screenshot to confirm dispatch.
Customer: Transfer of ₦200,000 sent. I’m David Okoro.
Bridgeocean: Received. Driver en route to Ikeja immediately, Mr. Okoro.`,
    `Client (Mrs. Kemi Balogun): Hello. We need a Toyota Camry tomorrow for a client visit.
Bridgeocean: Hello Mrs. Balogun. The Camry day rate is 150 thousand naira.
Client: Noted. I’ll make payment now to lock it in. This is Kemi Balogun from Acme Ltd.
Bridgeocean: Thank you. Payment confirms the booking for tomorrow.
Client: Transfer of 150,000 naira completed.
Bridgeocean: Confirmed. Camry scheduled for tomorrow.`,
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Invoice & Receipt Generator
            {aiSource && (
              <Badge variant="secondary" className="ml-2">
                {aiSource.includes("Google") && <CheckCircle className="w-3 h-3 mr-1 text-green-600" />}
                {aiSource.includes("Hybrid") && <Zap className="w-3 h-3 mr-1 text-orange-600" />}
                {aiSource}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Uses Google Gemini (when available) with a robust fallback. Add date/amount below if AI misses them.
          </CardDescription>
          {debugInfo && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              {debugInfo}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp Chat Conversation</label>
            <Textarea
              placeholder="Paste your WhatsApp conversation here..."
              value={whatsappChat}
              onChange={(e) => setWhatsappChat(e.target.value)}
              rows={8}
              className="resize-none font-mono text-sm"
            />
          </div>

          {/* Manual pre-overrides */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <label className="text-sm font-medium">Service Date (optional)</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  value={overrideDate}
                  onChange={(e) => setOverrideDate(e.target.value)}
                />
                <div className="mt-1 text-xs text-gray-500">If set, overrides AI date.</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <label className="text-sm font-medium">Amount Paid (optional)</label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="e.g. 50000"
                  value={overridePaid}
                  onChange={(e) => setOverridePaid(e.target.value)}
                />
                <div className="mt-1 text-xs text-gray-500">If set, overrides AI amount.</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="include-vat" checked={includeVAT} onCheckedChange={(c) => setIncludeVAT(!!c)} />
            <label htmlFor="include-vat" className="text-sm font-medium leading-none">
              Include 7.5% VAT in calculations
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Example Conversations (click to use)</label>
            <div className="grid grid-cols-1 gap-2">
              {exampleChats.map((ex, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => setWhatsappChat(ex)}
                  className="text-xs h-auto p-3 text-left justify-start"
                >
                  <div className="truncate">
                    <strong>Example {i + 1}:</strong> {ex.split("\n")[0].substring(0, 60)}...
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerateInvoice} className="w-full" disabled={isGenerating || !whatsappChat.trim()}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting Data…
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Invoice & Receipt
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview + Edit after generation */}
      {invoiceData && receiptData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Documents
              {aiSource && (
                <Badge variant="outline" className="ml-2">
                  Powered by {aiSource}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              You can adjust **Service Date** and **Amount Paid** below—totals and receipt auto-update.
            </CardDescription>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs text-gray-600">Service Date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  value={invoiceData.serviceDate.split("/").reverse().join("-")}
                  onChange={(e) => {
                    const gb = isoToGb(e.target.value);
                    setInvoiceData((prev) => (prev ? { ...prev, serviceDate: gb } : prev));
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Amount Paid (NGN)</label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  value={invoiceData.amountPaid}
                  onChange={(e) => {
                    const paid = Math.max(0, Number(e.target.value || 0));
                    setInvoiceData((prev) => (prev ? { ...prev, amountPaid: paid, balanceDue: prev.total - paid } : prev));
                  }}
                />
              </div>
              <div className="self-end text-sm">
                <div className="text-gray-600">Balance Due</div>
                <div className="font-semibold text-blue-600">{formatCurrency(invoiceData.balanceDue)}</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* INVOICE PREVIEW */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img src="/images/bridgeocean-logo.jpg" alt="Bridgeocean Logo" className="h-16 w-16 object-contain" />
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-lg font-semibold text-blue-600">#{invoiceData.invoiceNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-lg">Bridgeocean Limited</h3>
                <p className="text-sm text-muted-foreground">Premium Charter Services</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Bill To:</h4>
                <p className="text-lg">{invoiceData.customerName}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Service Date:</span>
                  <span>{invoiceData.serviceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Due Date:</span>
                  <span>{invoiceData.dueDate}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Balance Due:</span>
                  <span className="text-blue-600">{formatCurrency(invoiceData.balanceDue)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="grid grid-cols-4 gap-4 font-semibold border-b pb-2 mb-4">
                <span>Item</span>
                <span>Quantity</span>
                <span>Rate</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="grid grid-cols-4 gap-4 py-2">
                <span>
                  {invoiceData.vehicle} ({invoiceData.duration})
                </span>
                <span>{invoiceData.quantity}</span>
                <span>{formatCurrency(invoiceData.rate)}</span>
                <span className="text-right">{formatCurrency(invoiceData.subtotal)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoiceData.subtotal)}</span>
              </div>
              {invoiceData.vat > 0 && (
                <div className="flex justify-between">
                  <span>VAT (7.5%):</span>
                  <span>{formatCurrency(invoiceData.vat)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(invoiceData.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span>{formatCurrency(invoiceData.amountPaid)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-blue-600">
                <span>Balance Due:</span>
                <span>{formatCurrency(invoiceData.balanceDue)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Notes:</h4>
                <p className="text-sm text-muted-foreground">{invoiceData.notes}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Terms:</h4>
                <p className="text-sm text-muted-foreground">{invoiceData.terms}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={async () => {
                  if (!invoiceData) return;
                  setIsGeneratingPDF(true);
                  try {
                    const htmlContent = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Invoice ${invoiceData.invoiceNumber}</title>
<style>
body { font-family: Arial, sans-serif; margin: 40px; }
.header { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; }
.invoice-title { font-size:32px; font-weight:bold; }
.invoice-number { font-size:18px; color:#2563eb; font-weight:bold; }
.company-info { text-align:right; }
.bill-to { margin:20px 0; }
.dates { display:flex; justify-content:space-between; margin:20px 0; gap:16px; }
.items-table { width:100%; border-collapse:collapse; margin:20px 0; }
.items-table th, .items-table td { border:1px solid #ddd; padding:12px; text-align:left; }
.items-table th { background-color:#f5f5f5; }
.totals { margin-left:auto; width:300px; }
.total-row { display:flex; justify-content:space-between; padding:5px 0; }
.total-final { font-weight:bold; font-size:18px; border-top:2px solid #000; padding-top:10px; }
.notes { margin-top:30px; }
</style>
</head><body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">#${invoiceData.invoiceNumber}</div>
    </div>
    <div class="company-info">
      <h2>Bridgeocean Limited</h2>
      <p>Premium Charter Services</p>
    </div>
  </div>

  <div class="bill-to"><h3>Bill To:</h3><p style="font-size:18px;">${invoiceData.customerName}</p></div>

  <div class="dates">
    <div><strong>Service Date:</strong> ${invoiceData.serviceDate}</div>
    <div><strong>Due Date:</strong> ${invoiceData.dueDate}</div>
    <div><strong>Balance Due:</strong> ${formatCurrency(invoiceData.balanceDue)}</div>
  </div>

  <table class="items-table">
    <thead><tr><th>Item</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody><tr>
      <td>${invoiceData.vehicle} (${invoiceData.duration})</td>
      <td>${invoiceData.quantity}</td>
      <td>${formatCurrency(invoiceData.rate)}</td>
      <td>${formatCurrency(invoiceData.subtotal)}</td>
    </tr></tbody>
  </table>

  <div class="totals">
    <div class="total-row"><span>Subtotal:</span><span>${formatCurrency(invoiceData.subtotal)}</span></div>
    ${invoiceData.vat > 0
      ? `<div class="total-row"><span>VAT (7.5%):</span><span>${formatCurrency(invoiceData.vat)}</span></div>`
      : ``}
    <div class="total-row total-final"><span>Total:</span><span>${formatCurrency(invoiceData.total)}</span></div>
    <div class="total-row"><span>Amount Paid:</span><span>${formatCurrency(invoiceData.amountPaid)}</span></div>
    <div class="total-row total-final"><span>Balance Due:</span><span>${formatCurrency(invoiceData.balanceDue)}</span></div>
  </div>

  <div class="notes"><h4>Notes:</h4><p>${invoiceData.notes}</p></div>
  <div class="notes"><h4>Terms:</h4><p>${invoiceData.terms}</p></div>
</body></html>`;
                    await generatePDF(htmlContent, `Invoice-${invoiceData.invoiceNumber}-Bridgeocean.pdf`);
                    toast({ title: "Invoice downloaded", description: `#${invoiceData.invoiceNumber}` });
                  } catch (e: any) {
                    toast({
                      title: "PDF generation issue",
                      description: e?.message || "Fell back to HTML",
                      variant: "destructive",
                    });
                  } finally {
                    setIsGeneratingPDF(false);
                  }
                }}
                disabled={isGeneratingPDF}
                className="flex-1"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice (PDF)
                  </>
                )}
              </Button>

              <Button
                onClick={async () => {
                  if (!receiptData) return;
                  setIsGeneratingReceipt(true);
                  try {
                    const receiptContent = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Receipt ${receiptData.transactionId}</title>
<style>
body { font-family: 'Courier New', monospace; margin: 40px; background:#f9f9f9; display:flex; justify-content:center; align-items:center; min-height:100vh; }
.receipt { background:white; padding:30px; border:2px solid #000; max-width:400px; text-align:center; box-shadow:0 4px 8px rgba(0,0,0,0.1); }
.company { font-size:18px; font-weight:bold; margin-bottom:10px; text-transform:uppercase; }
.datetime { font-size:14px; margin-bottom:15px; }
.block { text-align:left; margin:20px 0; font-size:14px; }
.line { display:flex; justify-content:space-between; margin:5px 0; }
.total { font-weight:bold; border-top:1px solid #000; padding-top:5px; margin-top:10px; }
.footer { margin-top:20px; font-size:12px; }
.brand { margin-top:15px; font-size:14px; font-weight:bold; }
</style></head>
<body>
  <div class="receipt">
    <div class="company">BRIDGEOCEAN LIMITED</div>
    <div class="datetime">${receiptData.timestamp}</div>

    <div class="block">
      <div>TRANS ${receiptData.transactionId}</div>
      <div>MCC ${receiptData.mccCode}</div>
      <div>PAYMENT - ${receiptData.paymentMethod}</div>
    </div>

    <div class="block">
      <div class="line"><span>SUBTOTAL:</span><span>₦${receiptData.subtotal.toLocaleString()}.00</span></div>
      <div class="line"><span>SERVICE:</span><span>₦${receiptData.serviceCharge.toLocaleString()}.00</span></div>
      <div class="line total"><span>TOTAL:</span><span>₦${receiptData.total.toLocaleString()}.00</span></div>
    </div>

    <div class="footer">
      <div>PLEASE COME AGAIN</div>
      <div>THANK YOU</div>
    </div>
    <div class="brand">...........BRIDGEOCEAN LIMITED...........</div>
  </div>
</body></html>`;
                    await generatePDF(receiptContent, `Receipt-${receiptData.transactionId}-Bridgeocean.pdf`);
                    toast({ title: "Receipt downloaded", description: `#${receiptData.transactionId}` });
                  } catch (e: any) {
                    toast({
                      title: "PDF generation issue",
                      description: e?.message || "Fell back to HTML",
                      variant: "destructive",
                    });
                  } finally {
                    setIsGeneratingReceipt(false);
                  }
                }}
                disabled={isGeneratingReceipt}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                {isGeneratingReceipt ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF…
                  </>
                ) : (
                  <>
                    <Receipt className="mr-2 h-4 w-4" />
                    Download Receipt (PDF)
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (!invoiceData || !receiptData) return;
                  const text =
                    activeView === "invoice"
                      ? `Invoice #${invoiceData.invoiceNumber}\nCustomer: ${invoiceData.customerName}\nService: ${invoiceData.vehicle}\nTotal: ${formatCurrency(invoiceData.total)}\nBalance Due: ${formatCurrency(invoiceData.balanceDue)}`
                      : `Receipt ${receiptData.transactionId}\nCustomer: ${receiptData.customerName}\nAmount: ₦${receiptData.total.toLocaleString()}\nPayment: ${receiptData.paymentMethod}`;
                  navigator.clipboard.writeText(text);
                  toast({
                    title: "Copied to clipboard",
                    description: `${activeView === "invoice" ? "Invoice" : "Receipt"} details copied`,
                  });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
