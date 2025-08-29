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

/** Likely invoice containers we try in order */
const CANDIDATE_SELECTORS = [
  "#invoice-preview",
  "[data-invoice-root]",
  ".invoice-preview",
  "#invoice",
  "#invoice-pdf",
  "[data-pdf-root]",
];

/** Heuristic: pick the “sheet” that looks like the invoice */
function findInvoiceRoot(scope: HTMLElement | null): HTMLElement | null {
  if (!scope) return null;

  // 1) Known selectors
  for (const sel of CANDIDATE_SELECTORS) {
    const el = scope.querySelector<HTMLElement>(sel);
    if (el) return el;
  }

  // 2) Heuristic: large white card containing common invoice labels
  const candidates = Array.from(scope.querySelectorAll<HTMLElement>("section, article, div")).filter(
    (n) => {
      const s = getComputedStyle(n);
      const rect = n.getBoundingClientRect();
      const bg = s.backgroundColor.toLowerCase();
      const looksWhite = bg.includes("255") || bg.includes("white") || bg === "rgb(255, 255, 255)";
      const big = rect.width > 500 && rect.height > 400;
      const txt = n.textContent?.toLowerCase() || "";
      const hasInvoiceWords =
        txt.includes("invoice") && (txt.includes("item") || txt.includes("quantity"));
      return big && looksWhite && hasInvoiceWords;
    }
  );
  return candidates[0] || null;
}

export function InvoiceNotesTermsBridge() {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  // Notes & Terms state
  const [notes, setNotes] = React.useState<string>("");
  const [terms, setTerms] = React.useState<string>(DEFAULT_BANK_DETAILS);
  const [autoBank, setAutoBank] = React.useState<boolean>(true);

  // Whether we should show inside the document (after user generates)
  const [hasGenerated, setHasGenerated] = React.useState<boolean>(false);

  // Portal target (the actual invoice “sheet”)
  const [invoiceRoot, setInvoiceRoot] = React.useState<HTMLElement | null>(null);

  // Watch the DOM for preview changes and keep our root updated
  React.useEffect(() => {
    const scope = wrapperRef.current;
    if (!scope) return;

    const setRoot = () => setInvoiceRoot(findInvoiceRoot(scope));
    setRoot();

    const obs = new MutationObserver(() => setRoot());
    obs.observe(scope, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  // Allow AI parser to prefill notes/terms from WhatsApp chat
  React.useEffect(() => {
    const handler = (e: Event) => {
      const { notes: n, terms: t } = (e as CustomEvent).detail || {};
      if (typeof n === "string") setNotes(n);
      if (typeof t === "string") setTerms(t);
    };
    window.addEventListener("bridgeocean:setInvoiceMeta", handler as EventListener);
    return () => window.removeEventListener("bridgeocean:setInvoiceMeta", handler as EventListener);
  }, []);

  // Detect buttons that look like “Generate invoice”
  React.useEffect(() => {
    const scope = wrapperRef.current;
    if (!scope) return;
    const onClick = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const btn = el.closest("button, a, [role='button']") as HTMLElement | null;
      if (!btn || !scope.contains(btn)) return;
      const text = (btn.textContent || "").toLowerCase();
      if (
        text.includes("generate invoice") ||
        text.includes("generate invoice & receipt") ||
        text.includes("create invoice") ||
        text.includes("build invoice")
      ) {
        setHasGenerated(true);
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Ensure invoiceRoot can position children (not required now that we render static, but harmless)
  React.useEffect(() => {
    if (!invoiceRoot) return;
    const before = getComputedStyle(invoiceRoot).position;
    if (before === "static") invoiceRoot.style.position = "relative";
    return () => {
      if (invoiceRoot && before === "static") invoiceRoot.style.position = "";
    };
  }, [invoiceRoot]);

  const shouldRenderInside =
    hasGenerated && (notes.trim() || (autoBank && DEFAULT_BANK_DETAILS) || terms.trim());

  /** The actual section that will be *part of the invoice content* (static block at the bottom) */
  const staticTermsBlock = (
    <section
      // Unique marker so we don’t accidentally duplicate
      data-bridgeocean-terms-block
      className="mt-8 rounded-md border border-slate-200 bg-white p-4 text-[12px] leading-relaxed"
      style={{ breakInside: "avoid" }} // helps PDF engines keep it together
    >
      <h4 className="mb-1 text-sm font-semibold">Terms &amp; Payment details</h4>
      <pre className="whitespace-pre-wrap text-slate-700">
{(autoBank && !terms.trim()) ? DEFAULT_BANK_DETAILS : terms.trim()}
      </pre>

      {notes.trim() && (
        <>
          <h4 className="mt-3 mb-1 text-sm font-semibold">Notes</h4>
          <pre className="whitespace-pre-wrap text-slate-700">
{notes.trim()}
          </pre>
        </>
      )}
    </section>
  );

  return (
    <div ref={wrapperRef} className="space-y-8">
      {/* Your existing WhatsApp → AI → Invoice generator (unchanged) */}
      <AIInvoiceGenerator />

      {/* Controls for Notes/Terms */}
      <section className="rounded-lg border border-slate-200 p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
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
          After you click <em>Generate Invoice</em>, this section is injected at the very bottom of
          the invoice document so it appears in preview and in downloaded HTML/PDF.
        </p>
      </section>

      {/* Mount as a NORMAL block at the bottom of the invoice content */}
      {shouldRenderInside &&
        (invoiceRoot
          ? ReactDOM.createPortal(staticTermsBlock, invoiceRoot)
          : (
            // Fallback: if we couldn't detect the invoice root, render below generator
            <div>{staticTermsBlock}</div>
          ))}
    </div>
  );
}
