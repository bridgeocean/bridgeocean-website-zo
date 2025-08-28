"use client";

import * as React from "react";
import { AIInvoiceGenerator } from "@/components/ai-invoice-generator";
import { Button } from "@/components/ui/button";

/** Default bank details (prefills Terms & Payment details) */
const DEFAULT_BANK_DETAILS = `Zenith Bank Account (preferred)
Zenith Account number: 1229647858
Bridgeocean Limited

Moniepoint Account details
Moniepoint Account number: 8135261568
Bridgeocean Limited`;

/** Safely append Notes/Terms to WhatsApp share URLs */
function appendNotesTermsToUrl(url: string, notes: string, terms: string) {
  try {
    const u = new URL(url);
    const isWa =
      u.hostname === "wa.me" ||
      (u.hostname === "api.whatsapp.com" && u.pathname === "/send");
    if (!isWa) return url;

    const original = u.searchParams.get("text") ?? ""; // already decoded by URLSearchParams
    let merged = original;

    const extra: string[] = [];
    if (notes.trim()) extra.push(`\n\nNotes:\n${notes.trim()}`);
    if (terms.trim()) extra.push(`\n\nTerms & Payment Details:\n${terms.trim()}`);
    if (extra.length === 0) return url;

    merged += extra.join("");
    u.searchParams.set("text", merged); // URL will encode when stringified
    return u.toString();
  } catch {
    return url;
  }
}

export function InvoiceNotesTermsBridge() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Notes & Terms state
  const [notes, setNotes] = React.useState<string>("");
  const [terms, setTerms] = React.useState<string>(DEFAULT_BANK_DETAILS);
  const [autoBank, setAutoBank] = React.useState<boolean>(true);

  /** Allow your AI (Groq/OpenAI/etc.) to populate Notes/Terms from chat
   *  by dispatching:
   *  window.dispatchEvent(new CustomEvent("bridgeocean:setInvoiceMeta", { detail: { notes, terms } }));
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

  // Patch window.open while mounted, so any wa.me share will get Notes/Terms appended
  React.useEffect(() => {
    const originalOpen = window.open;
    window.open = function patchedOpen(url?: string | URL, target?: string, features?: string) {
      const str = url?.toString() ?? "";
      const patched = appendNotesTermsToUrl(str, notes, terms);
      return originalOpen.call(window, patched, target, features) as Window | null;
    };

    // Intercept anchor clicks within this component (links and buttons your generator renders)
    const onClickCapture = (e: Event) => {
      const root = containerRef.current;
      if (!root) return;
      const el = e.target as Element | null;
      const a = el?.closest("a") as HTMLAnchorElement | null;
      if (!a || !root.contains(a)) return;

      const href = a.getAttribute("href") || "";
      if (!href) return;

      const patched = appendNotesTermsToUrl(href, notes, terms);
      if (patched === href) return; // not a WA link

      e.preventDefault();
      e.stopPropagation();

      const tgt = a.getAttribute("target") || "_blank";
      if (tgt === "_self") {
        window.location.href = patched;
      } else {
        window.open(patched, tgt);
      }
    };

    document.addEventListener("click", onClickCapture, true);
    return () => {
      window.open = originalOpen;
      document.removeEventListener("click", onClickCapture, true);
    };
  }, [notes, terms]);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Your existing AI-driven WhatsApp → invoice generator */}
      <AIInvoiceGenerator />

      {/* Notes & Terms panel */}
      <section className="rounded-lg border border-slate-200 p-4">
        <div className="mb-2 flex items-center justify-between">
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
          When you tap <em>Share via WhatsApp</em> in the invoice generator, these Notes &amp; Terms
          will be automatically appended to the message.
        </p>
      </section>
    </div>
  );
}
