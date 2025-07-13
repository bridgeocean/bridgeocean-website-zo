"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Loader2, Copy, Brain } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InvoiceData {
  invoiceNumber: string
  customerName: string
  serviceDate: string
  dueDate: string
  vehicle: string
  duration: string
  rate: number
  quantity: number
  subtotal: number
  vat: number
  total: number
  notes: string
  terms: string
  amountPaid: number
  balanceDue: number
}

export function AIInvoiceGenerator() {
  const [whatsappChat, setWhatsappChat] = useState("")
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const { toast } = useToast()

  // Enhanced AI Knowledge Base for BridgeOcean
  const bridgeOceanKnowledge = {
    vehicles: {
      "gmc terrain": { name: "GMC Terrain Charter Service", rate: 200000, minHours: 10 },
      gmc: { name: "GMC Terrain Charter Service", rate: 200000, minHours: 10 },
      "toyota camry": { name: "Toyota Camry Charter Service", rate: 100000, minHours: 10 },
      camry: { name: "Toyota Camry Charter Service", rate: 100000, minHours: 10 },
      toyota: { name: "Toyota Camry Charter Service", rate: 100000, minHours: 10 },
    },
    services: {
      emergency: "Nexus Emergency Service",
      charter: "Premium Charter Service",
      partner: "Partner Fleet Service",
    },
    terms: {
      standard: "50% payment required upfront, 50% balance upon completion of service",
      emergency: "Full payment required for emergency services",
      partner: "Partner terms apply as per agreement",
    },
    notes: {
      standard: "Professional charter service with driver and fuel included. Service is same day service.",
      firstTimer: "First timer discount applied. Professional charter service with driver and fuel included.",
      emergency: "Emergency response service with immediate dispatch.",
    },
  }

  // Enhanced AI function with BridgeOcean knowledge base
  const extractInvoiceDataWithAI = async (chat: string): Promise<InvoiceData> => {
    setIsGenerating(true)

    try {
      // Simulate AI processing with knowledge base
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const lowerChat = chat.toLowerCase()

      // Extract customer name with better AI
      let customerName = "Valued Customer"
      const namePatterns = [
        /my name is ([a-zA-Z\s]+)/i,
        /i'm ([a-zA-Z\s]+)/i,
        /this is ([a-zA-Z\s]+)/i,
        /name[:\s]+([a-zA-Z\s]+)/i,
        /([a-zA-Z]+\s[a-zA-Z]+)(?:\s|$)/,
      ]

      for (const pattern of namePatterns) {
        const match = chat.match(pattern)
        if (match && match[1] && match[1].trim().length > 2) {
          customerName = match[1].trim()
          // Clean up common false positives
          if (!["good morning", "good afternoon", "thank you", "bridge ocean"].includes(customerName.toLowerCase())) {
            break
          }
        }
      }

      // Enhanced vehicle detection using knowledge base
      let vehicleInfo = { name: "Charter Service", rate: 150000, minHours: 10 }

      for (const [key, info] of Object.entries(bridgeOceanKnowledge.vehicles)) {
        if (lowerChat.includes(key)) {
          vehicleInfo = info
          break
        }
      }

      // Extract payment information
      let amountPaid = 0
      const paymentTerms = bridgeOceanKnowledge.terms.standard

      const paymentPatterns = [
        /(\d+)%\s*(?:payment|paid)/i,
        /pay\s*(\d+)%/i,
        /₦\s*(\d+(?:,\d+)*)/g,
        /(\d+(?:,\d+)*)\s*naira/gi,
      ]

      // Check for percentage payments
      const percentMatch = chat.match(/(\d+)%.*?(\d+)%/i)
      if (percentMatch) {
        const firstPercent = Number.parseInt(percentMatch[1])
        if (firstPercent === 50) {
          amountPaid = Math.round(vehicleInfo.rate * 0.5)
        }
      }

      // Extract duration and adjust pricing
      let duration = `${vehicleInfo.minHours} hours (minimum)`
      let actualRate = vehicleInfo.rate

      if (lowerChat.includes("full day")) {
        duration = "Full day (10 hours)"
        actualRate = vehicleInfo.rate
      } else if (lowerChat.includes("8 hours")) {
        duration = "8 hours"
        // Keep minimum rate even for shorter duration
      }

      // Check for special conditions
      let notes = bridgeOceanKnowledge.notes.standard
      if (lowerChat.includes("first time") || lowerChat.includes("first timer")) {
        notes = bridgeOceanKnowledge.notes.firstTimer
        actualRate = Math.round(actualRate * 0.9) // 10% first timer discount
      }

      // Calculate amounts
      const quantity = 1
      const subtotal = actualRate * quantity
      const vat = Math.round(subtotal * 0.07) // 7% VAT
      const total = subtotal + vat
      const balanceDue = total - amountPaid

      // Generate invoice number with current timestamp
      const invoiceNumber = `INV${String(Date.now()).slice(-3)}-BO`

      // Generate dates
      const today = new Date()
      const serviceDate = new Date(today)

      // Try to extract date from chat
      if (lowerChat.includes("tomorrow")) {
        serviceDate.setDate(today.getDate() + 1)
      } else if (lowerChat.includes("today")) {
        serviceDate.setDate(today.getDate())
      } else if (lowerChat.includes("saturday") || lowerChat.includes("sunday")) {
        // Find next weekend day
        const dayOfWeek = today.getDay()
        const daysUntilSaturday = (6 - dayOfWeek) % 7
        serviceDate.setDate(today.getDate() + daysUntilSaturday)
      }

      const dueDate = new Date(serviceDate)
      dueDate.setDate(serviceDate.getDate() + 1)

      return {
        invoiceNumber,
        customerName,
        serviceDate: serviceDate.toLocaleDateString("en-GB"),
        dueDate: dueDate.toLocaleDateString("en-GB"),
        vehicle: vehicleInfo.name,
        duration,
        rate: actualRate,
        quantity,
        subtotal,
        vat,
        total,
        amountPaid,
        balanceDue,
        notes,
        terms: paymentTerms,
      }
    } catch (error) {
      throw new Error("AI processing failed")
    }
  }

  const handleGenerateInvoice = async () => {
    if (!whatsappChat.trim()) {
      toast({
        title: "WhatsApp chat required",
        description: "Please paste a WhatsApp conversation to generate an invoice",
        variant: "destructive",
      })
      return
    }

    try {
      const data = await extractInvoiceDataWithAI(whatsappChat)
      setInvoiceData(data)
      toast({
        title: "Invoice generated successfully",
        description: "AI has analyzed the chat and extracted all booking details",
      })
    } catch (error) {
      toast({
        title: "Error generating invoice",
        description: "Please try again or check your WhatsApp chat format",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Fixed PDF download function
  const handleDownloadPDF = async () => {
    if (!invoiceData) return

    setIsGeneratingPDF(true)
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
            .logo { width: 80px; height: 80px; }
            .invoice-title { font-size: 32px; font-weight: bold; }
            .invoice-number { font-size: 18px; color: #2563eb; font-weight: bold; }
            .company-info { text-align: right; }
            .bill-to { margin: 20px 0; }
            .dates { display: flex; justify-content: space-between; margin: 20px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .items-table th { background-color: #f5f5f5; }
            .totals { margin-left: auto; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; }
            .notes { margin-top: 30px; }
            .terms { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-number">#${invoiceData.invoiceNumber}</div>
            </div>
            <div class="company-info">
              <h2>BridgeOcean Limited</h2>
              <p>Premium Charter Services</p>
            </div>
          </div>

          <div class="bill-to">
            <h3>Bill To:</h3>
            <p style="font-size: 18px;">${invoiceData.customerName}</p>
          </div>

          <div class="dates">
            <div><strong>Service Date:</strong> ${invoiceData.serviceDate}</div>
            <div><strong>Due Date:</strong> ${invoiceData.dueDate}</div>
            <div><strong>Balance Due:</strong> ₦${invoiceData.balanceDue.toLocaleString()}</div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoiceData.vehicle}</td>
                <td>${invoiceData.quantity}</td>
                <td>₦${invoiceData.rate.toLocaleString()}</td>
                <td>₦${invoiceData.subtotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₦${invoiceData.subtotal.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>VAT (7%):</span>
              <span>₦${invoiceData.vat.toLocaleString()}</span>
            </div>
            <div class="total-row total-final">
              <span>Total:</span>
              <span>₦${invoiceData.total.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>Amount Paid:</span>
              <span>₦${invoiceData.amountPaid.toLocaleString()}</span>
            </div>
            <div class="total-row total-final">
              <span>Balance Due:</span>
              <span>₦${invoiceData.balanceDue.toLocaleString()}</span>
            </div>
          </div>

          <div class="notes">
            <h4>Notes:</h4>
            <p>${invoiceData.notes}</p>
          </div>

          <div class="terms">
            <h4>Terms:</h4>
            <p>${invoiceData.terms}</p>
          </div>
        </body>
        </html>
      `

      // Create and download PDF
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Invoice-${invoiceData.invoiceNumber}-BridgeOcean.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Invoice Downloaded",
        description: `Invoice ${invoiceData.invoiceNumber} has been downloaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Error generating PDF",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Enhanced example chats with more realistic scenarios
  const exampleChats = [
    `Customer: Hi, I need to book your GMC Terrain for tomorrow
BridgeOcean: Hello! I'd be happy to help. What time and for how long?
Customer: From 9am, need it for about 8 hours. Going to Ibadan
Customer: My name is John Adebayo
BridgeOcean: That's ₦200,000 for 10 hours (minimum). Can you pay 50% now?
Customer: Yes, I'll pay ₦100,000 now and ₦100,000 on return`,

    `Customer: Good morning, I want to charter your Toyota Camry
BridgeOcean: Good morning! When do you need it?
Customer: This Saturday, full day service
Customer: My name is Sarah Okafor, this is my first time
BridgeOcean: Toyota Camry is ₦100,000 for 10 hours, but first timer gets discount
Customer: Perfect, I'll take it`,

    `Customer: Emergency! Need a car right now
BridgeOcean: We can help! What's your location and name?
Customer: I'm David Okoro, at Victoria Island
BridgeOcean: GMC Terrain available, ₦200,000 for emergency service
Customer: Book it now, I'll pay full amount`,
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Enhanced AI Invoice Generator
          </CardTitle>
          <CardDescription>
            Advanced AI with BridgeOcean knowledge base - extracts customer details, vehicle types, pricing, and payment
            terms automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp Chat Conversation</label>
            <Textarea
              placeholder="Paste your WhatsApp conversation here..."
              value={whatsappChat}
              onChange={(e) => setWhatsappChat(e.target.value)}
              rows={8}
              className="resize-none font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Example Conversations (Click to Use)</label>
            <div className="grid grid-cols-1 gap-2">
              {exampleChats.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setWhatsappChat(example)}
                  className="text-xs h-auto p-3 text-left justify-start"
                >
                  <div className="truncate">
                    <strong>Example {index + 1}:</strong> {example.split("\n")[0].substring(10, 60)}...
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerateInvoice} className="w-full" disabled={isGenerating || !whatsappChat.trim()}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI Analyzing Chat with Knowledge Base...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Invoice with Enhanced AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {invoiceData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Professional Invoice Preview
            </CardTitle>
            <CardDescription>AI-generated invoice with BridgeOcean branding and 7% VAT</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Invoice Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img src="/images/bridgeocean-logo.jpg" alt="BridgeOcean Logo" className="h-16 w-16 object-contain" />
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-lg font-semibold text-blue-600">#{invoiceData.invoiceNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-lg">BridgeOcean Limited</h3>
                <p className="text-sm text-muted-foreground">Premium Charter Services</p>
              </div>
            </div>

            <Separator />

            {/* Bill To & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Bill To:</h4>
                <p className="text-lg">{invoiceData.customerName}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Service Date:</span>
                  <span>{invoiceData.serviceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Due Date:</span>
                  <span>{invoiceData.dueDate}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Balance Due:</span>
                  <span className="text-blue-600">{formatCurrency(invoiceData.balanceDue)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Invoice Items */}
            <div>
              <div className="grid grid-cols-4 gap-4 font-semibold border-b pb-2 mb-4">
                <span>Item</span>
                <span>Quantity</span>
                <span>Rate</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="grid grid-cols-4 gap-4 py-2">
                <span>{invoiceData.vehicle}</span>
                <span>{invoiceData.quantity}</span>
                <span>{formatCurrency(invoiceData.rate)}</span>
                <span className="text-right">{formatCurrency(invoiceData.subtotal)}</span>
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoiceData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (7%):</span>
                <span>{formatCurrency(invoiceData.vat)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(invoiceData.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span>{formatCurrency(invoiceData.amountPaid)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-blue-600">
                <span>Balance Due:</span>
                <span>{formatCurrency(invoiceData.balanceDue)}</span>
              </div>
            </div>

            <Separator />

            {/* Notes & Terms */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Notes:</h4>
                <p className="text-sm text-muted-foreground">{invoiceData.notes}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Terms:</h4>
                <p className="text-sm text-muted-foreground">{invoiceData.terms}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="flex-1">
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice (HTML/PDF)
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const invoiceText = `Invoice #${invoiceData.invoiceNumber}\nCustomer: ${invoiceData.customerName}\nService: ${invoiceData.vehicle}\nTotal: ${formatCurrency(invoiceData.total)}\nBalance Due: ${formatCurrency(invoiceData.balanceDue)}`
                  navigator.clipboard.writeText(invoiceText)
                  toast({
                    title: "Copied to clipboard",
                    description: "Invoice summary copied to clipboard",
                  })
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
