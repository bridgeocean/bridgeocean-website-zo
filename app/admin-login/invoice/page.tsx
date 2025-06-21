import { AIInvoiceGenerator } from "@/components/ai-invoice-generator"

export default function AdminInvoicePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin: AI Invoice Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate professional invoices from WhatsApp conversations using AI knowledge base
        </p>
      </div>

      <AIInvoiceGenerator />
    </div>
  )
}
