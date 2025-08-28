"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { AIInvoiceGenerator } from "@/components/ai-invoice-generator";
import { Button } from "@/components/ui/button";

/** Default bank details (prefills Terms & Payment details) */
const DEFAULT_BANK_DETAILS = `Zenith Bank Account (preferred)
Zenith Account number: 1229647858
Bridgeocean Limited

Moniepoint Account details
Moniepoint Account number: 8135261568
Bridgeocean Limited`;

/** Likely invoice preview roots used by generators (we try them in order). */
const INVOICE_ROOT_SELECTORS = [
  "#invoice-preview",
  "[data-invoice-root]",
  ".invoice-preview",
  "#invoice",
  "#invoice-pdf",
  "[data-pdf-root]",
];

/** Try to find the invoice preview element so the Terms box gets included in PDF/print. */
function findInvoiceRoot(base: HTMLElement | null): HTMLElement | null {
  if (!base) return null;
  for (const sel of INVOICE_ROOT_SELECTORS) {
    const el = base.querySelector<HTMLElement>(sel);
    if (el) return el;
  }
  // Fall back to the first sizeable white-ish card that looks like a sheet
  const cards = Array.from(
    base.querySelectorAll<HTMLElement>("section,div")
  ).filter((n) => {
    const s = window.getComputedStyle(n);
    const bg = s.backgroundColor.toLowerCase();
    const w = n.getBoundingClientRect().width;
    const h = n.getBoundingClientRect().height;
    return (
      w > 500 &&
      h > 400 &&
      (bg.includes("255") || bg.includes("white") || s.backgroundColor === "rgb(255, 255, 255)")
    );
  });
  return cards[0] || null;
}

export function InvoiceNotesTermsBridge() {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  // Notes & Terms state
  const [notes, setNotes] = React.useState<string>("");
  const [terms, setTerms] = React.useState<string>(DEFAULT_BANK_DETAILS);
  const [autoBank, setAutoBank] = React.useState<boolean>(true);

  // Show the box only after "Generate invoice" is clicked (as requested)
  const [hasGenerated, setHasGenerated] = React.useState<boolean>(false);

  // Where to render (portal target); if null we render locally inside the wrapper.
  const [invoiceRoot, setInvoiceRoot] = React.useState<HTMLElement | null>(null);

  /** Allow your AI (Groq/Grok/OpenAI/etc.) to populate Notes/Terms from chat */
  React.useEffect(() => {
    const handler = (e: Event) => {
      const { notes: n, terms: t } = (e as CustomEvent).detail || {};
      if (typeof n === "string") setNotes(n);
      if (typeof t === "string") setTerms(t);
    };
    window.addEventListener("bridgeocean:setInvoiceMeta", handler as EventListener);
    return () => window.removeEventListener("bridgeocean:setInvoiceMeta", handler as EventListener);
  }, []);

  /** Detect clicks on buttons/links that look like "Generate invoice" inside the generator. */
  React.useEffect(() => {
    const root = wrapperRef.current;
    if (!root) return;

    const onClickCapture = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const clickable = el.closest("button, a, [role='button']") as HTMLElement | null;
      if (!clickable || !root.contains(clickable)) return;

      const text = (clickable.textContent || "").toLowerCase().trim();
      if (
        text.includes("generate invoice") ||
        text.includes("create invoice") ||
        text.includes("build invoice")
      ) {
        setHasGenerated(true);

        // Re-scan for invoice preview root after generation updates the DOM
        setTimeout(() => {
          const found = findInvoiceRoot(root);
          if (found) setInvoiceRoot(found);
        }, 50);
      }
    };

    document.addEventListener("click", onClickCapture, true);

    // Initial passive scan (in case the preview is already visible on mount)
    const initial = findInvoiceRoot(root);
    if (initial) setInvoiceRoot(initial);

    return () => document.removeEventListener("click", onClickCapture, true);
  }, []);

  /** Small Terms/Notes panel rendered bottom-left INSIDE the invoice area */
  const termsPanel = (
    <div
      // pointer-events-none so we don't block clicks on the invoice preview
      className="pointer-events-none absolute left-4 bottom-4 z-20 w-[min(460px,46%)]"
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      {/* Inner box can accept selection if needed */}
      <div className="pointer-events-auto rounded-md border border-slate-300 bg-white/95 p-3 shadow">
        <div className="text-xs font-semibold">Terms &amp; Payment details</div>
        <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-snug text-slate-700">
{terms.trim()}
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

  // Decide whether to show the panel
  const shouldShowPanel =
    hasGenerated && (autoBank || !!notes.trim() || !!terms.trim());

  return (
    <div ref={wrapperRef} className="space-y-8">
      {/* Your existing AI-driven WhatsApp → invoice generator */}
      <AIInvoiceGenerator />

      {/* Controls for Notes & Terms */}
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
                    alert("Copied text fallback: select and copy manually.");
                  }
                }}
              >
                Copy Notes & Terms
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          After you click <em>Generate invoice</em>, the Terms/Notes box will appear in the invoice
          bottom-left. It’s also included in PDF/print when the preview root is detected.
        </p>
      </section>

      {/* Render the panel INSIDE the invoice preview tree when possible; else in our wrapper */}
      {shouldShowPanel &&
        (invoiceRoot
          ? ReactDOM.createPortal(termsPanel, invoiceRoot)
          : (
            <div className="relative">
              {/* local render fallback */}
              {termsPanel}
            </div>
          ))}
    </div>
  );
}
