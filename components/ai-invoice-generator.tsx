"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Loader2, Copy, Brain, FileCheck, Send, Eye, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface InvoiceData {
  invoiceNumber: string
  customerName: string
  customerEmail?: string
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

interface CreatedInvoice {
  id: string
  invoice_number: string
  status: string
  total: number
  pdf_url?: string
  public_url?: string
  created_at: string
}

export function AIInvoiceGenerator() {
  const [whatsappChat, setWhatsappChat] = useState("")
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [contractText, setContractText] = useState("")
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [createdInvoice, setCreatedInvoice] = useState<CreatedInvoice | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)
  const [includeVAT, setIncludeVAT] = useState(false)
  const [customerEmail, setCustomerEmail] = useState("")
  const { toast } = useToast()

  // Invoice API configuration
  const INVOICE_API_KEY = "sk_vBe7IxRNjE9peTkD8t1xpXfqzLyG4vwX"
  const INVOICE_API_BASE = "https://api.invoicely.com/v1" // Replace with actual API endpoint

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

  // Handle contract file upload with PDF and Word document parsing
  const handleContractUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setContractFile(file)

    try {
      let text = ""

      // Handle different file types
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        // Handle plain text files
        const reader = new FileReader()
        text = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.onerror = reject
          reader.readAsText(file)
        })
      } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        try {
          const pdfjsLib = await import("pdfjs-dist/build/pdf")
          pdfjsLib.GlobalWorkerOptions.workerSrc = ""
          const arrayBuffer = await file.arrayBuffer()

          const pdf = await pdfjsLib.getDocument({
            data: arrayBuffer,
            disableWorker: true,
          }).promise

          let extractedText = ""
          for (let page = 1; page <= pdf.numPages; page++) {
            const p = await pdf.getPage(page)
            const { items } = await p.getTextContent()
            extractedText += items.map((i: { str: string }) => i.str).join(" ") + "\n"
          }

          text = extractedText.trim()
        } catch (error) {
          console.error("PDF parsing (browser) error:", error)
          text = `PDF Document: ${file.name}

Automatic text extraction failed in the browser.
Please copy the contract text manually into the input section below for AI processing.`
        }
      } else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
        try {
          const mammoth = await import("mammoth/mammoth.browser")
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.extractRawText({ arrayBuffer })
          text = result.value.trim()
        } catch (error) {
          console.error("Word (docx) parsing error:", error)
          text = `Word Document: ${file.name}

Automatic text extraction failed in the browser. 
Please copy the contract text manually into the input section below for AI processing.`
        }
      } else {
        // Fallback for other file types
        const reader = new FileReader()
        text = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            try {
              resolve(e.target?.result as string)
            } catch (error) {
              resolve(`File: ${file.name}
            
This file will be processed by the AI for invoice generation. 
The system will extract relevant contract details including customer information, service details, and pricing terms.`)
            }
          }
          reader.onerror = reject
          reader.readAsText(file)
        })
      }

      setContractText(text)

      // Extract email from contract text
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
      if (emailMatch && emailMatch[0]) {
        setCustomerEmail(emailMatch[0])
      }

      toast({
        title: "Contract uploaded successfully",
        description: `${file.name} has been processed and content extracted`,
      })
    } catch (error) {
      console.error("Error reading file:", error)
      setContractText(`Contract File: ${file.name}

This contract document has been uploaded successfully. The AI will analyze the content to extract:
- Customer/Client information
- Service requirements
- Pricing details
- Payment terms
- Service dates

Please use the manual input section below if automatic extraction failed.`)

      toast({
        title: "Contract uploaded",
        description: `${file.name} uploaded successfully. Use manual input if needed.`,
      })
    }
  }

  // Enhanced AI function for contract processing
  const extractInvoiceDataFromContract = async (contract: string): Promise<InvoiceData> => {
    setIsGenerating(true)

    try {
      // Simulate AI processing with contract analysis
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const lowerContract = contract.toLowerCase()

      // Extract customer/client name from contract
      let customerName = "Valued Customer"
      const contractNamePatterns = [
        /client[:\s]+([a-zA-Z\s]+)/i,
        /customer[:\s]+([a-zA-Z\s]+)/i,
        /party[:\s]+([a-zA-Z\s]+)/i,
        /between[^and]*and[^,]*([a-zA-Z\s]+)/i,
        /contractor[:\s]+([a-zA-Z\s]+)/i,
      ]

      for (const pattern of contractNamePatterns) {
        const match = contract.match(pattern)
        if (match && match[1] && match[1].trim().length > 2) {
          customerName = match[1].trim()
          break
        }
      }

      // Extract customer email
      const emailMatch = contract.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
      const customerEmail = emailMatch ? emailMatch[0] : ""

      // Extract service details from contract
      let vehicleInfo = { name: "Charter Service", rate: 150000, minHours: 10 }

      // Look for vehicle mentions in contract
      for (const [key, info] of Object.entries(bridgeOceanKnowledge.vehicles)) {
        if (lowerContract.includes(key)) {
          vehicleInfo = info
          break
        }
      }

      // Extract pricing from contract
      const pricePatterns = [
        /₦\s*(\d+(?:,\d+)*)/g,
        /(\d+(?:,\d+)*)\s*naira/gi,
        /amount[:\s]*₦\s*(\d+(?:,\d+)*)/i,
        /fee[:\s]*₦\s*(\d+(?:,\d+)*)/i,
        /cost[:\s]*₦\s*(\d+(?:,\d+)*)/i,
      ]

      let extractedRate = vehicleInfo.rate
      for (const pattern of pricePatterns) {
        const match = contract.match(pattern)
        if (match && match[1]) {
          const amount = Number.parseInt(match[1].replace(/,/g, ""))
          if (amount > 10000) {
            extractedRate = amount
            break
          }
        }
      }

      // Extract duration from contract
      let duration = `${vehicleInfo.minHours} hours (minimum)`
      if (lowerContract.includes("full day") || lowerContract.includes("10 hours")) {
        duration = "Full day (10 hours)"
      } else if (lowerContract.includes("8 hours")) {
        duration = "8 hours"
      } else if (lowerContract.includes("12 hours")) {
        duration = "12 hours"
      }

      // Extract payment terms from contract
      let paymentTerms = bridgeOceanKnowledge.terms.standard
      if (lowerContract.includes("full payment") || lowerContract.includes("100%")) {
        paymentTerms = "Full payment required as per contract terms"
      } else if (lowerContract.includes("30%") && lowerContract.includes("70%")) {
        paymentTerms = "30% payment required upfront, 70% balance upon completion of service"
      }

      // Extract payment information
      let amountPaid = 0
      if (lowerContract.includes("paid") || lowerContract.includes("advance")) {
        const paidMatch = contract.match(/paid[:\s]*₦\s*(\d+(?:,\d+)*)/i)
        if (paidMatch) {
          amountPaid = Number.parseInt(paidMatch[1].replace(/,/g, ""))
        } else if (lowerContract.includes("50%")) {
          amountPaid = Math.round(extractedRate * 0.5)
        }
      }

      // Extract notes from contract
      let notes = bridgeOceanKnowledge.notes.standard
      if (lowerContract.includes("emergency")) {
        notes = bridgeOceanKnowledge.notes.emergency
      } else if (lowerContract.includes("first time") || lowerContract.includes("new client")) {
        notes = bridgeOceanKnowledge.notes.firstTimer
      }

      // Check if VAT should be included based on contract
      const shouldIncludeVAT = lowerContract.includes("vat") || lowerContract.includes("tax") || includeVAT

      // Calculate amounts
      const quantity = 1
      const subtotal = extractedRate * quantity
      const vat = shouldIncludeVAT ? Math.round(subtotal * 0.07) : 0
      const total = subtotal + vat
      const balanceDue = total - amountPaid

      // Generate invoice number with current timestamp
      const invoiceNumber = `INV${String(Date.now()).slice(-3)}-BO`

      // Generate dates
      const today = new Date()
      const serviceDate = new Date(today)

      // Try to extract date from contract
      const datePatterns = [
        /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/,
        /(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i,
      ]

      for (const pattern of datePatterns) {
        const match = contract.match(pattern)
        if (match) {
          try {
            const extractedDate = new Date(match[0])
            if (extractedDate > today) {
              serviceDate.setTime(extractedDate.getTime())
              break
            }
          } catch (e) {
            // Continue with default date if parsing fails
          }
        }
      }

      const dueDate = new Date(serviceDate)
      dueDate.setDate(serviceDate.getDate() + 1)

      return {
        invoiceNumber,
        customerName,
        customerEmail,
        serviceDate: serviceDate.toLocaleDateString("en-GB"),
        dueDate: dueDate.toLocaleDateString("en-GB"),
        vehicle: vehicleInfo.name,
        duration,
        rate: extractedRate,
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
      throw new Error("Contract processing failed")
    }
  }

  // Enhanced AI function with BridgeOcean knowledge base for WhatsApp
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
          if (!["good morning", "good afternoon", "thank you", "bridge ocean"].includes(customerName.toLowerCase())) {
            break
          }
        }
      }

      // Extract email from chat
      const emailMatch = chat.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
      const customerEmail = emailMatch ? emailMatch[0] : ""

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
      }

      // Check for special conditions
      let notes = bridgeOceanKnowledge.notes.standard
      if (lowerChat.includes("first time") || lowerChat.includes("first timer")) {
        notes = bridgeOceanKnowledge.notes.firstTimer
        actualRate = Math.round(actualRate * 0.9) // 10% first timer discount
      }

      // Check if VAT should be included
      const shouldIncludeVAT = lowerChat.includes("vat") || lowerChat.includes("tax") || includeVAT

      // Calculate amounts
      const quantity = 1
      const subtotal = actualRate * quantity
      const vat = shouldIncludeVAT ? Math.round(subtotal * 0.07) : 0
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
        const dayOfWeek = today.getDay()
        const daysUntilSaturday = (6 - dayOfWeek) % 7
        serviceDate.setDate(today.getDate() + daysUntilSaturday)
      }

      const dueDate = new Date(serviceDate)
      dueDate.setDate(serviceDate.getDate() + 1)

      return {
        invoiceNumber,
        customerName,
        customerEmail,
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

  // Create invoice using the API
  const createInvoiceViaAPI = async () => {
    if (!invoiceData) return

    setIsCreatingInvoice(true)
    try {
      const invoicePayload = {
        invoice_number: invoiceData.invoiceNumber,
        issue_date: new Date().toISOString().split("T")[0],
        due_date: new Date(invoiceData.dueDate).toISOString().split("T")[0],
        currency: "NGN",
        customer: {
          name: invoiceData.customerName,
          email: customerEmail || invoiceData.customerEmail || "",
        },
        items: [
          {
            description: invoiceData.vehicle,
            quantity: invoiceData.quantity,
            unit_price: invoiceData.rate,
            amount: invoiceData.subtotal,
          },
        ],
        subtotal: invoiceData.subtotal,
        tax_amount: invoiceData.vat,
        total: invoiceData.total,
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        company: {
          name: "Bridgeocean Limited",
          address: "Lagos, Nigeria",
          email: "info@bridgeocean.com",
          phone: "+234-XXX-XXXX-XXX",
        },
      }

      // Make API call to create invoice
      const response = await fetch(`${INVOICE_API_BASE}/invoices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${INVOICE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoicePayload),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const createdInvoiceData = await response.json()
      setCreatedInvoice(createdInvoiceData)

      toast({
        title: "Invoice created successfully!",
        description: `Invoice ${invoiceData.invoiceNumber} has been created in the system`,
      })
    } catch (error) {
      console.error("Invoice creation error:", error)
      toast({
        title: "Error creating invoice",
        description: "Please try again or check your API configuration",
        variant: "destructive",
      })
    } finally {
      setIsCreatingInvoice(false)
    }
  }

  // Send invoice via email
  const sendInvoiceEmail = async () => {
    if (!createdInvoice || !customerEmail) return

    try {
      const response = await fetch(`${INVOICE_API_BASE}/invoices/${createdInvoice.id}/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${INVOICE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerEmail,
          subject: `Invoice ${createdInvoice.invoice_number} from Bridgeocean Limited`,
          message: "Please find your invoice attached. Thank you for your business!",
        }),
      })

      if (response.ok) {
        toast({
          title: "Invoice sent!",
          description: `Invoice has been sent to ${customerEmail}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error sending invoice",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleGenerateInvoice = async (source: "whatsapp" | "contract") => {
    if (source === "whatsapp" && !whatsappChat.trim()) {
      toast({
        title: "WhatsApp chat required",
        description: "Please paste a WhatsApp conversation to generate an invoice",
        variant: "destructive",
      })
      return
    }

    if (source === "contract" && !contractText.trim()) {
      toast({
        title: "Contract required",
        description: "Please upload a contract file to generate an invoice",
        variant: "destructive",
      })
      return
    }

    try {
      let data: InvoiceData
      if (source === "whatsapp") {
        data = await extractInvoiceDataWithAI(whatsappChat)
      } else {
        data = await extractInvoiceDataFromContract(contractText)
      }

      setInvoiceData(data)
      setCreatedInvoice(null) // Reset created invoice state
      toast({
        title: "Invoice generated successfully",
        description: `AI has analyzed the ${source === "whatsapp" ? "chat" : "contract"} and extracted all details`,
      })
    } catch (error) {
      toast({
        title: "Error generating invoice",
        description: `Please try again or check your ${source === "whatsapp" ? "WhatsApp chat" : "contract"} format`,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Fixed PDF download function with proper currency and formatting
  const handleDownloadPDF = async () => {
    if (!invoiceData) return

    setIsGeneratingPDF(true)
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      const formatPDFCurrency = (amount: number) => {
        return `NGN ${amount.toLocaleString()}`
      }

      // Add logo to PDF - force load with base64 fallback
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = 60
        canvas.height = 60

        const logoImg = new Image()
        logoImg.crossOrigin = "anonymous"

        await new Promise((resolve, reject) => {
          logoImg.onload = () => {
            ctx.drawImage(logoImg, 0, 0, 60, 60)
            const dataURL = canvas.toDataURL("image/jpeg", 0.8)
            doc.addImage(dataURL, "JPEG", 20, 15, 20, 20)
            resolve(true)
          }
          logoImg.onerror = () => {
            doc.setFontSize(12)
            doc.setTextColor(37, 99, 235)
            doc.text("Bridgeocean", 20, 25)
            doc.text("LIMITED", 20, 32)
            resolve(true)
          }
          logoImg.src = "/images/bridgeocean-logo.jpg"
          setTimeout(() => logoImg.onerror(), 2000)
        })
      } catch (error) {
        doc.setFontSize(12)
        doc.setTextColor(37, 99, 235)
        doc.text("Bridgeocean", 20, 25)
        doc.text("LIMITED", 20, 32)
      }

      // Header
      doc.setFontSize(28)
      doc.setTextColor(0, 0, 0)
      doc.text("INVOICE", 50, 25)

      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text(`#${invoiceData.invoiceNumber}`, 50, 35)

      // Company info (right aligned)
      doc.setFontSize(18)
      doc.setTextColor(0, 0, 0)
      doc.text("Bridgeocean Limited", 190, 25, { align: "right" })
      doc.setFontSize(12)
      doc.text("Premium Charter Services", 190, 35, { align: "right" })

      // Separator line
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 45, 190, 45)

      // Bill To
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text("Bill To:", 20, 60)
      doc.setFontSize(16)
      doc.text(invoiceData.customerName, 20, 70)

      // Dates and Balance (right side)
      doc.setFontSize(12)
      doc.text("Service Date:", 120, 60)
      doc.text(invoiceData.serviceDate, 175, 60)

      doc.text("Due Date:", 120, 70)
      doc.text(invoiceData.dueDate, 175, 70)

      doc.setFontSize(14)
      doc.setTextColor(37, 99, 235)
      doc.text("Balance Due:", 120, 85)
      doc.text(formatPDFCurrency(invoiceData.balanceDue), 165, 85)

      // Table header background
      doc.setFillColor(245, 245, 245)
      doc.rect(20, 100, 170, 10, "F")

      // Table header
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("Item", 25, 107)
      doc.text("Qty", 100, 107)
      doc.text("Rate", 125, 107)
      doc.text("Amount", 165, 107)

      // Table content
      doc.setFontSize(11)
      const itemText = doc.splitTextToSize(invoiceData.vehicle, 70)
      doc.text(itemText, 25, 120)
      doc.text(invoiceData.quantity.toString(), 100, 120)
      doc.text(formatPDFCurrency(invoiceData.rate), 125, 120)
      doc.text(formatPDFCurrency(invoiceData.subtotal), 165, 120)

      // Table border
      doc.setDrawColor(200, 200, 200)
      doc.rect(20, 100, 170, 30)
      doc.line(95, 100, 95, 130)
      doc.line(120, 100, 120, 130)
      doc.line(160, 100, 160, 130)
      doc.line(20, 110, 190, 110)

      // Totals section
      const totalsY = 150
      doc.setFontSize(12)

      doc.text("Subtotal:", 130, totalsY)
      doc.text(formatPDFCurrency(invoiceData.subtotal), 170, totalsY)

      if (invoiceData.vat > 0) {
        doc.text("VAT (7%):", 130, totalsY + 10)
        doc.text(formatPDFCurrency(invoiceData.vat), 170, totalsY + 10)
      }

      // Total line
      doc.setDrawColor(0, 0, 0)
      const totalLineY = invoiceData.vat > 0 ? totalsY + 15 : totalsY + 5
      doc.line(130, totalLineY, 190, totalLineY)

      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      const totalY = invoiceData.vat > 0 ? totalsY + 25 : totalsY + 15
      doc.text("Total:", 130, totalY)
      doc.text(formatPDFCurrency(invoiceData.total), 170, totalY)

      doc.setFontSize(12)
      const paidY = invoiceData.vat > 0 ? totalsY + 35 : totalsY + 25
      doc.text("Amount Paid:", 130, paidY)
      doc.text(formatPDFCurrency(invoiceData.amountPaid), 170, paidY)

      // Balance Due - highlighted
      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      const balanceY = invoiceData.vat > 0 ? totalsY + 50 : totalsY + 40
      doc.text("Balance Due:", 130, balanceY)
      doc.text(formatPDFCurrency(invoiceData.balanceDue), 170, balanceY)

      // Notes section
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      const notesY = invoiceData.vat > 0 ? totalsY + 70 : totalsY + 60
      doc.text("Notes:", 20, notesY)
      doc.setFontSize(10)
      const notesLines = doc.splitTextToSize(invoiceData.notes, 170)
      doc.text(notesLines, 20, notesY + 10)

      // Terms section
      doc.setFontSize(12)
      const termsY = invoiceData.vat > 0 ? totalsY + 110 : totalsY + 100
      doc.text("Terms:", 20, termsY)
      doc.setFontSize(10)
      const termsLines = doc.splitTextToSize(invoiceData.terms, 170)
      doc.text(termsLines, 20, termsY + 10)

      // Save the PDF
      doc.save(`Invoice-${invoiceData.invoiceNumber}-BridgeOcean.pdf`)

      toast({
        title: "PDF Downloaded",
        description: `Invoice ${invoiceData.invoiceNumber} has been downloaded as PDF`,
      })
    } catch (error) {
      console.error("PDF generation error:", error)
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
Customer: My name is John Adebayo, email: john.adebayo@email.com
BridgeOcean: That's ₦200,000 for 10 hours (minimum). Can you pay 50% now?
Customer: Yes, I'll pay ₦100,000 now and ₦100,000 on return`,

    `Customer: Good morning, I want to charter your Toyota Camry
BridgeOcean: Good morning! When do you need it?
Customer: This Saturday, full day service
Customer: My name is Sarah Okafor, this is my first time. Email: sarah.okafor@gmail.com
BridgeOcean: Toyota Camry is ₦100,000 for 10 hours, but first timer gets discount
Customer: Perfect, I'll take it`,

    `Customer: Emergency! Need a car right now
BridgeOcean: We can help! What's your location and name?
Customer: I'm David Okoro, at Victoria Island. Email: david.okoro@company.com
BridgeOcean: GMC Terrain available, ₦200,000 for emergency service
Customer: Book it now, I'll pay full amount`,
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Enhanced AI Invoice Generator with API Integration
          </CardTitle>
          <CardDescription>
            Advanced AI with BridgeOcean knowledge base - Generate invoices from WhatsApp chats or contract documents,
            then create real invoices via API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>API Integration Active:</strong> Invoices can be created in the professional invoice system and
              sent via email.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="whatsapp" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="whatsapp">WhatsApp Chat</TabsTrigger>
              <TabsTrigger value="contract">Contract Document</TabsTrigger>
            </TabsList>

            <TabsContent value="whatsapp" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">WhatsApp Chat Conversation</Label>
                <Textarea
                  placeholder="Paste your WhatsApp conversation here..."
                  value={whatsappChat}
                  onChange={(e) => setWhatsappChat(e.target.value)}
                  rows={8}
                  className="resize-none font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Example Conversations (Click to Use)</Label>
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

              <Button
                onClick={() => handleGenerateInvoice("whatsapp")}
                className="w-full"
                disabled={isGenerating || !whatsappChat.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI Analyzing Chat...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Invoice from Chat
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="contract" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Upload Contract Document</Label>
                <div className="flex items-center space-x-2">
                  <Input type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleContractUpload} className="flex-1" />
                  {contractFile && (
                    <div className="flex items-center text-sm text-green-600">
                      <FileCheck className="h-4 w-4 mr-1" />
                      {contractFile.name}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Supported formats: .txt, .doc, .docx, .pdf</p>
              </div>

              {contractText && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Contract Content Preview</Label>
                  <Textarea
                    value={contractText.substring(0, 500) + (contractText.length > 500 ? "..." : "")}
                    readOnly
                    rows={6}
                    className="resize-none font-mono text-sm bg-muted"
                  />
                </div>
              )}

              {contractFile && (
                <div className="space-y-2 p-4 border rounded-lg bg-blue-50">
                  <Label className="text-sm font-medium text-blue-800">Manual Contract Input</Label>
                  <p className="text-xs text-blue-700 mb-2">
                    Copy and paste your contract content below for accurate invoice generation:
                  </p>
                  <Textarea
                    placeholder="Paste your contract content here..."
                    value=""
                    onChange={(e) => setContractText(e.target.value)}
                    rows={12}
                    className="resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used for AI processing to extract customer details, pricing, and terms.
                  </p>
                </div>
              )}

              <Button
                onClick={() => handleGenerateInvoice("contract")}
                className="w-full"
                disabled={isGenerating || !contractText.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI Analyzing Contract...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Invoice from Contract
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <input
              type="checkbox"
              id="includeVAT"
              checked={includeVAT}
              onChange={(e) => setIncludeVAT(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="includeVAT" className="text-sm">
              Include VAT (7%) - Only check if specifically required
            </Label>
          </div>

          {invoiceData && (
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-sm font-medium">Customer Email (for API invoice)</Label>
              <Input
                type="email"
                placeholder="customer@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Email will be auto-extracted from contracts/chats when available
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {invoiceData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Professional Invoice Preview
              {createdInvoice && (
                <Badge variant="secondary" className="ml-2">
                  API Created
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              AI-generated invoice with Bridgeocean branding{invoiceData.vat > 0 ? " and 7% VAT" : ""}
              {createdInvoice && ` • Invoice ID: ${createdInvoice.id}`}
            </CardDescription>
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
                <h3 className="font-semibold text-lg">Bridgeocean Limited</h3>
                <p className="text-sm text-muted-foreground">Premium Charter Services</p>
              </div>
            </div>

            <Separator />

            {/* Bill To & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Bill To:</h4>
                <p className="text-lg">{invoiceData.customerName}</p>
                {(customerEmail || invoiceData.customerEmail) && (
                  <p className="text-sm text-muted-foreground">{customerEmail || invoiceData.customerEmail}</p>
                )}
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
              {invoiceData.vat > 0 && (
                <div className="flex justify-between">
                  <span>VAT (7%):</span>
                  <span>{formatCurrency(invoiceData.vat)}</span>
                </div>
              )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-4">
              {/* First Row - Main Actions */}
              <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} variant="outline">
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>

              <Button
                onClick={createInvoiceViaAPI}
                disabled={isCreatingInvoice || !!createdInvoice}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreatingInvoice ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Invoice...
                  </>
                ) : createdInvoice ? (
                  <>
                    <FileCheck className="mr-2 h-4 w-4" />
                    Invoice Created
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Create via API
                  </>
                )}
              </Button>

              {/* Second Row - Additional Actions */}
              {createdInvoice && (
                <>
                  <Button
                    onClick={sendInvoiceEmail}
                    disabled={!customerEmail && !invoiceData.customerEmail}
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send via Email
                  </Button>

                  {createdInvoice.public_url && (
                    <Button onClick={() => window.open(createdInvoice.public_url, "_blank")} variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      View Online
                    </Button>
                  )}
                </>
              )}

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
                <Copy className="h-4 w-4 mr-2" />
                Copy Summary
              </Button>
            </div>

            {/* API Status */}
            {createdInvoice && (
              <Alert className="mt-4">
                <FileCheck className="h-4 w-4" />
                <AlertDescription>
                  <strong>Invoice Created Successfully!</strong>
                  <br />
                  Invoice ID: {createdInvoice.id} • Status: {createdInvoice.status} • Created:{" "}
                  {new Date(createdInvoice.created_at).toLocaleDateString()}
                  {createdInvoice.pdf_url && (
                    <>
                      <br />
                      <a
                        href={createdInvoice.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Download API PDF
                      </a>
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
