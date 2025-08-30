"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Loader2, Copy, Brain, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  serviceDate: string;
  dueDate: string;
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

/* ---------- Defaults ---------- */

const BRIDGEOCEAN_BANK_DETAILS = `Zenith Bank Account (preferred)
Zenith Account number: 1229647858
Bridgeocean Limited

Moniepoint Account details
Moniepoint Account number: 8135261568
Bridgeocean Limited`;

/* text normalizer for de-duplication */
const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

/* ---------- Component ---------- */

export function AIInvoiceGenerator() {
  const [whatsappChat, setWhatsappChat] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingInvoiceHTML, setIsGeneratingInvoiceHTML] = useState(false);
  const [isGeneratingReceiptHTML, setIsGeneratingReceiptHTML] = useState(false);
  const [activeView, setActiveView] = useState<"invoice" | "receipt">("invoice");
  const [includeVAT, setIncludeVAT] = useState(false);
  const { toast } = useToast();

  /* Only export what the user actually typed */
  const [notesInput, setNotesInput] = useState<string>("");     // user notes
  const [termsInput, setTermsInput] = useState<string>("");     // user terms
  const [autoInsertBank, setAutoInsertBank] = useState<boolean>(true);

  const effectiveTerms = (autoInsertBank && !termsInput.trim())
    ? BRIDGEOCEAN_BANK_DETAILS
    : termsInput.trim();

  /* data URL for the logo in downloaded HTML */
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  useEffect(() => {
    const loadLogoAsDataURL = async (path: string) => {
      try {
        const res = await fetch(path, { cache: "force-cache" });
        if (!res.ok) return;
        const blob = await res.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        setLogoDataUrl(dataUrl);
      } catch {}
    };
    loadLogoAsDataURL("/images/bridgeocean-logo.jpg");
  }, []);

  const downloadHTMLFile = (html: string, filename: string) => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const generateReceiptData = (invoice: InvoiceData): ReceiptData => {
    const now = new Date();
    const timestamp =
      now.toLocaleDateString("en-GB") +
      " " +
      now.toLocaleTimeString("en-GB", { hour12: false, hour: "2-digit", minute: "2-digit" });

    const transactionId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const mccCode = "4121" + Math.random().toString(36).substring(2, 6).toUpperCase();

    const total = Number(invoice.total ?? 0);
    const safeTotal = isFinite(total) ? Math.max(0, total) : 0;

    return {
      transactionId,
      mccCode,
      paymentMethod: "Bank Transfer",
      subtotal: safeTotal,
      serviceCharge: 0,
      total: safeTotal,
      timestamp,
      customerName: invoice.customerName,
    };
  };

  /* -------- Hybrid extractor (unchanged logic) -------- */
  const hybridExtraction = (chat: string) => {
    const lower = chat.toLowerCase();

    type Amt = { value: number; index: number; ctx: string };
    const amounts: Amt[] = [];
    const pushAmount = (value: number, index: number) => {
      if (!Number.isFinite(value) || value < 1000) return;
      const ctx = chat.slice(Math.max(0, index - 80), Math.min(chat.length, index + 80)).toLowerCase();
      amounts.push({ value: Math.round(value), index, ctx });
    };
    const parseAmount = (numRaw: string, unitRaw?: string) => {
      const n = parseFloat(numRaw.replace(/,/g, ""));
      if (!Number.isFinite(n)) return NaN;
      const unit = (unitRaw || "").toLowerCase();
      if (unit === "million" || unit === "m") return n * 1_000_000;
      if (unit === "thousand" || unit === "k") return n * 1_000;
      return n;
    };

    let m: RegExpExecArray | null;
    let re1 = /(₦|ngn|(?<![a-z])n)\s*([\d.,]+)\s*(million|m|thousand|k)?/gi;
    while ((m = re1.exec(chat)) !== null) pushAmount(parseAmount(m[2], m[3]), m.index);
    let re2 = /([\d.,]+)\s*(million|m|thousand|k)\b/gi;
    while ((m = re2.exec(chat)) !== null) pushAmount(parseAmount(m[1], m[2]), m.index);
    let re3 = /(\d{1,3}(?:,\d{3})+)(?!\S)/g;
    while ((m = re3.exec(chat)) !== null) pushAmount(parseAmount(m[1]), m.index);

    const names: string[] = [];
    const nameRes = [
      /mr\.?\s+([a-z][a-z\s]+)/gi,
      /mrs\.?\s+([a-z][a-z\s]+)/gi,
      /ms\.?\s+([a-z][a-z\s]+)/gi,
      /my name is\s+([a-z][a-z\s]+)/gi,
      /i'?m\s+([a-z][a-z\s]+)/gi,
      /this is\s+([a-z][a-z\s]+)/gi,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g,
    ];
    for (const rx of nameRes) {
      let nm: RegExpExecArray | null;
      while ((nm = rx.exec(chat)) !== null) {
        const name = nm[1].trim();
        if (name.length > 2) names.push(name);
      }
    }
    const customerName = names[0] || "Valued Customer";

    const today = new Date();
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let serviceDate = new Date(today);
    let foundDate = false;

    if (lower.includes("tomorrow")) {
      serviceDate.setDate(today.getDate() + 1);
      foundDate = true;
    }
    if (lower.includes("today")) foundDate = true;

    if (!foundDate) {
      for (const d of dayNames) {
        if (lower.includes(d)) {
          const target = dayNames.indexOf(d);
          const diff = (target - today.getDay() + 7) % 7 || 7;
          serviceDate.setDate(today.getDate() + diff);
          foundDate = true;
          break;
        }
      }
    }
    const serviceDateStr = serviceDate.toLocaleDateString("en-GB");

    let duration = "Full day service";
    const durHours = chat.match(/(\d+)\s*hours?/i);
    const durDaysNum = chat.match(/(\d+)\s*days?/i);
    const twoDay = /two[-\s]?day/i.test(chat);
    if (durHours) duration = `${durHours[1]} hours`;
    else if (durDaysNum) duration = `${durDaysNum[1]} days`;
    else if (twoDay) duration = "2 days";

    let servicePrice = 0;
    const closing = /(agree|deal|final|new total|close the deal|secure|bringing|reduce|price|rate|cost|total)/i;
    for (const a of amounts) if (closing.test(a.ctx)) servicePrice = a.value;
    if (!servicePrice && amounts.length) servicePrice = Math.max(...amounts.map((a) => a.value));

    let amountPaid = 0;
    const payAny =
      /(paid|pay(?:ing)?|transfer(?:red)?|deposit|upfront|advance|part\s*payment|sent|sending|proof|receipt)/i;
    for (const a of amounts) if (payAny.test(a.ctx)) amountPaid = a.value;

    if (!amountPaid && /50%|half|fifty percent/i.test(lower) && servicePrice) {
      amountPaid = Math.round(servicePrice * 0.5);
    } else if (!amountPaid && /(deposit|upfront|advance|part\s*payment)/i.test(lower) && amounts.length >= 2) {
      amountPaid = Math.min(...amounts.map((a) => a.value));
    } else if (!amountPaid && /full\s*(?:amount|payment)/i.test(lower)) {
      amountPaid = servicePrice;
    }

    let vehicleType = "Charter Service";
    if (/gmc|terrain/i.test(chat)) vehicleType = "GMC Terrain Charter Service";
    if (/toyota|camry/i.test(chat)) vehicleType = "Toyota Camry Charter Service";
    if (/yacht|elegance/i.test(chat)) vehicleType = "Elegance Yacht Charter";

    (window as any).__invoice_debug = { amounts, servicePrice, amountPaid };

    return {
      customerName,
      servicePrice,
      amountPaid,
      vehicleType,
      serviceDate: serviceDateStr,
      duration,
    };
  };

  const extractInvoiceData = async (chat: string): Promise<InvoiceData> => {
    const ex = hybridExtraction(chat);

    let notes = "Professional charter service with driver and fuel included.";
    let finalRate = ex.servicePrice;

    if (!finalRate || finalRate < 1000) {
      const lower = (ex.vehicleType || "").toLowerCase();
      if (lower.includes("gmc")) finalRate = 200000;
      else if (lower.includes("camry") || lower.includes("toyota")) finalRate = 100000;
      else finalRate = 100000;
    }

    if (/first time|first timer/i.test(chat)) {
      notes = "First timer discount applied. Professional charter service with driver and fuel included.";
      finalRate = Math.round(finalRate * 0.9);
    }
    if (/emergency/i.test(chat)) {
      notes = "Emergency response service with immediate dispatch.";
      finalRate = Math.round(finalRate * 1.2);
    }

    const quantity = 1;
    const subtotal = finalRate * quantity;
    const vat = includeVAT ? Math.round(subtotal * 0.075) : 0;
    const total = subtotal + vat;
    const balanceDue = total - (ex.amountPaid || 0);

    const serviceDateObj = new Date(ex.serviceDate.split("/").reverse().join("-"));
    const dueDate = new Date(serviceDateObj);
    dueDate.setDate(serviceDateObj.getDate() + 1);

    const invoiceNumber = `INV${String(Date.now()).slice(-3)}-BO`;

    return {
      invoiceNumber,
      customerName: ex.customerName,
      serviceDate: ex.serviceDate,
      dueDate: dueDate.toLocaleDateString("en-GB"),
      vehicle: ex.vehicleType,
      duration: ex.duration || "Full day service",
      rate: finalRate,
      quantity,
      subtotal,
      vat,
      total,
      amountPaid: ex.amountPaid || 0,
      balanceDue,
      notes,                                   // fallback (we will strip out below)
      terms: "Payment terms as agreed in conversation", // (strip below)
    };
  };

  /* ---------- Actions ---------- */

  const extractInvoiceDataWithAI = async (chat: string) => {
    setIsGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      return await extractInvoiceData(chat);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!whatsappChat.trim()) {
      toast({
        title: "WhatsApp chat required",
        description: "Please paste a WhatsApp conversation to generate an invoice",
        variant: "destructive",
      });
      return;
    }
    try {
      const raw = await extractInvoiceDataWithAI(whatsappChat);

      /* IMPORTANT: store a sanitized invoice in state so no fallback can leak anywhere */
      const clean: InvoiceData = { ...raw, notes: "", terms: "" };
      setInvoiceData(clean);
      setReceiptData(generateReceiptData(clean));

      /* Do NOT prefill notes with fallback. Leave what the user typed (default empty). */
      // setNotesInput(...)  <-- intentionally not prefilling

      toast({ title: "Invoice & Receipt generated", description: "Hybrid extraction completed." });
    } catch {
      toast({
        title: "Error generating invoice",
        description: "Please try again or check the conversation format.",
        variant: "destructive",
      });
    }
  };

  /* ---------- HTML builder (only exports user inputs; with de-dup) ---------- */

  const buildInvoiceHTML = (inv: InvoiceData, htmlTerms: string, htmlNotes: string) => {
    const esc = (s: string) =>
      (s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const termsText = (htmlTerms || "").trim();
    const notesText = (htmlNotes || "").trim();

    const seen = new Set<string>();
    const blocks: Array<{ title: string; text: string }> = [];
    if (termsText && !seen.has(norm(termsText))) {
      seen.add(norm(termsText));
      blocks.push({ title: "Terms & Payment details", text: termsText });
    }
    if (notesText && !seen.has(norm(notesText))) {
      seen.add(norm(notesText));
      blocks.push({ title: "Notes", text: notesText });
    }

    const blocksHTML = blocks
      .map(
        (b) =>
          `<h4>${esc(b.title)}</h4><pre style="white-space:pre-wrap;font-family:inherit;">${esc(b.text)}</pre>`
      )
      .join("\n");

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${esc(inv.invoiceNumber)}</title>
  <meta name="color-scheme" content="light only" />
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #111; background:#fff; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .invoice-title { font-size: 32px; font-weight: bold; }
    .invoice-number { font-size: 18px; color: #2563eb; font-weight: bold; }
    .company-info { text-align: right; }
    .logo { width: 80px; height: 80px; object-fit: contain; display:block; margin-left:auto; }
    .bill-to { margin: 20px 0; }
    .dates { display: flex; justify-content: space-between; margin: 20px 0; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .items-table th { background-color: #f5f5f5; }
    .totals { margin-left: auto; width: 300px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; }
    .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; }
    .notes { margin-top: 30px; }
    .notes h4 { margin: 12px 0 4px; }
    .notes pre { white-space: pre-wrap; font-family: inherit; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">#${esc(inv.invoiceNumber)}</div>
    </div>
    <div class="company-info">
      ${logoDataUrl ? `<img class="logo" src="${logoDataUrl}" alt="Bridgeocean Logo" />` : ``}
      <h2>Bridgeocean Limited</h2>
      <p>Premium Charter Services</p>
    </div>
  </div>

  <div class="bill-to">
    <h3>Bill To:</h3>
    <p style="font-size: 18px;">${esc(inv.customerName)}</p>
  </div>

  <div class="dates">
    <div><strong>Service Date:</strong> ${esc(inv.serviceDate)}</div>
    <div><strong>Due Date:</strong> ${esc(inv.dueDate)}</div>
    <div><strong>Balance Due:</strong> ₦${inv.balanceDue.toLocaleString()}</div>
  </div>

  <table class="items-table">
    <thead>
      <tr><th>Item</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>${esc(inv.vehicle)} (${esc(inv.duration)})</td>
        <td>${inv.quantity}</td>
        <td>₦${inv.rate.toLocaleString()}</td>
        <td>₦${inv.subtotal.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row"><span>Subtotal:</span><span>₦${inv.subtotal.toLocaleString()}</span></div>
    ${inv.vat > 0 ? `<div class="total-row"><span>VAT (7.5%):</span><span>₦${inv.vat.toLocaleString()}</span></div>` : ""}
    <div class="total-row total-final"><span>Total:</span><span>₦${inv.total.toLocaleString()}</span></div>
    <div class="total-row"><span>Amount Paid:</span><span>₦${inv.amountPaid.toLocaleString()}</span></div>
    <div class="total-row total-final"><span>Balance Due:</span><span>₦${inv.balanceDue.toLocaleString()}</span></div>
  </div>

  <div class="notes">
    ${blocksHTML}
  </div>
</body>
</html>`;
  };

  const buildReceiptHTML = (r: ReceiptData) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt ${r.transactionId}</title>
  <meta name="color-scheme" content="light only" />
  <style>
    body { 
      font-family: 'Courier New', monospace; 
      margin: 40px; 
      background-color: #f9f9f9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #111;
    }
    .receipt {
      background: white;
      padding: 30px;
      border: 2px solid #000;
      max-width: 420px;
      text-align: center;
      width: 100%;
    }
    .logo { width: 70px; height: 70px; object-fit: contain; display:block; margin: 0 auto 8px; }
    .company-name { font-size: 18px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
    .datetime { font-size: 14px; margin-bottom: 15px; }
    .transaction-info { text-align: left; margin: 20px 0; font-size: 14px; }
    .amount-line { display: flex; justify-content: space-between; margin: 6px 0; }
    .total-line { font-weight: bold; border-top: 1px solid #000; padding-top: 6px; margin-top: 10px; }
    .footer { margin-top: 20px; font-size: 12px; }
    .company-footer { margin-top: 15px; font-size: 14px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="receipt">
    ${logoDataUrl ? `<img class="logo" src="${logoDataUrl}" alt="Bridgeocean Logo" />` : ``}
    <div class="company-name">BRIDGEOCEAN LIMITED</div>
    <div class="datetime">${r.timestamp}</div>
    
    <div class="transaction-info">
      <div>TRANS ${r.transactionId}</div>
      <div>MCC ${r.mccCode}</div>
      <div>PAYMENT - ${r.paymentMethod}</div>
    </div>

    <div class="transaction-info">
      <div class="amount-line"><span>SUBTOTAL:</span><span>₦${r.subtotal.toLocaleString()}.00</span></div>
      <div class="amount-line"><span>SERVICE:</span><span>₦${r.serviceCharge.toLocaleString()}.00</span></div>
      <div class="amount-line total-line"><span>TOTAL:</span><span>₦${r.total.toLocaleString()}.00</span></div>
    </div>

    <div class="footer">
      <div>PLEASE COME AGAIN</div>
      <div>THANK YOU</div>
    </div>

    <div class="company-footer">...........BRIDGEOCEAN LIMITED...........</div>
  </div>
</body>
</html>`;

  /* ---------- Downloads ---------- */

  const handleDownloadInvoiceHTML = () => {
    if (!invoiceData) return;
    try {
      setIsGeneratingInvoiceHTML(true);

      /* ONLY export typed inputs (never any fallback) */
      const noteForHtml = notesInput.trim();
      const termsForHtml = effectiveTerms;

      const html = buildInvoiceHTML(
        { ...invoiceData, notes: "", terms: "" }, // keep state sanitized
        termsForHtml,
        noteForHtml
      );

      downloadHTMLFile(html, `Invoice-${invoiceData.invoiceNumber}-Bridgeocean.html`);
      toast({ title: "Invoice downloaded (HTML)", description: `#${invoiceData.invoiceNumber}` });
    } catch (e: any) {
      toast({ title: "Download failed", description: e?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setIsGeneratingInvoiceHTML(false);
    }
  };

  const handleDownloadReceiptHTML = () => {
    if (!receiptData) return;
    try {
      setIsGeneratingReceiptHTML(true);
      const html = buildReceiptHTML(receiptData);
      downloadHTMLFile(html, `Receipt-${receiptData.transactionId}-Bridgeocean.html`);
      toast({ title: "Receipt downloaded (HTML)", description: `#${receiptData.transactionId}` });
    } catch (e: any) {
      toast({ title: "Download failed", description: e?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setIsGeneratingReceiptHTML(false);
    }
  };

  /* ---------- UI helpers ---------- */

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  const exampleChats = [
    `Chika: Good afternoon! My name is Chika. How can I assist you today?
Mr. Adebayo: Hi Chika. I need a quote for a two-day charter in Lagos for a corporate event with 20 guests.
Chika: I'd recommend our "Elegance" yacht. The standard two-day charter rate is NGN 3,500,000.
Mr. Adebayo: That's over budget. I'm looking to spend around NGN 2.8 million.
Chika: We can offer a 10% discount → NGN 3,150,000.
Mr. Adebayo: Can you meet us at NGN 2.85 million to close the deal?
Chika: We agree to NGN 2.85 million (yacht + crew, no dinner).
Mr. Adebayo: Great — I'll transfer NGN 1,000,000 now as deposit.`,
    `Customer: Hi, I need to book your GMC Terrain for tomorrow
Bridgeocean: Hello! That's ₦200,000 for 10 hours (minimum). Can you pay 50% now?
Customer: Yes, my name is John Adebayo. I'll pay ₦100,000 now
Bridgeocean: Perfect, booking confirmed`,
    `Customer: Emergency! Need a car now at VI
Bridgeocean: GMC Terrain available, ₦240,000 emergency rate
Customer: That's fine, I'll make full payment
Bridgeocean: Confirmed.`,
  ];

  /* ---------- JSX ---------- */

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Hybrid AI Invoice & Receipt Generator
          </CardTitle>
          <CardDescription>Extracts amounts/names/dates and applies business logic to assign roles.</CardDescription>
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

          <div className="flex items-center space-x-2">
            <Checkbox id="include-vat" checked={includeVAT} onCheckedChange={(v) => setIncludeVAT(!!v)} />
            <label htmlFor="include-vat" className="text-sm font-medium">
              Include 7.5% VAT in calculations
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Example Conversations (Click to Use)</label>
            <div className="grid grid-cols-1 gap-2">
              {exampleChats.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setWhatsappChat(example)}
                  className="text-xs h-auto p-3 text-left justify-start"
                >
                  <div className="truncate">
                    <strong>Example {index + 1}:</strong> {example.split("\n")[0].substring(0, 70)}...
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerateInvoice} className="w-full" disabled={isGenerating || !whatsappChat.trim()}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting…
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

      {invoiceData && receiptData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Documents
            </CardTitle>
            <CardDescription>Preview and download as HTML</CardDescription>

            <div className="flex gap-2 mt-4">
              <Button
                variant={activeView === "invoice" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("invoice")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Invoice Preview
              </Button>
              <Button
                variant={activeView === "receipt" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("receipt")}
              >
                <Receipt className="mr-2 h-4 w-4" />
                Receipt Preview
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {activeView === "invoice" && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src="/images/bridgeocean-logo.jpg"
                      crossOrigin="anonymous"
                      alt="Bridgeocean Logo"
                      className="h-16 w-16 object-contain"
                    />
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

                {/* Preview: show effectiveTerms + your typed notes (no fallback) */}
                {(effectiveTerms || notesInput.trim()) && (
                  <>
                    <Separator />
                    <section className="rounded-md border bg-white p-4">
                      {effectiveTerms && (
                        <>
                          <h4 className="mb-1 text-sm font-semibold">Terms &amp; Payment details</h4>
                          <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-slate-700">
{effectiveTerms}
                          </pre>
                        </>
                      )}
                      {notesInput.trim() && norm(notesInput) !== norm(effectiveTerms) && (
                        <>
                          <h4 className="mt-3 mb-1 text-sm font-semibold">Notes</h4>
                          <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-slate-700">
{notesInput.trim()}
                          </pre>
                        </>
                      )}
                    </section>
                  </>
                )}
              </>
            )}

            {activeView === "receipt" && (
              <>
                <div className="max-w-md mx-auto bg-gray-50 p-6 border-2 border-gray-300 font-mono text-center">
                  <div className="flex flex-col items-center">
                    <img
                      src="/images/bridgeocean-logo.jpg"
                      crossOrigin="anonymous"
                      alt="Bridgeocean Logo"
                      className="h-14 w-14 object-contain mb-2"
                    />
                    <div className="text-lg font-bold mb-2">BRIDGEOCEAN LIMITED</div>
                  </div>
                  <div className="text-sm mb-4">{receiptData.timestamp}</div>

                  <div className="text-left space-y-1 mb-4">
                    <div>TRANS {receiptData.transactionId}</div>
                    <div>MCC {receiptData.mccCode}</div>
                    <div>PAYMENT - {receiptData.paymentMethod}</div>
                  </div>

                  <div className="text-left space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>SUBTOTAL:</span>
                      <span>₦{receiptData.subtotal.toLocaleString()}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SERVICE:</span>
                      <span>₦{receiptData.serviceCharge.toLocaleString()}.00</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-1">
                      <span>TOTAL:</span>
                      <span>₦{receiptData.total.toLocaleString()}.00</span>
                    </div>
                  </div>

                  <div className="text-sm space-y-1 mb-4">
                    <div>PLEASE COME AGAIN</div>
                    <div>THANK YOU</div>
                  </div>

                  <div className="text-sm font-bold">...........BRIDGEOCEAN LIMITED...........</div>
                </div>
              </>
            )}

            {/* Downloads */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  if (!invoiceData) return;
                  setIsGeneratingInvoiceHTML(true);
                  handleDownloadInvoiceHTML();
                }}
                disabled={isGeneratingInvoiceHTML}
                className="flex-1"
              >
                {isGeneratingInvoiceHTML ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Building HTML…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice (HTML)
                  </>
                )}
              </Button>

              <Button
                onClick={() => {
                  if (!receiptData) return;
                  setIsGeneratingReceiptHTML(true);
                  handleDownloadReceiptHTML();
                }}
                disabled={isGeneratingReceiptHTML}
                variant="outline"
                className="flex-1"
              >
                {isGeneratingReceiptHTML ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Building HTML…
                  </>
                ) : (
                  <>
                    <Receipt className="mr-2 h-4 w-4" />
                    Download Receipt (HTML)
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (!invoiceData || !receiptData) return;
                  const text =
                    activeView === "invoice"
                      ? `Invoice #${invoiceData.invoiceNumber}
Customer: ${invoiceData.customerName}
Service: ${invoiceData.vehicle}
Total: ${formatCurrency(invoiceData.total)}
Balance Due: ${formatCurrency(invoiceData.balanceDue)}`
                      : `Receipt ${receiptData.transactionId}
Customer: ${receiptData.customerName}
Amount: ₦${receiptData.total.toLocaleString()}
Payment: ${receiptData.paymentMethod}`;
                  navigator.clipboard.writeText(text);
                  toast({
                    title: "Copied to clipboard",
                    description: `${activeView === "invoice" ? "Invoice" : "Receipt"} details copied.`,
                  });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Editor */}
            <section className="rounded-lg border p-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Notes &amp; Terms / Payment details</h3>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="auto-insert-bank"
                    checked={autoInsertBank}
                    onCheckedChange={(v) => setAutoInsertBank(!!v)}
                  />
                  <label htmlFor="auto-insert-bank" className="text-sm">
                    Auto-insert Bridgeocean bank details
                  </label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Any relevant information not already covered…"
                    rows={6}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Terms &amp; Payment details</label>
                  <Textarea
                    placeholder="Payment terms / bank details…"
                    rows={6}
                    value={termsInput}
                    onChange={(e) => setTermsInput(e.target.value)}
                  />
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTermsInput(BRIDGEOCEAN_BANK_DETAILS)}
                    >
                      Reset to Bridgeocean bank details
                    </Button>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Included at the bottom of the invoice preview and in the downloaded HTML.
              </p>
            </section>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
