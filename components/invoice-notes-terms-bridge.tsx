"use client";

import * as React from "react";
import { AIInvoiceGenerator } from "@/components/ai-invoice-generator";
import { Button } from "@/components/ui/button";

/**
 * DEFAULT bank details (used when "Auto-insert" is ON and Terms textarea is empty)
 */
const DEFAULT_BANK_DETAILS = `Zenith Bank Account (preferred)
Zenith Account number: 1229647858
Bridgeocean Limited

Moniepoint Account details
Moniepoint Account number: 8135261568
Bridgeocean Limited`;

/**
 * Safely inject a Terms/Notes section before </body> in any HTML string.
 * We use this to modify the HTML at download-time so the file matches your preview.
 */
function injectTermsIntoHtml(html: string, terms: string, notes: string): string {
  const hasTerms = terms.trim().length > 0;
  const hasNotes = notes.trim().length > 0;
  if (!hasTerms && !hasNotes) return html;

  const esc = (s: string) =>
    s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));

  const section = `
<style>
  .bo-terms { margin-top: 28px; font-family: Arial, sans-serif; }
  .bo-terms h4 { margin: 14px 0 6px; font-size: 14px; }
  .bo-terms pre { white-space: pre-wrap; font-size: 13px; line-height: 1.45; color:#111; }
</style>
<div class="bo-terms">
  ${hasTerms ? `<h4>Terms &amp; Payment details</h4><pre>${esc(terms.trim())}</pre>` : ""}
  ${hasNotes ? `<h4>Notes</h4><pre>${esc(notes.trim())}</pre>` : ""}
</div>`.trim();

  const i = html.lastIndexOf("</body>");
  if (i !== -1) return html.slice(0, i) + section + "\n</body>" + html.slice(i + 7);
  return html + section;
}

/**
 * We intercept the creation of the *Invoice* HTML file (Blob)
 * and inject the Terms/Notes into it – WITHOUT touching your generator code.
 *
 * Strategy:
 * 1) When the user clicks the button whose text contains "Download Invoice (HTML)",
 *    we arm a one-shot interceptor.
 * 2) We monkey-patch window.Blob so the NEXT created text/html blob gets rewritten.
 *    (This is synchronous because generators usually do: new Blob([html], {type:'text/html'}) )
 */
export function InvoiceNotesTermsBridge() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // UI state
  const [notes, setNotes] = React.useState("");
  const [terms, setTerms] = React.useState(DEFAULT_BANK_DETAILS);
  const [autoBank, setAutoBank] = React.useState(true);

  // one-shot download interception context
  const interceptRef = React.useRef<{ terms: string; notes: string } | null>(null);

  // Patch Blob ONCE to allow HTML rewriting when armed
  React.useEffect(() => {
    const OriginalBlob = window.Blob;

    const PatchedBlob = function (parts: any[], options?: BlobPropertyBag) {
      try {
        const isHtml =
          options &&
          typeof options.type === "string" &&
          options.type.toLowerCase().includes("text/html");

        // Only modify IF: we are armed for invoice AND this blob is text/html
        if (isHtml && interceptRef.current) {
          // Join string parts we can see (typical generators pass [htmlString])
          let html = "";
          for (const p of parts) {
            if (typeof p === "string") html += p;
            else if (p instanceof ArrayBuffer) {
              html += new TextDecoder().decode(new Uint8Array(p));
            }
            // If a part is a Blob, we can't sync-read it. In practice, most code passes a string.
          }

          if (html) {
            const ctx = interceptRef.current;
            interceptRef.current = null; // one-shot
            const injected = injectTermsIntoHtml(html, ctx.terms, ctx.notes);
            return new (OriginalBlob as any)([injected], options);
          }
        }
      } catch {
        // fall through to original
      }
      return new (OriginalBlob as any)(parts, options);
    } as unknown as typeof Blob;

    (PatchedBlob as any).prototype = (OriginalBlob as any).prototype;
    // @ts-expect-error – reassigning for interception
    window.Blob = PatchedBlob;

    return () => {
      // @ts-expect-error – restore original
      window.Blob = OriginalBlob;
    };
  }, []);

  // Arm the interceptor ONLY for "Download Invoice (HTML)" clicks within this wrapper
  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const onClick = (e: Event) => {
      const el = e.target as HTMLElement | null;
      const btn = el?.closest("button, a, [role='button']") as HTMLElement | null;
      if (!btn || !root.contains(btn)) return;

      const label = (btn.textContent || "").toLowerCase();
      if (label.includes("download invoice") && label.includes("html")) {
        const effectiveTerms = (autoBank && !terms.trim())
          ? DEFAULT_BANK_DETAILS
          : terms.trim();
        interceptRef.current = {
          terms: effectiveTerms,
          notes: notes.trim(),
        };
        // (Optional) auto-clear after 2 seconds if the generator never created a blob
        setTimeout(() => {
          interceptRef.current = null;
        }, 2000);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [notes, terms, autoBank]);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Your existing generator – unchanged */}
      <AIInvoiceGenerator />

      {/* Notes & Terms panel (exactly like your screenshot) */}
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
          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any relevant information not already covered…"
              className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={8}
            />
          </div>

          {/* Terms */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Terms &amp; Payment details
            </label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Payment terms, deadlines, methods. Bank details can live here."
              className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={8}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTerms(DEFAULT_BANK_DETAILS)}
              >
                Reset to Bridgeocean bank details
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  const snippet =
                    (notes.trim() ? `Notes:\n${notes.trim()}\n\n` : "") +
                    (terms.trim()
                      ? `Terms & Payment Details:\n${terms.trim()}`
                      : "");
                  if (!snippet) return;
                  try {
                    await navigator.clipboard.writeText(snippet);
                    alert("Notes & Terms copied to clipboard.");
                  } catch {
                    alert("Copy failed. Select text and copy manually.");
                  }
                }}
              >
                Copy Notes & Terms
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          After you click <em>Download Invoice (HTML)</em>, these Terms/Notes are injected into the
          file automatically. No changes to your generator or Grok/WhatsApp flow.
        </p>
      </section>
    </div>
  );
}
