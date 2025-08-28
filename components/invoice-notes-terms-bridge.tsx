"use client";

import * as React from "react";
import { AIInvoiceGenerator } from "@/components/ai-invoice-generator";
import { Button } from "@/components/ui/button";

/** Default bank details go here (pre-fills "Terms & Payment details") */
const DEFAULT_BANK_DETAILS = `Zenith Bank Account (preferred)
Zenith Account number: 1229647858
Bridgeocean Limited

Moniepoint Account details
Moniepoint Account number: 8135261568
Bridgeocean Limited`;

function appendNotesTermsToWaUrl(url: string, notes: string, terms: string) {
  try {
    const u = new URL(url);
    if (u.hostname !== "wa.me") return url;
    const text = u.searchParams.get("text") || "";
    const base = decodeURIComponent(text);

    const add: string[] = [];
    if (notes.trim()) add.push(`\n\nNotes:\n${notes.trim()}`);
    if (terms.trim()) add.push(`\n\nTerms & Payment Details:\n${terms.trim()}`);

    if (add.length === 0) return url;

    const merged = base + add.join("");
    u.searchParams.set("text", encodeURIComponent(merged));
    return u.toString();
  } catch {
    return url;
  }
}

export function InvoiceNotesTermsBridge() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Notes & Terms states
  const [notes, setNotes] = React.useState<string>("");
  const [terms, setTerms] = React.useState<string>(DEFAULT_BANK_DETAILS);
  const [autoBank, setAutoBank] = React.useState<boolean>(true);

  // Keep a stable reference to original window.open and patch it while this component is mounted
  React.useEffect(() => {
    const originalOpen = window.open;

    window.open = function patchedOpen(
      url?: string | URL,
      target?: string,
      features?: string
    ) {
      let finalUrl = url?.toString() ?? "";
      if (finalUrl.startsWith("https://wa.me/") && finalUrl.includes("text=")) {
        finalUrl = appendNotesTermsToWaUrl(finalUrl, notes, terms);
      }
      return originalOpen.call(window, finalUrl, target, features) as Window | null;
    };

    // Intercept <a href="https://wa.me/?text=..."> clicks inside this wrapper
    const onClickCapture = (e: Event) => {
      const root = containerRef.current;
      if (!root) return;
      const target = e.target as Element | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor || !root.contains(anchor)) return;

      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("https://wa.me/") || !href.includes("text=")) return;

      e.preventDefault();
      e.stopPropagation();
      const patched = appendNotesTermsToWaUrl(href, notes, terms);
      // open in same way user intended
      const t = anchor.getAttribute("target") || "_blank";
      const rel = anchor.getAttribute("rel") || "";
      // If it wanted a new tab, mimic that
      if (t === "_blank" || rel.includes("noopener")) {
        window.open(patched, "_blank");
      } else {
        window.location.href = patched;
      }
    };

    document.addEventListener("click", onClickCapture, true);

    // Cleanup: restore original open and listener
    return () => {
      window.open = originalOpen;
      document.removeEventListener("click", onClickCapture, true);
    };
  }, [notes, terms]);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Your existing AI-driven generator */}
      <AIInvoiceGenerator />

      {/* NEW: Notes & Terms panel that gets auto-appended to WhatsApp messages */}
      <section className="rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
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
          will be automatically appended to the message. No extra steps needed.
        </p>
      </section>
    </div>
  );
}
