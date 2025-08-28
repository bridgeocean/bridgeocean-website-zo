"use client";

import React, { useMemo, useState } from "react";

/** ===== Defaults (auto-filled into Terms) ===== */
const DEFAULT_BANK_DETAILS = `Zenith Bank Account (preferred)
Zenith Account number: 1229647858
Bridgeocean Limited

Moniepoint Account details
Moniepoint Account number: 8135261568
Bridgeocean Limited`;

/** ===== Types ===== */
type LineItem = {
  description: string;
  quantity: number;
  rate: number;
};

export default function InvoicePage() {
  /** ===== Items ===== */
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0 },
  ]);

  const addItem = () =>
    setItems((prev) => [...prev, { description: "", quantity: 1, rate: 0 }]);

  const updateItem = (idx: number, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  /** ===== Notes + Terms (NEW) ===== */
  const [notes, setNotes] = useState<string>("");
  const [terms, setTerms] = useState<string>(DEFAULT_BANK_DETAILS); // auto-filled
  const [autoBank, setAutoBank] = useState<boolean>(true);

  /** ===== Totals & Extras (kept same behavior) ===== */
  const [taxPct, setTaxPct] = useState<number>(0);
  const [showDiscount, setShowDiscount] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);
  const [showShipping, setShowShipping] = useState<boolean>(false);
  const [shipping, setShipping] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.rate) || 0), 0),
    [items]
  );

  const taxAmount = useMemo(() => (subtotal * (Number(taxPct) || 0)) / 100, [subtotal, taxPct]);

  const total = useMemo(
    () => Math.max(0, subtotal + taxAmount - (showDiscount ? Number(discount) || 0 : 0) + (showShipping ? Number(shipping) || 0 : 0)),
    [subtotal, taxAmount, showDiscount, discount, showShipping, shipping]
  );

  const balanceDue = useMemo(
    () => Math.max(0, total - (Number(amountPaid) || 0)),
    [total, amountPaid]
  );

  /** ===== WhatsApp message composer (includes NEW fields) ===== */
  const composeWhatsAppText = () => {
    const lines: string[] = [];
    lines.push("INVOICE");
    lines.push("");

    items.forEach((it, i) => {
      const qty = Number(it.quantity) || 0;
      const rate = Number(it.rate) || 0;
      const amt = qty * rate;
      if (!it.description && !qty && !rate) return;
      lines.push(
        `${i + 1}. ${it.description || "Item"} — Qty: ${qty}, Rate: ${rate.toFixed(
          2
        )}, Amount: ${amt.toFixed(2)}`
      );
    });

    lines.push("");
    lines.push(`Subtotal: ${subtotal.toFixed(2)}`);
    lines.push(`Tax (${(Number(taxPct) || 0).toFixed(2)}%): ${taxAmount.toFixed(2)}`);
    if (showDiscount) lines.push(`Discount: -${(Number(discount) || 0).toFixed(2)}`);
    if (showShipping) lines.push(`Shipping: ${(Number(shipping) || 0).toFixed(2)}`);
    lines.push(`Total: ${total.toFixed(2)}`);
    lines.push(`Amount Paid: ${(Number(amountPaid) || 0).toFixed(2)}`);
    lines.push(`Balance Due: ${balanceDue.toFixed(2)}`);

    if (notes.trim()) {
      lines.push("");
      lines.push("Notes:");
      lines.push(notes.trim());
    }

    if (terms.trim()) {
      lines.push("");
      lines.push("Terms & Payment Details:");
      lines.push(terms.trim());
    }

    return lines.join("\n");
  };

  const openWhatsApp = () => {
    const text = composeWhatsAppText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(composeWhatsAppText());
      alert("Invoice text copied.");
    } catch {
      alert("Could not copy. Long-press and copy manually.");
    }
  };

  /** ===== UI ===== */
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-xl font-semibold mb-6">Invoice</h1>

      {/* Items header */}
      <div className="rounded-t-lg bg-slate-900 text-white px-4 py-3 flex items-center">
        <div className="flex-1">Item</div>
        <div className="w-28 text-center">Quantity</div>
        <div className="w-28 text-center">Rate</div>
        <div className="w-32 text-right">Amount</div>
      </div>

      {/* Items list */}
      <div className="border border-slate-200 border-t-0 rounded-b-lg">
        {items.map((it, idx) => {
          const amt = (Number(it.quantity) || 0) * (Number(it.rate) || 0);
          return (
            <div
              key={idx}
              className="px-4 py-3 flex items-start gap-3 border-t border-slate-100 first:border-t-0"
            >
              <textarea
                value={it.description}
                onChange={(e) => updateItem(idx, { description: e.target.value })}
                placeholder="Description of item/service..."
                className="flex-1 min-h-[44px] rounded-md border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                min={0}
                value={it.quantity}
                onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                className="w-28 rounded-md border border-slate-300 p-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={it.rate}
                onChange={(e) => updateItem(idx, { rate: Number(e.target.value) })}
                className="w-28 rounded-md border border-slate-300 p-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="w-32 text-right pt-2 font-medium">{amt.toFixed(2)}</div>

              {items.length > 1 && (
                <button
                  onClick={() => removeItem(idx)}
                  className="ml-2 text-sm text-red-600 hover:underline"
                  title="Remove line"
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}

        <div className="px-4 py-3">
          <button
            onClick={addItem}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          >
            + Line Item
          </button>
        </div>
      </div>

      {/* NEW: Notes */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes - any relevant information not already covered"
          className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      {/* NEW: Terms & Payment details (auto-filled with bank details) */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-slate-700">
            Terms &amp; Payment details
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={autoBank}
              onChange={(e) => {
                const checked = e.target.checked;
                setAutoBank(checked);
                if (checked && !terms.trim()) setTerms(DEFAULT_BANK_DETAILS);
                if (!checked && terms.trim() === DEFAULT_BANK_DETAILS) setTerms("");
              }}
            />
            Auto-insert Bridgeocean bank details
          </label>
        </div>

        <textarea
          value={terms}
          onChange={(e) => {
            setTerms(e.target.value);
            if (e.target.value.trim() && autoBank) setAutoBank(false);
          }}
          placeholder="Terms and conditions – late fees, payment methods, delivery schedule"
          className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={5}
        />
      </div>

      {/* Totals side panel */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* (Empty left column to mirror your layout / add logos if needed) */}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Subtotal</span>
            <span className="font-medium">{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Tax</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={taxPct}
                onChange={(e) => setTaxPct(Number(e.target.value))}
                className="w-24 rounded-md border border-slate-300 p-2 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm">%</span>
            </div>
          </div>

          {/* Discount */}
          <div className="flex items-center justify-between">
            <button
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => setShowDiscount((s) => !s)}
            >
              {showDiscount ? "− Discount" : "+ Discount"}
            </button>
            {showDiscount && (
              <input
                type="number"
                min={0}
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-32 rounded-md border border-slate-300 p-2 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Shipping */}
          <div className="flex items-center justify-between">
            <button
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => setShowShipping((s) => !s)}
            >
              {showShipping ? "− Shipping" : "+ Shipping"}
            </button>
            {showShipping && (
              <input
                type="number"
                min={0}
                step="0.01"
                value={shipping}
                onChange={(e) => setShipping(Number(e.target.value))}
                className="w-32 rounded-md border border-slate-300 p-2 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{total.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Amount Paid</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="w-32 rounded-md border border-slate-300 p-2 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Balance Due</span>
            <span className="font-medium">{balanceDue.toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={openWhatsApp}
              className="rounded-md bg-green-600 text-white px-4 py-2 hover:bg-green-700"
            >
              Share via WhatsApp
            </button>
            <button
              onClick={copyToClipboard}
              className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50"
            >
              Copy Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
