"use client";

import { useState } from "react";
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

export function AIInvoiceGenerator() {
  const [whatsappChat, setWhatsappChat] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const [activeView, setActiveView] = useState<"invoice" | "receipt">("invoice");
  const [includeVAT, setIncludeVAT] = useState(false);
  const { toast } = useToast();

  // ---------- Optional AI merge ----------
  async function tryGemini(chat: string) {
    try {
      const res = await fetch("/api/ai-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat }),
      });
      const json = await res.json();
      return json?.success ? (json.data as Partial<InvoiceLike>) : null;
    } catch {
      return null;
    }
  }

  type InvoiceLike = {
    customerName?: string;
    vehicleType?: string;
    servicePrice?: number;
    amountPaid?: number;
    serviceDate?: string;
    duration?: string;
    isEmergency?: boolean;
    isFirstTimer?: boolean;
  };

  // ---------- Receipt helper (clamp) ----------
  const generateReceiptData = (invoice: InvoiceData): ReceiptData => {
    const now = new Date();
    const timestamp =
      now.toLocaleDateString("en-GB") +
      " " +
      now.toLocaleTimeString("en-GB", { hour12: false, hour: "2-digit", minute: "2-digit" });

    const transactionId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const mccCode = "4121" + Math.random().toString(36).substring(2, 6).toUpperCase();

    const paidRaw = Number(invoice.amountPaid ?? 0);
    const total = Number(invoice.total ?? 0);
    const paid = Math.max(0, Math.min(isFinite(total) ? total : Number.MAX_SAFE_INTEGER, isFinite(paidRaw) ? paidRaw : 0));

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

  // ---------- Hybrid extractor ----------
  const hybridExtraction = (chat: string): InvoiceLike => {
    const lower = chat.toLowerCase();

    type Amt = { value: number; index: number; ctx: string };
    const amounts: Amt[] = [];

    function pushAmount(value: number, index: number) {
      if (!Number.isFinite(value) || value < 1000) return;
      const ctx = chat.slice(Math.max(0, index - 80), Math.min(chat.length, index + 80)).toLowerCase();
      amounts.push({ value: Math.round(value), index, ctx });
    }

    function parseAmount(numRaw: string, unitRaw?: string) {
      const n = parseFloat(numRaw.replace(/,/g, ""));
      if (!Number.isFinite(n)) return NaN;
      const unit = (unitRaw || "").toLowerCase();
      if (unit === "million" || unit === "m") return n * 1_000_000;
      if (unit === "thousand" || unit === "k") return n * 1_000;
      return n;
    }

    // ₦ / NGN / N + number + optional unit
    let m: RegExpExecArray | null;
    let re1 = /(₦|ngn|(?<![a-z])n)\s*([\d.,]+)\s*(million|m|thousand|k)?/gi;
    while ((m = re1.exec(chat)) !== null) pushAmount(parseAmount(m[2], m[3]), m.index);

    // number + unit (2.85 million, 250k)
    let re2 = /([\d.,]+)\s*(million|m|thousand|k)\b/gi;
    while ((m = re2.exec(chat)) !== null) pushAmount(parseAmount(m[1], m[2]), m.index);

    // big comma numbers like 3,150,000
    let re3 = /(\d{1,3}(?:,\d{3})+)(?!\S)/g;
    while ((m = re3.exec(chat)) !== null) pushAmount(parseAmount(m[1]), m.index);

    // Names
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

    // Date (today/tomorrow/weekday)
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

    // Duration
    let duration = "Full day service";
    const durHours = chat.match(/(\d+)\s*hours?/i);
    const durDaysNum = chat.match(/(\d+)\s*days?/i);
    const twoDay = /two[-\s]?day/i.test(chat);
    if (durHours) duration = `${durHours[1]} hours`;
    else if (durDaysNum) duration = `${durDaysNum[1]} days`;
    else if (twoDay) duration = `2 days`;

    // Choose final service price: prefer last amount near closing words
    let servicePrice = 0;
    const closing = /(agree|deal|final|new total|close the deal|secure|bringing|reduce|price|rate|cost|total)/i;
    for (const a of amounts) if (closing.test(a.ctx)) servicePrice = a.value; // keep last
    if (!servicePrice && amounts.length) servicePrice = Math.max(...amounts.map((a) => a.value));

    // Amount paid: prefer last amount near pay words
    let amountPaid = 0;
    const payAny =
      /(paid|pay(?:ing)?|transfer(?:red)?|deposit|upfront|advance|part\s*payment|sent|sending|proof|receipt)/i;
    for (const a of amounts) if (payAny.test(a.ctx)) amountPaid = a.value;

    // Fallback inference
    if (!amountPaid && /50%|half|fifty percent/i.test(lower) && servicePrice) {
      amountPaid = Math.round(servicePrice * 0.5);
    } else if (!amountPaid && /(deposit|upfront|advance|part\s*payment)/i.test(lower) && amounts.length >= 2) {
      amountPaid = Math.min(...amounts.map((a) => a.value));
    } else if (!amountPaid && /full\s*(?:amount|payment)/i.test(lower)) {
      amountPaid = servicePrice;
    }

    // Vehicle guess
    let vehicleType = "Charter Service";
    if (/gmc|terrain/i.test(chat)) vehicleType = "GMC Terrain Charter Service";
    if (/toyota|camry/i.test(chat)) vehicleType = "Toyota Camry Charter Service";
    if (/yacht|elegance/i.test(chat)) vehicleType = "Elegance Yacht Charter";

    // @ts-ignore small debug hook
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

  // ---------- Build invoice (hybrid + optional AI merge) ----------
  const extractInvoiceData = async (chat: string): Promise<InvoiceData> => {
    const exHybrid = hybridExtraction(chat);
    const exAI = await tryGemini(chat);
    const ex: InvoiceLike = { ...exHybrid, ...(exAI || {}) };

    // business rules
    let notes = "Professional charter service with driver and fuel included.";
    let finalRate = Number(ex.servicePrice || 0);

    // fallback price by SKU only if extractor missed
    if (!finalRate || finalRate < 1000) {
      const lower = (ex.vehicleType || "").toLowerCase();
      if (lower.includes("gmc")) finalRate = 200000;
      else if (lower.includes("camry") || lower.includes("toyota")) finalRate = 100000;
      else finalRate = 100000;
    }

    if (/first time|first timer/i.test(chat) || ex.isFirstTimer) {
      notes = "First timer discount applied. Professional charter service with driver and fuel included.";
      finalRate = Math.round(finalRate * 0.9);
    }
    if (/emergency/i.test(chat) || ex.isEmergency) {
      notes = "Emergency response service with immediate dispatch.";
      finalRate = Math.round(finalRate * 1.2);
    }

    const quantity = 1;
    const subtotal = finalRate * quantity;
    const vat = includeVAT ? Math.round(subtotal * 0.075) : 0;
    const total = subtotal + vat;
    const amountPaid = Number(ex.amountPaid || 0);
    const balanceDue = total - amountPaid;

    const serviceDateStr = ex.serviceDate || new Date().toLocaleDateString("en-GB");
    const serviceDateObj = new Date(serviceDateStr.split("/").reverse().join("-"));
    const dueDate = new Date(serviceDateObj);
    dueDate.setDate(serviceDateObj.getDate() + 1);

    const invoiceNumber = `INV${String(Date.now()).slice(-3)}-BO`;

    return {
      invoiceNumber,
      customerName: ex.customerName || "Valued Customer",
      serviceDate: serviceDateStr,
      dueDate: dueDate.toLocaleDateString("en-GB"),
      vehicle: ex.vehicleType || "Charter Service",
      duration: ex.duration || "Full day service",
      rate: finalRate,
      quantity,
      subtotal,
      vat,
      total,
      amountPaid,
      balanceDue,
      notes,
      terms: "Payment terms as agreed in conversation",
    };
  };

  // ---------- Robust PDF generation (hidden iframe + bundled build) ----------
  let _html2pdfBundle: any | null = null;
  async function ensureHtml2pdf() {
    if (!_html2pdfBundle) {
      const mod = await import("html2pdf.js/dist/html2pdf.bundle.min.js");
      // @ts-ignore
      _html2pdfBundle = mod?.default ?? (window as any).html2pdf;
    }
    return _html2pdfBundle;
  }

  async function waitForAssetsIn(doc: Document) {
    try {
      // @ts-ignore
      await doc.fonts?.ready;
    } catch {}
    const imgs = Array.from(doc.images) as HTMLImageElement[];
    await Promise.all(
      imgs.map((img) => {
        try {
          if (!img.crossOrigin) img.crossOrigin = "anonymous";
        } catch {}
        return img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.addEventListener("load", res, { once: true });
              img.addEventListener("error", res, { once: true });
            });
      })
    );
  }

  const generatePDF = async (htmlContent: string, filename: string) => {
    // render into a hidden iframe (prevents offscreen/viewport issues)
    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    document.body.appendChild(frame);

    try {
      const doc = frame.contentDocument!;
      doc.open();
      doc.write(htmlContent);
      doc.close();

      await waitForAssetsIn(doc);

      const html2pdf = await ensureHtml2pdf();
      const root = doc.body;

      const opts = {
        margin: 10,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          windowWidth: root.scrollWidth || 794,
          windowHeight: root.scrollHeight || 1123,
        },
        jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
      };

      await html2pdf().set(opts).from(root).toPdf().get("pdf").then((pdf: any) => pdf.save(filename));
    } catch (err) {
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
      frame.remove();
    }
  };

  // ---------- Actions ----------
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
      const data = await extractInvoiceDataWithAI(whatsappChat);
      setInvoiceData(data);
      setReceiptData(generateReceiptData(data));
      toast({ title: "Invoice & Receipt generated", description: "Extraction completed." });
    } catch (e) {
      toast({
        title: "Error generating invoice",
        description: "Please try again or check the conversation format.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadInvoice = async () => {
    if (!invoiceData) return;
    setIsGeneratingPDF(true);
    try {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoiceData.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .invoice-title { font-size: 32px; font-weight: bold; }
    .invoice-number { font-size: 18px; color: #2563eb; font-weight: bold; }
    .company-info { text-align: right; }
    .bill-to { margin: 20px 0; }
    .dates { display: flex; justify-content: space-between; margin: 20px 0; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .items-table th { background-color: #f5f5f5; }
    .totals { margin-left: auto; width: 300px; }
    .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
    .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; }
    .notes { margin-top: 30px; }
  </style>
</head>
<body>
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

  <div class="bill-to">
    <h3>Bill To:</h3>
    <p style="font-size: 18px;">${invoiceData.customerName}</p>
  </div>

  <div class="dates">
    <div><strong>Service Date:</strong> ${invoiceData.serviceDate}</div>
    <div><strong>Due Date:</strong> ${invoiceData.dueDate}</div>
    <div><strong>Balance Due:</strong> ₦${invoiceData.balanceDue.toLocaleString()}</div>
  </div>

  <table class="items-table">
    <thead>
      <tr><th>Item</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>${invoiceData.vehicle} (${invoiceData.duration})</td>
        <td>${invoiceData.quantity}</td>
        <td>₦${invoiceData.rate.toLocaleString()}</td>
        <td>₦${invoiceData.subtotal.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row"><span>Subtotal:</span><span>₦${invoiceData.subtotal.toLocaleString()}</span></div>
    ${invoiceData.vat > 0 ? `<div class="total-row"><span>VAT (7.5%):</span><span>₦${invoiceData.vat.toLocaleString()}</span></div>` : ""}
    <div class="total-row total-final"><span>Total:</span><span>₦${invoiceData.total.toLocaleString()}</span></div>
    <div class="total-row"><span>Amount Paid:</span><span>₦${invoiceData.amountPaid.toLocaleString()}</span></div>
    <div class="total-row total-final"><span>Balance Due:</span><span>₦${invoiceData.balanceDue.toLocaleString()}</span></div>
  </div>

  <div class="notes">
    <h4>Notes:</h4>
    <p>${invoiceData.notes}</p>
    <h4>Terms:</h4>
    <p>${invoiceData.terms}</p>
  </div>
</body>
</html>`;
      await generatePDF(htmlContent, `Invoice-${invoiceData.invoiceNumber}-Bridgeocean.pdf`);
      toast({ title: "Invoice downloaded", description: `#${invoiceData.invoiceNumber}` });
    } catch (error: any) {
      toast({
        title: "PDF generation failed",
        description: error?.message ?? "Downloaded as HTML instead",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!receiptData) return;
    setIsGeneratingReceipt(true);
    try {
      const receiptContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt ${receiptData.transactionId}</title>
  <style>
    body { font-family: 'Courier New', monospace; margin: 40px; background-color: #f9f9f9;
           display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .receipt { background: white;
