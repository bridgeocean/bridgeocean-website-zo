import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AIInvoiceGenerator } from "@/components/ai-invoice-generator"

export default function InvoicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/admin-dashboard">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">AI Invoice Generator</h1>
        </div>
      </div>

      <div className="flex-1 p-8 pt-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">AI Invoice Generator</h2>
          <p className="text-muted-foreground mt-2">
            Generate professional invoices from WhatsApp conversations using AI
          </p>
        </div>

        <AIInvoiceGenerator />
      </div>
    </div>
  )
}
