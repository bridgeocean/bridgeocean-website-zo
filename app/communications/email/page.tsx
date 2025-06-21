"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Paperclip, Send } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

const emailTemplates = {
  candidateScreening: {
    name: "Candidate Screening Email",
    subject: "Bridgeocean Limited - Driver Partnership Opportunity",
    body: `Dear {{candidateName}},

Thank you for your interest in partnering with Bridgeocean Limited.

We are pleased to invite you to complete our driver onboarding process. Please find below the initial screening requirements:

📋 **Bio-Data Required:**
• Name: 
• Age:
• Location:
• Driving experience:
• Bolt/Uber experience:
• Current/Past job:
• Marital status:
• Education background:
• State of Origin:
• LGA:

📋 **Status Information:**
• Married with how many kids:
• Where does your family reside:

✅ **Requirements Checklist (Please respond Y/N):**
1. 2 Guarantors ___
2. Consent to payment of caution fees (₦350,000) ___
   *The caution fees is your money and we won't be requesting for it until the last stage of contract signing and key handover.
3. Valid license ___
4. LASRRA card ___
5. LASDRI card ___
6. 3 Referees ___

🏠 **Accommodation Details:**
• Is your house a gated apartment with a compound?
• All our cars are fitted with trackers, and we'll need geocoordinates of where you'll park the car each night.
• Please note: driving limit is within Lagos.

📱 **Next Steps:**
Please complete this information and send via WhatsApp to +234 906 918 3165.

**LASRRA Registration:** https://registration.lagosresidents.gov.ng/register/

We look forward to building a successful partnership with you.

Best regards,

Bridgeocean Drive
For
Bridgeocean Limited`,
  },
  firstEmail: {
    name: "First Email (Congratulations)",
    subject: "Congratulations and Next Steps - Bridgeocean Limited",
    body: `Dear {{candidateName}},

Thank you once again for your time and participation in the onboarding process. We hope it was an enjoyable experience.

We are pleased to inform you that you have been selected for the next and final stage: the contract signing. Below are a few important steps and reminders regarding this process:

1. **Congratulatory Email (this email):**
     ○ **Contract Review:**
     Attached, you will find three samples of the contract you will be signing. Please take your time to review it carefully. Should you have any questions or need clarifications, feel free to reach out to us via WhatsApp.
     
     ○ **Driver's Manual:**
     Also attached is the Driver's Manual specifically designed for Bridgeocean Limited. It contains all the guidelines and processes you will need to be familiar with. Kindly review this document thoroughly.

2. **Please confirm via WhatsApp** once you have read and understood both documents and send over the signature page of the Driver's Manual.

3. **Second Email:**
     After receiving your confirmation, we will send a second email with details regarding the contract signing and other onboarding activities.

Once again, congratulations, and we look forward to building a successful partnership with you.

Best regards,

Bridgeocean Drive
For
Bridgeocean Limited`,
  },
  secondEmail: {
    name: "Second Email (Contract Signing)",
    subject: "Congratulations and Next Steps: Contract Signing, Caution Fees Payment and Vehicle Pick-up",
    body: `Dear {{candidateName}},

Thank you once again for your time and for choosing to partner with Bridgeocean Limited. We hope you had an enjoyable onboarding process.

We are now at the final stage of completing the onboarding process, which includes contract signing and key collection. Please see the important details and steps below:

**Contract Signing and Vehicle Pick-Up:**
• Date: {{contractDate}}
• Location: {{contractLocation}}
• Time: {{contractTime}}
• Individual to Conduct Signing: {{signingOfficer}}
• Witness: {{witnessName}}

**Before Arrival for Contract Signing:**
Please send the signed signature page of the Driver's Manual as a soft copy via WhatsApp (if not already done).

**Online Signing:** Signing the contract online is required.

**Pre-Contract Signing Requirements:**
**Caution Fees Transfer:**
Please transfer the caution fees to the provided account number as mentioned in the contract sample sent in our first email. Once we confirm receipt of the caution fees, the contract signing and key handover will be finalized.

**Post-Contract Signing Tasks:**
• **Vehicle Inspection:** Ensure that the fire extinguisher, jack, extra tires, and all necessary vehicle papers are in place. Your confirmation is required to verify this.
• **This Week's Remittance:** The week's remittance will be calculated from the time of contract signing to Sunday. Sunday is our end of the week, and the expected time to pay the week's remittance.
• **Weekly Inspection:** Inspections occur on Tuesday, usually at 10am. Your first inspection will be the Tuesday following the contract signing at our designated mechanic workshop in Yaba.
• **General Service:** Your first general service will be bi-monthly on the last Saturday of the second month.

**Communication:** You will be added to a WhatsApp group after signing the contract. This group will serve for general information, but private chats with all our drivers are always open.

**Financial Planning:** It is expected that you will join the ₦1,000 daily contribution for drivers. This is part of our initiative to ensure financial security and avoid financial pressure during general services.

Any additional information not listed here will be communicated via WhatsApp.

Once again, congratulations, and we look forward to a positive partnership.

Best regards,

Bridgeocean Drive
For
Bridgeocean Limited`,
  },
  bookingConfirmation: {
    name: "Booking Confirmation",
    subject: "Booking Confirmation - Bridgeocean Charter Services",
    body: `Dear {{customerName}},

Thank you for booking with Bridgeocean Charter Services!

📋 **Booking Details:**
• Vehicle: {{vehicle}}
• Date: {{date}} at {{time}}
• Pickup: {{pickupLocation}}
• Destination: {{destination}}
• Duration: {{duration}} hours
• Total Cost: {{totalPrice}}

🚗 **What's Next:**
1. Our driver will contact you 30 minutes before pickup
2. Please have your ID ready
3. Our vehicle will arrive at the specified location

📞 **Contact Information:**
• WhatsApp: +234 906 918 3165
• Email: bridgeocean@cyberservices.com

**Please note:** Our driving service is limited to Lagos area.

Thank you for choosing Bridgeocean!

Best regards,
Bridgeocean Team`,
  },
  partnerWelcome: {
    name: "Partner Welcome",
    subject: "Welcome to Bridgeocean Partner Network!",
    body: `Dear {{partnerName}},

Welcome to the Bridgeocean Partner Network! 🎉

Your application has been approved and you're now part of our premium logistics network.

📋 **Your Registration Details:**
• Vehicle: {{vehicleMake}} {{vehicleModel}} ({{vehicleYear}})
• License Plate: {{licensePlate}}
• Status: Approved ✅

🚀 **Important Reminders:**
• **Weekly Inspections:** Every Tuesday at 10am at our Yaba workshop
• **General Service:** Bi-monthly on the last Saturday of the second month
• **Remittance:** Due every Sunday (end of our week)
• **Daily Contribution:** ₦1,000 daily contribution expected
• **Driving Limit:** Within Lagos only
• **Vehicle Tracking:** GPS coordinates required for nightly parking

💰 **Financial Information:**
• Caution fees: ₦350,000 (refundable security deposit)
• Weekly remittance due every Sunday
• Daily contribution: ₦1,000 for financial security

📞 **Support:**
• WhatsApp: +234 906 918 3165
• You will be added to our drivers' WhatsApp group
• Private chats always available

**Required Documents Status:**
• Valid License: ✅
• LASRRA Card: ✅
• LASDRI Card: ✅
• 2 Guarantors: ✅
• 3 Referees: ✅

Welcome aboard!

Bridgeocean Drive
For
Bridgeocean Limited`,
  },
  contactResponse: {
    name: "Contact Response",
    subject: "Thank you for contacting Bridgeocean",
    body: `Dear {{contactName}},

Thank you for reaching out to Bridgeocean!

We have received your message: "{{message}}"

Our team will review your inquiry and respond within 24 hours. For urgent matters, please contact us directly:

📞 **Immediate Contact:**
• WhatsApp: +234 906 918 3165
• Emergency: +234 913 563 0154

🌐 **Our Services:**
• **Charter Services:** Premium vehicle hire within Lagos
• **Nexus Emergency Logistics:** Satellite-powered coordination
• **Partnership Opportunities:** Join our driver network

**Current Fleet:**
• Toyota Camry (2006): ₦100,000 per 10 hours
• GMC Terrain (2011): ₦200,000 per 10 hours

**Partnership Requirements:**
• Valid driving license
• LASRRA and LASDRI cards
• 2 Guarantors and 3 Referees
• ₦350,000 caution fees (refundable)
• Lagos residence with gated parking

Thank you for your interest in Bridgeocean!

Best regards,
Customer Service Team
Bridgeocean Limited`,
  },
  reminderEmail: {
    name: "Reminder Email",
    subject: "Reminder: {{reminderType}} - Bridgeocean Limited",
    body: `Dear {{driverName}},

This is a friendly reminder regarding your upcoming {{reminderType}}.

📅 **Reminder Details:**
• Type: {{reminderType}}
• Date: {{reminderDate}}
• Time: {{reminderTime}}
• Location: {{reminderLocation}}

**Important Notes:**
{{#if isInspection}}
• Weekly inspection at our Yaba workshop
• Please ensure vehicle is clean and ready
• Bring all vehicle documents
{{/if}}

{{#if isService}}
• Bi-monthly general service
• ₦1,000 daily contribution helps cover service costs
• Service typically takes 2-4 hours
{{/if}}

{{#if isRemittance}}
• Weekly remittance due every Sunday
• Calculate from Monday to Sunday
• Send payment confirmation via WhatsApp
{{/if}}

📞 **Contact:**
• WhatsApp: +234 906 918 3165
• Any questions? Reach out anytime

Thank you for being a valued Bridgeocean partner.

Best regards,
Bridgeocean Drive
For
Bridgeocean Limited`,
  },
}

export default function EmailPage() {
  const { toast } = useToast()
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
    attachment: null as File | null,
  })
  const [emailClient, setEmailClient] = useState<string>("web")

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEmailData({
        ...emailData,
        attachment: e.target.files[0],
      })
    }
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()

    if (emailClient === "web") {
      // Send email using web form
      toast({
        title: "Email Sent",
        description: `Email sent to ${emailData.to}`,
      })
    } else if (emailClient === "mailto") {
      // Open default email client
      const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(
        emailData.subject,
      )}&body=${encodeURIComponent(emailData.body)}`

      window.open(mailtoLink, "_blank")
    } else if (emailClient === "gmail") {
      // Open Gmail compose
      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        emailData.to,
      )}&su=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`

      window.open(gmailLink, "_blank")
    } else if (emailClient === "outlook") {
      // Open Outlook compose
      const outlookLink = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(
        emailData.to,
      )}&subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`

      window.open(outlookLink, "_blank")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin-dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Compose Email</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Email</CardTitle>
            <CardDescription>Compose and send an email to candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendEmail} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-client">Email Client</Label>
                <Select value={emailClient} onValueChange={setEmailClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Form (BridgeOcean)</SelectItem>
                    <SelectItem value="mailto">Default Email Client</SelectItem>
                    <SelectItem value="gmail">Gmail</SelectItem>
                    <SelectItem value="outlook">Outlook</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Choose how you want to send this email</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Email Template</Label>
                <Select
                  onValueChange={(value) => {
                    if (value && emailTemplates[value as keyof typeof emailTemplates]) {
                      const template = emailTemplates[value as keyof typeof emailTemplates]
                      setEmailData({
                        ...emailData,
                        subject: template.subject,
                        body: template.body,
                      })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(emailTemplates).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose a pre-written template to auto-populate the email
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={emailData.to}
                  onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  placeholder="Type your message here..."
                  className="min-h-[200px]"
                  value={emailData.body}
                  onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachment">Attachment</Label>
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="attachment"
                    className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Paperclip className="h-4 w-4" />
                    {emailData.attachment ? emailData.attachment.name : "Choose file"}
                  </Label>
                  <Input id="attachment" type="file" className="hidden" onChange={handleAttachmentChange} />
                  {emailData.attachment && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEmailData({ ...emailData, attachment: null })}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: Attachments are only supported when using the web form option
                </p>
              </div>

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
