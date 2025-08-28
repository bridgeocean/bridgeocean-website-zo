// app/communications/invoice/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceNotesTermsBridge } from "@/components/invoice-notes-terms-bridge";

export const metadata = {
  title: "AI Invoice Generator — Bridgeocean",
  description: "Generate professional invoices from WhatsApp conversations using AI",
};

export default function InvoicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-3">
          <Link href="/admin-dashboard" prefetch={false}>
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">AI Invoice Generator</h1>
        </div>
      </header>

      <main className="container flex-1 px-4 py-8 md:px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">AI Invoice Generator</h2>
        </div>

        {/* NEW: Wrapper that renders your existing AI generator AND
            adds Notes/Terms + WhatsApp interception (no changes to your component) */}
        <InvoiceNotesTermsBridge />
      </main>
    </div>
  );
}
