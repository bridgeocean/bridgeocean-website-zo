"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Loader2, Copy, Brain, Receipt, CheckCircle, Zap, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ----------------------- PDF helpers (ADD THESE) ----------------------- */

// cache the dynamic import so we don't reload the bundle each click
let _html2pdfPromise: Promise<any> | null = null;

async function loadHtml2pdf() {
  // bundled build includes html2canvas + jsPDF
  if (!_html2pdfPromise) {
    _html2pdfPromise = import("html2pdf.js/dist/html2pdf.bundle.min.js");
  }
  const mod = await _html2pdfPromise;
  return (mod?.default ?? (globalThis as any).html2pdf) as any;
}

async function waitForAssets(root: HTMLElement) {
  // wait for fonts
  try {
    await (document as any).fonts?.ready;
  } catch {}
  // wait for images (and set crossOrigin to avoid tainting)
  const imgs = Array.from(root.querySelectorAll("img")) as HTMLImageElement[];
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

function isIOSorSafari() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  return isIOS || isSafari;
}

// Robust PDF generator (REPLACES your old generatePDF)
const generatePDF = async (htmlContent: string, filename: string) => {
  // off-screen host (not display:none so layout paints)
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-99999px";
  host.style.top = "0";
  host.style.width = "794px"; // ~A4 width at 96dpi
  host.style.zIndex = "-1";
  host.innerHTML = htmlContent;
  document.body.appendChild(host);

  try {
    const html2pdf = await loadHtml2pdf();
    await waitForAssets(host);

    const opts = {
      margin: 10, // mm (because unit below is "mm")
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
      // more reliable path on Safari/iOS
      await html2pdf().set(opts).from(host).toPdf().save();
    } else {
      await html2pdf().set(opts).from(host).save();
    }
  } catch (err) {
    // graceful fallback: download HTML instead of failing silently
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
};

/* ----------------------- Your component code ----------------------- */

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

  // Generate Receipt Data from Invoice
  const generateReceiptData = (invoice: InvoiceData): ReceiptData => {
    const now = new Date();
    const timestamp =
      now.toLocaleDateString("en-GB") +
      " " +
      now.toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

    const transactionId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const mccCode = "4121" + Math.random().toString(36).substring(2, 6).toUpperCase();

    return {
      transactionId,
      mccCode,
      paymentMethod: "Bank Transfer",
      subtotal: invoice.amountPaid,
      serviceCharge: 0,
      total: invoice.amountPaid,
      timestamp,
      customerName: invoice.customerName,
    };
  };

  // AI-powered extraction using Google Gemini (server route)
  const aiExtraction = async (chat: string) => {
    try {
      const response = await fetch("/api/ai-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat }),
      });

      const result = await response.json();

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
          serviceDate: result.data.serviceDate || new Date().toLocaleDateString("en-GB"),
          duration: result.data.duration || "Full day service",
          isEmergency: result.data.isEmergency || false,
          isFirstTimer: result.data.isFirstTimer || false,
          source: result.source || "AI",
        };
      } else {
        throw new Error(result.error || "AI extraction failed");
      }
    } catch (error) {
      console.error("AI extraction error:", error);
      throw new Error("AI service unavailable");
    }
  };

  // HYBRID APPROACH
  const hybridExtraction = (chat: string) => {
    const lowerChat = chat.toLowerCase();

    // 1) Money
    const allAmounts: number[] = [];
    const amountPatterns = [/₦\s*(\d+(?:,\d+)*)/g, /(\d+(?:,\d+)*)\s*naira/gi, /(\d+(?:,\d+)*)\s*thousand/gi];
    amountPatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(chat)) !== null) {
        let amount = Number.parseInt(match[1].replace(/,/g, ""));
        if (pattern.source.includes("thousand")) amount *= 1000;
        if (amount >= 1000) allAmounts.push(amount);
      }
    });

    // 2) Names
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
    namePatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(chat)) !== null) {
        const name = match[1].trim();
        if (name.length > 2 && !["Good Morning", "Thank You", "Bridge Ocean", "Ada Eze"].includes(name)) {
          allNames.push(name);
        }
      }
    });

    // 3) Dates
    const dateKeywords: Record<string, number | null> = {
      today: 0,
      tomorrow: 1,
      saturday: null,
      sunday: null,
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
    };
    const serviceDate = new Date();
    let foundDate = false;
    Object.entries(dateKeywords).forEach(([keyword, offset]) => {
      if (lowerChat.includes(keyword)) {
        if (offset !== null) {
          serviceDate.setDate(serviceDate.getDate() + offset);
        } else {
          const today = new Date();
          const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
          const targetDay = dayNames.indexOf(keyword);
          const currentDay = today.getDay();
          const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7;
          serviceDate.setDate(today.getDate() + daysUntilTarget);
        }
        foundDate = true;
      }
    });
    const specificDatePatterns = [/(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?/gi, /(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)/gi];
    specificDatePatterns.forEach((pattern) => {
      const match = chat.match(pattern);
      if (match && !foundDate) foundDate = true;
    });

    // 4) Vehicle
    let vehicleType = "Charter Service";
    let vehicleRate = 100000;
    Object.entries(bridgeoceanKnowledge.vehicles).forEach(([key, info]) => {
      if (lowerChat.includes(key)) {
        vehicleType = info.name;
        vehicleRate = info.rate;
      }
    });

    // 5) Roles
    const customerName = allNames.length > 0 ? allNames[0] : "Valued Customer";
    const servicePrice = allAmounts.length > 0 ? Math.max(...allAmounts) : vehicleRate;

    // Payment inference
    let amountPaid = 0;
    const paymentKeywords = ["pay", "transfer", "payment", "upfront", "deposit"];
    const halfPaymentKeywords = ["half", "50%", "fifty percent"];
    if (halfPaymentKeywords.some((k) => lowerChat.includes(k))) {
      amountPaid = Math.round(servicePrice * 0.5);
    } else if (paymentKeywords.some((k) => lowerChat.includes(k))) {
      if (allAmounts.length >= 2) amountPaid = Math.min(...allAmounts);
      else amountPaid = servicePrice;
    }
    if (lowerChat.includes("full amount") || lowerChat.includes("complete payment")) amountPaid = servicePrice;

    return {
      customerName,
      servicePrice,
      amountPaid,
      vehicleType,
      serviceDate: serviceDate.toLocaleDateString("en-GB"),
      allAmounts,
      allNames,
    };
  };

  // Enhanced AI function using hybrid approach
  const extractInvoiceDataWithAI = async (chat: string): Promise<InvoiceData> => {
    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let extracted: any;

      try {
        extracted = await aiExtraction(chat);
        setAiSource(extracted.source);
        toast({ title: "✅ AI Extraction Successful", description: `${extracted.source} analyzed your conversation` });
      } catch (aiError) {
        const hybridResult = hybridExtraction(chat);
        extracted = {
          customerName: hybridResult.customerName,
          servicePrice: hybridResult.servicePrice,
          amountPaid: hybridResult.amountPaid,
          vehicleType: hybridResult.vehicleType,
          serviceDate: hybridResult.serviceDate,
          duration: "Full day service",
          isEmergency: false,
          isFirstTimer: false,
          source: "Hybrid Logic",
        };
        setAiSource("Hybrid Logic");
        toast({ title: "⚡ Using Hybrid Extraction", description: "AI unavailable, using smart pattern matching" });
      }

      // Business logic
      let notes = bridgeoceanKnowledge.notes.standard;
      let finalRate = extracted.servicePrice;

      if (extracted.isFirstTimer) {
        notes = bridgeoceanKnowledge.notes.firstTimer;
        finalRate = Math.round(extracted.servicePrice * 0.9);
      }
      if (extracted.isEmergency) {
        notes = bridgeoceanKnowledge.notes.emergency;
        finalRate = Math.round(extracted.servicePrice * 1.2);
      }

      const quantity = 1;
      const subtotal = finalRate * quantity;
      const vat = includeVAT ? Math.round(subtotal * 0.075) : 0;
      const total = subtotal + vat;
      const balanceDue = total - extracted.amountPaid;

      const serviceDateObj = new Date(extracted.serviceDate.split("/").reverse().join("-"));
      const dueDate = new Date(serviceDateObj);
      dueDate.setDate(serviceDateObj.getDate() + 1);

      const invoiceNumber = `INV${String(Date.now()).slice(-3)}-BO`;

      return {
        invoiceNumber,
        customerName: extracted.customerName,
        serviceDate: extracted.serviceDate,
        dueDate: dueDate.toLocaleDateString("en-GB"),
        vehicle: extracted.vehicleType,
        duration: extracted.duration,
        rate: finalRate,
        quantity,
        subtotal,
        vat,
        total,
        amountPaid: extracted.amountPaid,
        balanceDue,
        notes,
        terms: bridgeoceanKnowledge.terms.standard,
        source: extracted.source,
      };
    } catch {
      throw new Error("Both AI and hybrid extraction failed");
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

      const receipt = generateReceiptData(data);
      setReceiptData(receipt);

      toast({ title: "Invoice & Receipt generated successfully", description: `Data extracted using ${data.source}` });
    } catch {
      toast({
        title: "Error generating invoice",
        description: "Please try again or check your WhatsApp chat format",
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
            .terms { margin-top: 20px; }
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
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
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
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₦${invoiceData.subtotal.toLocaleString()}</span>
            </div>
            ${
              invoiceData.vat > 0
                ? `
            <div class="total-row">
              <span>VAT (7.5%):</span>
              <span>₦${invoiceData.vat.toLocaleString()}</span>
            </div>
            `
                : ""
            }
            <div class="total-row total-final">
              <span>Total:</span>
              <span>₦${invoiceData.total.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>Amount Paid:</span>
              <span>₦${invoiceData.amountPaid.toLocaleString()}</span>
            </div>
            <div class="total-row total-final">
              <span>Balance Due:</span>
              <span>₦${invoiceData.balanceDue.toLocaleString()}</span>
            </div>
          </div>

          <div class="notes">
            <h4>Notes:</h4>
            <p>${invoiceData.notes}</p>
          </div>

          <div class="terms">
            <h4>Terms:</h4>
            <p>${invoiceData.terms}</p>
          </div>
        </body>
        </html>
      `;
      await generatePDF(htmlContent, `Invoice-${invoiceData.invoiceNumber}-Bridgeocean.pdf`);
      toast({ title: "Invoice Downloaded as PDF", description: `Invoice ${invoiceData.invoiceNumber} downloaded` });
    } catch (error) {
      toast({
        title: "PDF generation failed",
        description: error instanceof Error ? error.message : "Downloaded as HTML instead",
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
            body { font-family: 'Courier New', monospace; margin: 40px; background-color: #f9f9f9; display:flex; justify-content:center; align-items:center; min-height:100vh; }
            .receipt { background:#fff; padding:30px; border:2px solid #000; max-width:400px; text-align:center; box-shadow:0 4px 8px rgba(0,0,0,0.1); }
            .company-name { font-size:18px; font-weight:bold; margin-bottom:10px; text-transform:uppercase; }
            .datetime { font-size:14px; margin-bottom:15px; }
            .transaction-info { text-align:left; margin:20px 0; font-size:14px; }
            .amount-line { display:flex; justify-content:space-between; margin:5px 0; }
            .total-line { font-weight:bold; border-top:1px solid #000; padding-top:5px; margin-top:10px; }
            .footer { margin-top:20px; font-size:12px; }
            .company-footer { margin-top:15px; font-size:14px; font-weight:bold; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="company-name">BRIDGEOCEAN LIMITED</div>
            <div class="datetime">${receiptData.timestamp}</div>

            <div class="transaction-info">
              <div>TRANS ${receiptData.transactionId}</div>
              <div>MCC ${receiptData.mccCode}</div>
              <div>PAYMENT - ${receiptData.paymentMethod}</div>
            </div>

            <div class="transaction-info">
              <div class="amount-line"><span>SUBTOTAL:</span><span>₦${receiptData.subtotal.toLocaleString()}.00</span></div>
              <div class="amount-line"><span>SERVICE:</span><span>₦${receiptData.serviceCharge.toLocaleString()}.00</span></div>
              <div class="amount-line total-line"><span>TOTAL:</span><span>₦${receiptData.total.toLocaleString()}.00</span></div>
            </div>

            <div class="footer"><div>PLEASE COME AGAIN</div><div>THANK YOU</div></div>
            <div class="company-footer">...........BRIDGEOCEAN LIMITED...........</div>
          </div>
        </body>
        </html>
      `;
      await generatePDF(receiptContent, `Receipt-${receiptData.transactionId}-Bridgeocean.pdf`);
      toast({ title: "Receipt Downloaded as PDF", description: `Receipt ${receiptData.transactionId} downloaded` });
    } catch (error) {
      toast({
        title: "PDF generation failed",
        description: error instanceof Error ? error.message : "Downloaded as HTML instead",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  const exampleChats = [
    `Client (Mr. James Okafor): Good morning. I'm interested in chartering a Toyota Camry from your fleet. Could you please confirm availability and cost for a day?
Bridgeocean (Ms. Ada Eze): Good morning, Mr. Okafor. Thank you for reaching out. Yes, the Toyota Camry is available. The cost for a full-day charter is ₦35,000. May I ask what date you'll need the service?
Client: That works for me. I'll need the service on Saturday, August 10th.
Bridgeocean: Perfect. I've reserved the Camry for you on August 10th. Pickup will be available from 8:00 AM. Payment can be made via transfer to confirm your booking.
Client: Great, I'll make the transfer now. Thanks for your prompt response.`,
    `Customer: Hi, I need to book your GMC Terrain for tomorrow
Bridgeocean: Hello! That's ₦200,000 for 10 hours (minimum). Can you pay 50% now?
Customer: Yes, my name is John Adebayo. I'll pay ₦100,000 now
Bridgeocean: Perfect, booking confirmed`,
    `Customer: Emergency! Need a car right now
Bridgeocean: We can help! What's your name?
Customer: I'm David Okoro at Victoria Island
Bridgeocean: GMC Terrain available, ₦240,000 for emergency service
Customer: Book it now, I'll pay full amount
Bridgeocean: Emergency booking confirmed`,
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
          <CardDescription>Uses Google Gemini 1.5 Flash for intelligent extraction, with smart pattern matching fallback</CardDescription>
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

          <div className="flex items-center space-x-2">
            <Checkbox id="include-vat" checked={includeVAT} onCheckedChange={(c) => setIncludeVAT(c as boolean)} />
            <label htmlFor="include-vat" className="text-sm font-medium leading-none">
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
                    <strong>Example {index + 1}:</strong> {example.split("\n")[0].substring(0, 60)}...
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerateInvoice} className="w-full" disabled={isGenerating || !whatsappChat.trim()}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting Data with AI...
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
              {aiSource && (
                <Badge variant="outline" className="ml-2">
                  Powered by {aiSource}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Invoice and Receipt with PDF download support</CardDescription>

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
              </>
            )}

            {activeView === "receipt" && (
              <>
                <div className="max-w-md mx-auto bg-gray-50 p-6 border-2 border-gray-300 font-mono text-center">
                  <div className="text-lg font-bold mb-2">BRIDGEOCEAN LIMITED</div>
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

            <div className="flex gap-2 pt-4">
              <Button onClick={handleDownloadInvoice} disabled={isGeneratingPDF} className="flex-1">
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice (PDF)
                  </>
                )}
              </Button>

              <Button
                onClick={handleDownloadReceipt}
                disabled={isGeneratingReceipt || !receiptData}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                {isGeneratingReceipt ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
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
                  const text =
                    activeView === "invoice"
                      ? `Invoice #${invoiceData!.invoiceNumber}\nCustomer: ${invoiceData!.customerName}\nService: ${invoiceData!.vehicle}\nTotal: ${formatCurrency(invoiceData!.total)}\nBalance Due: ${formatCurrency(invoiceData!.balanceDue)}`
                      : `Receipt ${receiptData!.transactionId}\nCustomer: ${receiptData!.customerName}\nAmount: ₦${receiptData!.total.toLocaleString()}\nPayment: ${receiptData!.paymentMethod}`;
                  navigator.clipboard.writeText(text);
                  toast({
                    title: "Copied to clipboard",
                    description: `${activeView === "invoice" ? "Invoice" : "Receipt"} details copied to clipboard`,
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
