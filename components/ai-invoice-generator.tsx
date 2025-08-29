"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

/** ---------- Utilities ---------- */

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function money(n: number | string) {
  const val = typeof n === "string" ? Number(n.replace(/[^\d.-]/g, "")) : n;
  return NGN.format(isFinite(val) ? val : 0);
}

function todayISO() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
function addDaysISO(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

/** A very small “parser” to pull a single amount from chat if present */
function roughParseFromChat(chat: string) {
  const amountMatch = chat.match(/₦?\s?([\d,]+)(?:\.\d+)?/);
  const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, "")) : 165000;
  const who = (chat.match(/to[:\- ]+([A-Za-z ]{2,})/i)?.[1] || chat.match(/\b(?:for|bill to)\s+([A-Za-z ]{2,})/i)?.[1] || "Jide").trim();

  return {
    billTo: who,
    items: [
      {
        description: "GMC Terrain Charter Service (2 days)",
        quantity: 1,
        rate: amount,
      },
    ],
  };
}

/** ---------- HTML builders (include Terms/Notes) ---------- */

const BRIDGEOCEAN_NAME = "Bridgeocean Limited";
const BRIDGEOCEAN_TAGLINE = "Premium Charter Services";

function buildInvoiceHTML(opts: {
  invoiceNumber: string;
  billTo: string;
  serviceDate: string;
  dueDate: string;
  items: { description: string; quantity: number; rate: number }[];
  amountPaid: number;
  notesText?: string;
  termsText?: string;
}) {
  const subtotal = opts.items.reduce((s, it) => s + it.quantity * it.rate, 0);
  const total = subtotal;
  const balance = total - opts.amountPaid;

  const termsBlock = opts.termsText?.trim()
    ? `<h4>Terms & Payment details</h4><pre class="pre">${escapeHtml(opts.termsText.trim())}</pre>`
    : "";
  const notesBlock = opts.notesText?.trim()
    ? `<h4>Notes</h4><pre class="pre">${escapeHtml(opts.notesText.trim())}</pre>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${escapeHtml(opts.invoiceNumber)}</title>
<meta name="color-scheme" content="light only" />
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #111; background:#fff; }
  .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; }
  .invoice-title { font-size: 28px; font-weight: 800; letter-spacing: .5px; }
  .invoice-number { font-size: 16px; color: #2563eb; font-weight: 700; }
  .company-info { text-align:right; }
  .bill-to { margin: 16px 0 8px; }
  .dates { display:flex; gap: 32px; margin: 16px 0 24px; }
  .items { width: 100%; border-collapse: collapse; }
  .items th, .items td { border:1px solid #e5e7eb; padding: 10px 12px; text-align:left; }
  .items th { background:#f8fafc; }
  .totals { margin-left:auto; width: 320px; margin-top: 18px; }
  .row { display:flex; justify-content:space-between; padding: 6px 0; }
  .final { border-top:2px solid #111; padding-top:10px; font-weight:700; }
  .terms { margin-top: 26px; }
  .terms h4 { margin: 14px 0 6px; font-size: 14px; }
  .pre { white-space: pre-wrap; font-size: 13px; line-height: 1.45; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">#${escapeHtml(opts.invoiceNumber)}</div>
    </div>
    <div class="company-info">
      <h2>${escapeHtml(BRIDGEOCEAN_NAME)}</h2>
      <div>${escapeHtml(BRIDGEOCEAN_TAGLINE)}</div>
    </div>
  </div>

  <div class="bill-to"><strong>Bill To:</strong><br/>${escapeHtml(opts.billTo)}</div>
  <div class="dates">
    <div><strong>Service Date:</strong> ${escapeHtml(opts.serviceDate)}</div>
    <div><strong>Due Date:</strong> ${escapeHtml(opts.dueDate)}</div>
    <div><strong>Balance Due:</strong> ${escapeHtml(money(balance))}</div>
  </div>

  <table class="items">
    <thead><tr><th>Item</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody>
      ${opts.items.map(it => {
        const amt = it.quantity * it.rate;
        return `<tr>
          <td>${escapeHtml(it.description)}</td>
          <td>${escapeHtml(String(it.quantity))}</td>
          <td>${escapeHtml(money(it.rate))}</td>
          <td>${escapeHtml(money(amt))}</td>
        </tr>`;
      }).join("")}
    </tbody>
  </table>

  <div class="totals">
    <div class="row"><span>Subtotal:</span><span>${escapeHtml(money(subtotal))}</span></div>
    <div class="row final"><span>Total:</span><span>${escapeHtml(money(total))}</span></div>
    <div class="row"><span>Amount Paid:</span><span>${escapeHtml(money(opts.amountPaid))}</span></div>
    <div class="row final"><span>Balance Due:</span><span>${escapeHtml(money(balance))}</span></div>
  </div>

  <div class="terms">
    ${termsBlock}${notesBlock}
  </div>
</body>
</html>`;
}

function buildReceiptHTML(opts: {
  receiptNumber: string;
  billTo: string;
  date: string;
  items: { description: string; quantity: number; rate: number }[];
  amountPaid: number;
  notesText?: string;
}) {
  const paid = opts.amountPaid;
  const notesBlock = opts.notesText?.trim()
    ? `<h4>Notes</h4><pre class="pre">${escapeHtml(opts.notesText.trim())}</pre>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Receipt ${escapeHtml(opts.receiptNumber)}</title>
<meta name="color-scheme" content="light only" />
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #111; background:#fff; }
  .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; }
  .receipt-title { font-size: 28px; font-weight: 800; letter-spacing: .5px; }
  .receipt-number { font-size: 16px; color: #2563eb; font-weight: 700; }
  .company-info { text-align:right; }
  .bill-to { margin: 16px 0 8px; }
  .items { width: 100%; border-collapse: collapse; margin-top: 20px; }
  .items th, .items td { border:1px solid #e5e7eb; padding: 10px 12px; text-align:left; }
  .items th { background:#f8fafc; }
  .pre { white-space: pre-wrap; font-size: 13px; line-height: 1.45; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="receipt-title">RECEIPT</div>
      <div class="receipt-number">#${escapeHtml(opts.receiptNumber)}</div>
    </div>
    <div class="company-info">
      <h2>${escapeHtml(BRIDGEOCEAN_NAME)}</h2>
      <div>${escapeHtml(BRIDGEOCEAN_TAGLINE)}</div>
    </div>
  </div>

  <div><strong>Received From:</strong> ${escapeHtml(opts.billTo)}</div>
  <div><strong>Date:</strong> ${escapeHtml(opts.date)}</div>

  <table class="items">
    <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody>
      ${opts.items.map(it => {
        const amt = it.quantity * it.rate;
        return `<tr>
          <td>${escapeHtml(it.description)}</td>
          <td>${escapeHtml(String(it.quantity))}</td>
          <td>${escapeHtml(money(it.rate))}</td>
          <td>${escapeHtml(money(amt))}</td>
        </tr>`;
      }).join("")}
    </tbody>
  </table>

  <h3 style="margin-top:18px;">Amount Paid: ${escapeHtml(money(paid))}</h3>

  ${notesBlock}
</body>
</html>`;
}

/** ---------- Component ---------- */

type Item = { description: string; quantity: number; rate: number; };
type Props = {
  notes?: string;
  terms?: string;
  autoBank?: boolean;
};

export function AIInvoiceGenerator({ notes = "", terms = "", autoBank = true }: Props) {
  // Minimal “source” input (paste WhatsApp chat here, optional)
  const [chat, setChat] = React.useState<string>("");

  // Data model (you can still wire your own AI to populate these)
  const [billTo, setBillTo] = React.useState<string>("Jide");
  const [items, setItems] = React.useState<Item[]>([
    { description: "GMC Terrain Charter Service (2 days)", quantity: 1, rate: 165000 },
  ]);
  const [serviceDate, setServiceDate] = React.useState<string>(todayISO());
  const [dueDate, setDueDate] = React.useState<string>(addDaysISO(1));
  const [amountPaid, setAmountPaid] = React.useState<number>(0);

  const [generated, setGenerated] = React.useState<boolean>(false);
  const [invoiceNumber, setInvoiceNumber] = React.useState<string>(() => {
    const r = Math.floor(100 + Math.random() * 900);
    return `INV${r}-BO`;
  });
  const [receiptNumber, setReceiptNumber] = React.useState<string>(() => {
    const r = Math.floor(100 + Math.random() * 900);
    return `RCT${r}-BO`;
  });

  // Optional: “AI” parse from chat on Generate
  function handleGenerate() {
    if (chat.trim()) {
      const parsed = roughParseFromChat(chat);
      setBillTo(parsed.billTo);
      setItems(parsed.items);
    }
    setGenerated(true);
  }

  const subtotal = items.reduce((s, it) => s + it.quantity * it.rate, 0);
  const total = subtotal;
  const balance = total - amountPaid;

  /** Download helpers */
  function download(filename: string, html: string) {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadInvoice() {
    const html = buildInvoiceHTML({
      invoiceNumber,
      billTo,
      serviceDate,
      dueDate,
      items,
      amountPaid,
      notesText: notes,
      termsText: terms,
    });
    download(`Invoice-${invoiceNumber}-Bridgeocean.html`, html);
  }

  function downloadReceipt() {
    const html = buildReceiptHTML({
      receiptNumber,
      billTo,
      date: todayISO(),
      items,
      amountPaid: amountPaid || items.reduce((s, it) => s + it.quantity * it.rate, 0),
      notesText: notes,
    });
    download(`Receipt-${receiptNumber}-Bridgeocean.html`, html);
  }

  /** Editable items (kept simple) */
  const updateItem = (i: number, patch: Partial<Item>) =>
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  const addItem = () => setItems(prev => [...prev, { description: "", quantity: 1, rate: 0 }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      {/* Source chat (optional) */}
      <section className="rounded-lg border border-slate-200 p-4">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Paste WhatsApp chat (optional)
        </label>
        <textarea
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          placeholder="Paste conversation here and click Generate…"
          className="h-28 w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="mt-3">
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleGenerate}>
            Generate Invoice & Receipt
          </Button>
        </div>
      </section>

      {/* Generated Documents */}
      <section className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-3 text-lg font-semibold">Generated Documents</h3>

        {/* Invoice Preview */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Button variant="secondary">Invoice Preview</Button>
          <Button variant="outline">Receipt Preview</Button>
        </div>

        {/* Invoice “sheet” */}
        <div className="rounded-lg border border-slate-200 bg-white p-6" id="invoice-preview">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-extrabold tracking-tight">INVOICE</div>
              <div className="text-blue-600 font-semibold">#{invoiceNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{BRIDGEOCEAN_NAME}</div>
              <div className="text-slate-500">{BRIDGEOCEAN_TAGLINE}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6">
            <div>
              <div className="text-sm font-semibold">Bill To:</div>
              <div className="mt-1">
                <input
                  value={billTo}
                  onChange={(e) => setBillTo(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold">Service Date:</div>
                <input
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2"
                />
              </div>
              <div>
                <div className="text-sm font-semibold">Due Date:</div>
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="w-[55%] p-2 text-left text-sm text-slate-600">Item</th>
                  <th className="w-[15%] p-2 text-left text-sm text-slate-600">Quantity</th>
                  <th className="w-[15%] p-2 text-left text-sm text-slate-600">Rate</th>
                  <th className="w-[15%] p-2 text-left text-sm text-slate-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => {
                  const amt = it.quantity * it.rate;
                  return (
                    <tr key={i} className="border-b">
                      <td className="p-2">
                        <input
                          value={it.description}
                          onChange={(e) => updateItem(i, { description: e.target.value })}
                          className="w-full rounded-md border border-slate-300 p-2"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={it.quantity}
                          onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                          className="w-full rounded-md border border-slate-300 p-2"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={it.rate}
                          onChange={(e) => updateItem(i, { rate: Number(e.target.value) })}
                          className="w-full rounded-md border border-slate-300 p-2"
                        />
                      </td>
                      <td className="p-2">{money(amt)}</td>
                      <td className="p-2">
                        {items.length > 1 && (
                          <button className="text-red-600 text-sm" onClick={() => removeItem(i)}>
                            remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-2">
              <button className="text-sm text-blue-600 hover:underline" onClick={addItem}>
                + Add item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div />
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal:</span><span>{money(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span><span>{money(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Amount Paid:</span>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-32 rounded-md border border-slate-300 p-2 text-right"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Balance Due:</span>
                <span className="font-semibold text-blue-600">{money(balance)}</span>
              </div>
            </div>
          </div>

          {/* Downloads */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={downloadInvoice}
            >
              Download Invoice (HTML)
            </Button>
            <Button variant="outline" onClick={downloadReceipt}>
              Download Receipt (HTML)
            </Button>
          </div>

          {/* Static Terms/Notes block IN the invoice content (so it downloads too) */}
          {generated && (terms.trim() || notes.trim()) && (
            <section className="mt-6 rounded-md border border-slate-200 bg-white p-4">
              {terms.trim() && (
                <>
                  <h4 className="mb-1 text-sm font-semibold">Terms &amp; Payment details</h4>
                  <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-slate-700">
{terms.trim()}
                  </pre>
                </>
              )}
              {notes.trim() && (
                <>
                  <h4 className="mt-3 mb-1 text-sm font-semibold">Notes</h4>
                  <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-slate-700">
{notes.trim()}
                  </pre>
                </>
              )}
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
