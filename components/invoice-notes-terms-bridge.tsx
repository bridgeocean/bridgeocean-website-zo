"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AIInvoiceGenerator } from "@/components/ai-invoice-generator";

/** Prefill used when “Auto-insert” is checked */
const DEFAULT_BANK_DETAILS = `Zenith Bank Account (preferred)
Zenith Account number: 1229647858
Bridgeocean Limited

Moniepoint Account details
Moniepoint Account number: 8135261568
Bridgeocean Limited`;

export function InvoiceNotesTermsBridge() {
  // Notes & Terms UI
  const [notes, setNotes] = React.useState<string>("");
  const [terms, setTerms] = React.useState<string>("");
  const [autoBank, setAutoBank] = React.useState<boolean>(true);

  // Allow your AI (Groq/Grok/OpenAI/etc.) to prefill via:
  // window.dispatchEvent(new CustomEvent("bridgeocean:setInvoiceMeta", { detail: { notes, terms } }))
  React.useEffect(() => {
    const handler = (e: Event) => {
      const { notes: n, terms: t } = (e as CustomEvent).detail || {};
      if (typeof n === "string") setNotes(n);
      if (typeof t === "string") { setTerms(t); setAutoBank(false); }
    };
    window.addEventListener("bridgeocean:setInvoiceMeta", handler as EventListener);
    return () => window.removeEventListener("bridgeocean:setInvoiceMeta", handler as EventListener);
  }, []);

  const effectiveTerms =
    (autoBank && !terms.trim()) ? DEFAULT_BANK_DETAILS : terms.trim();

  return (
    <div className="space-y-8">
      {/* Your existing generator now receives Notes/Terms/AutoBank as props */}
      <AIInvoiceGenerator
        notes={notes}
        terms={effectiveTerms}
        autoBank={autoBank}
      />

      {/* Notes & Terms panel (simple, separate from the invoice content) */}
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
                if (checked && !terms.trim()) {
                  // nothing to do; AIInvoiceGenerator will receive default via props
                }
                if (!checked && !terms.trim()) {
                  // user turned auto off; leave empty so they can type their own
                  setTerms("");
                }
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
              onChange={(e) => { setTerms(e.target.value); if (e.target.value.trim()) { /* stop auto */ } }}
              placeholder="Payment terms, deadlines, methods. Bank details can live here."
              className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={5}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTerms("")}
              >
                Clear Terms (use auto if checked)
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          The invoice preview and the downloaded HTML will include these Terms/Notes.
        </p>
      </section>
    </div>
  );
}
