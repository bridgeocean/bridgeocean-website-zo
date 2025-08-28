"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { AIInvoiceGenerator } from "@/components/ai-invoice-generator";
import { Button } from "@/components/ui/button";

/** Prefill used when “Auto-insert” is checked */
const DEFAULT_BANK_DETAILS = `Zenith Bank Account (preferred)
Zenith Account number: 1229647858
Bridgeocean Limited

Moniepoint Account details
Moniepoint Account number: 8135261568
Bridgeocean Limited`;

/** Common invoice preview containers we try to mount into */
const INVOICE_ROOT_SELECTORS = [
  "#invoice-preview",
  "[data-invoice-root]",
  ".invoice-preview",
  "#invoice",
  "#invoice-pdf",
  "[data-pdf-root]",
];

/** Find the invoice preview element; fall back to the largest white card */
function findInvoiceRoot(base: HTMLElement | null): HTMLElement | null {
  if (!base) return null;

  for (const sel of INVOICE_ROOT_SELECTORS) {
    const el = base.querySelector<HTMLElement>(sel);
    if (el) return el;
  }

  // Heuristic: first large white-ish card
  const candidates = Array.from(base.querySelectorAll<HTMLElement>("section,div")).filter((n) => {
    const s = window.getComputedStyle(n);
    const w = n.getBoundingClientRect().width;
    const h = n.getBoundingClientRect().height;
    const bg = s.backgroundColor.toLowerCase();
    return (
      w > 500 &&
      h > 400 &&
      (bg.includes("255") || bg.includes("white") || bg === "rgb(255, 255, 255)")
    );
  });
  return candidates[0] || null;
}

export function InvoiceNotesTermsBridge() {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  // Notes & Terms
  const [notes, setNotes] = React.useState<string>("");
  const [terms, setTerms] = React.useState<string>(DEFAULT_BANK_DETAILS);
  const [autoBank, setAutoBank] = React.useState<boolean>(true);

  // Show inside invoice only after user generates
  const [hasGenerated, setHasGenerated] = React.useState<boolean>(false);

  // Where to render (portal target)
  const [invoiceRoot, setInvoiceRoot] = React.useState<HTMLElement | null>(null);

  /** Allow your AI to populate these via:
   * window.dispatchEvent(new CustomEvent("bridgeocean:setInvoiceMeta", { detail: { notes, terms } }))
   */
  React.useEffect(() => {
    const handler = (e: Event) => {
      const { notes: n, terms: t } = (e as CustomEvent).detail || {};
      if (typeof n === "string") setNotes(n);
      if (typeof t === "string") setTerms(t);
    };
    window.addEventListener("bridgeocean:setInvoiceMeta", handler as EventListener);
    return () => window.removeEventListener("bridgeocean:setInvoiceMeta", handler as EventListener);
  }, []);

  /** Detect “Generate Invoice” click and (re)locate the invoice preview root */
  React.useEffect(() => {
    const root = wrapperRef.current;
    if (!root) return;

    const onClickCapture = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const clickable = el.closest("button, a, [role='button']") as HTMLElement | null;
      if (!clickable || !root.contains(clickable)) return;

      const text = (clickable.textContent || "").toLowerCase();
      if (
        text.includes("generate invoice") ||
        text.includes("generate invoice & receipt") ||
        text.includes("create invoice") ||
        text.includes("build invoice")
      ) {
        setHasGenerated(true);
        setTimeout(() => {
          setInvoiceRoot(findInvoiceRoot(root));
        }, 60);
      }
    };

    document.addEventListener("click", onClickCapture, true);

    // Initial scan on mount (in case preview is already visible)
    setInvoiceRoot(findInvoiceRoot(root));

    return () => document.removeEventListener("click", onClickCapture, true);
  }, []);

  /** Ensure the preview root is a positioned container so our absolute panel anchors INSIDE it */
  React.useEffect(() => {
    if (!invoiceRoot) return;
    const s = window.getComputedStyle(invoiceRoot);
    const hadStatic = s.position === "static";
    if (hadStatic) invoiceRoot.style.position = "relative";

    // Clean up: don’t leave inline style if we added it
    return () => {
      if (hadStatic && invoiceRoot) invoiceRoot.style.position = "";
    };
  }, [invoiceRoot]);

  // Should we show the panel?
  const hasAnyTerms = (autoBank && DEFAULT_BANK_DETAILS) || terms.trim();
  const shouldShowPanel = hasGenerated && (notes.trim() || hasAnyTerms);

  /** The actual panel that appears bottom-left inside the invoice */
  const termsPanel = (
    <div
      data-bridgeocean-terms-panel
      className="pointer-events-none absolute left-4 bottom-4 z-20 w-[min(440px,45%)] print:left-4 print:bottom-4"
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      <div className="pointer-events-auto rounded-md border border-slate-300 bg-white/95 p-3 shadow">
        <div className="text-xs font-semibold">Terms &amp; Payment details</div>
        <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-snug text-slate-700">
{(autoBank && !terms.trim()) ? DEFAULT_BANK_DETAILS : terms.trim()}
        </pre>

        {notes.trim() && (
          <>
            <div className="mt-2 text-xs font-semibold">Notes</div>
            <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-snug text-slate-700">
{notes.trim()}
            </pre>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div ref={wrapperRef} className="space-y-8">
      {/* Your existing AI WhatsApp → invoice generator */}
      <AIInvoiceGenerator />

      {/* Controls */}
      <section className="rounded-lg border border-slate-200 p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold">Notes &amp; Terms / Payment details</h3>
          <label className="inline-flex select-none items-center gap-2 text-sm">
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

        <div className="grid gap-4 md:grid-cols-2">
          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any relevant information not already covered…"
              className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={5}
            />
          </div>

          {/* Terms */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Terms &amp; Payment details
            </label>
            <textarea
              value={terms}
              onChange={(e) => {
                setTerms(e.target.value);
                if (e.target.value.trim() && autoBank) setAutoBank(false);
              }}
              placeholder="Payment terms, deadlines, methods. Bank details can live here."
              className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={5}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => setTerms(DEFAULT_BANK_DETAILS)}>
                Reset to Bridgeocean bank details
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  const snippet =
                    (notes.trim() ? `Notes:\n${notes.trim()}\n\n` : "") +
                    (terms.trim() ? `Terms & Payment Details:\n${terms.trim()}` : "");
                  if (!snippet) return;
                  try {
                    await navigator.clipboard.writeText(snippet);
                    alert("Notes & Terms copied to clipboard.");
                  } catch {
                    alert("Copy failed. Select the text and copy manually.");
                  }
                }}
              >
                Copy Notes & Terms
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Click <em>Generate Invoice</em> above — the Terms/Notes box will appear inside the invoice,
          bottom-left, and will be included in HTML/PDF downloads.
        </p>
      </section>

      {/* Mount INSIDE the invoice preview so it prints/exports with it */}
      {shouldShowPanel &&
        (invoiceRoot
          ? ReactDOM.createPortal(termsPanel, invoiceRoot)
          : (
            // Fallback: still render near the invoice if we couldn't detect a root
            <div className="relative">{termsPanel}</div>
          ))}
    </div>
  );
}
