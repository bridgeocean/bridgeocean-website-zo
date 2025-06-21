"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, ExternalLink } from "lucide-react"

export function WhatsAppIntegration() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")

  const businessNumbers = [
    { number: "+234 906 918 3165", label: "Primary Business Line", formatted: "2349069183165" },
    { number: "+234 913 563 0154", label: "Secondary Business Line", formatted: "2349135630154" },
  ]

  // Format phone number (remove spaces, add country code if needed)
  const formatPhoneNumber = (phone: string) => {
    let formatted = phone.replace(/\s+/g, "").replace(/[^\d+]/g, "")

    // Add Nigeria country code if no country code present
    if (!formatted.startsWith("+") && !formatted.startsWith("234")) {
      if (formatted.startsWith("0")) {
        formatted = "234" + formatted.substring(1)
      } else {
        formatted = "234" + formatted
      }
    }

    return formatted.replace("+", "")
  }

  // Send message via WhatsApp Web
  const sendWhatsAppMessage = () => {
    if (!phoneNumber || !message) {
      alert("Please enter both phone number and message")
      return
    }

    const formattedPhone = formatPhoneNumber(phoneNumber)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank")

    // Clear form
    setPhoneNumber("")
    setMessage("")
  }

  // Quick message templates
  const getQuickMessage = (type: string) => {
    const templates = {
      emergency: `🚨 EMERGENCY ALERT from BridgeOcean Nexus

This is an urgent message regarding emergency logistics coordination. Please respond immediately.

Contact: +234 906 918 3165
Email: bridgeocean@cyberservices.com`,

      booking: `🚗 BridgeOcean Charter Services

Thank you for your interest in our premium charter services. 

Our fleet includes:
- Toyota Camry (2006) - ₦100,000 per 10 hours
- GMC Terrain (2011) - ₦200,000 per 10 hours

Driver and full tank petrol comes with the price.

To book or get more information:
📞 +234 906 918 3165
🌐 Visit bridgeocean.xyz

Best regards,
BridgeOcean Team`,

      driver: `👨‍💼 BridgeOcean Partner Application

Hello! Thank you for your interest in becoming a BridgeOcean partner.

Please ensure you have:
✅ Valid means of identification
✅ Proof of insurance
✅ Vehicle registration
✅ Vehicle photos

Visit: bridgeocean.xyz/charter/partner
Contact us: +234 906 918 3165
Email: bridgeocean@cyberservices.com`,

      nexus: `🛰️ Nexus Emergency Logistics

Emergency coordination update from BridgeOcean Nexus platform.

Our satellite-powered routing system is coordinating your emergency response.

For immediate assistance: +234 906 918 3165
Emergency hotline: Available 24/7`,
    }
    return templates[type as keyof typeof templates] || ""
  }

  return (
    <div className="space-y-6">
      {/* Quick Send Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Send WhatsApp Message
          </CardTitle>
          <CardDescription>Send messages directly through WhatsApp Web</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="e.g., +234 813 526 1568 or 08135261568"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter with or without country code (Nigeria +234 will be added automatically)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <Button onClick={sendWhatsAppMessage} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send via WhatsApp
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Message Templates</CardTitle>
          <CardDescription>Pre-written messages for common scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setMessage(getQuickMessage("emergency"))}
              className="justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="font-semibold">🚨 Emergency Alert</div>
                <div className="text-xs text-muted-foreground">Nexus emergency coordination</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => setMessage(getQuickMessage("booking"))}
              className="justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="font-semibold">🚗 Charter Booking</div>
                <div className="text-xs text-muted-foreground">Fleet information & booking</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => setMessage(getQuickMessage("driver"))}
              className="justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="font-semibold">👨‍💼 Partner Application</div>
                <div className="text-xs text-muted-foreground">Partner registration info</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => setMessage(getQuickMessage("nexus"))}
              className="justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="font-semibold">🛰️ Nexus Update</div>
                <div className="text-xs text-muted-foreground">Satellite-powered coordination</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Numbers */}
      <Card>
        <CardHeader>
          <CardTitle>Business WhatsApp Numbers</CardTitle>
          <CardDescription>Quick access to your business WhatsApp accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {businessNumbers.map((business) => (
            <div key={business.number} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{business.number}</div>
                <div className="text-sm text-muted-foreground">{business.label}</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`https://wa.me/${business.formatted}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
