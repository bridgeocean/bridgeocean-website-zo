"use client"

import Link from "next/link"
import { ArrowLeft, MessageSquare, FileText, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CommunicationsPage() {
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
          <h1 className="text-lg font-semibold">Communications Hub</h1>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Communications Hub</h2>
            <p className="text-muted-foreground">
              Manage all your customer communications and generate professional documents
            </p>
          </div>
        </div>

        {/* Communication Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                WhatsApp Assistant
                <Badge variant="secondary">Popular</Badge>
              </CardTitle>
              <CardDescription>
                Generate professional responses for WhatsApp communications with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                • AI-powered message generation • Business setup templates • Professional tone optimization
              </div>
              <Link href="/communications/whatsapp">
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Open WhatsApp Tools
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                AI Invoice Generator
                <Badge variant="outline">New</Badge>
              </CardTitle>
              <CardDescription>
                Generate professional invoices from WhatsApp chats with automatic 7% VAT calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                • WhatsApp chat analysis • Automatic VAT calculation (7%) • PDF download with company logo
              </div>
              <Link href="/communications/invoice">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Invoices
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-600" />
                Email Automation
              </CardTitle>
              <CardDescription>
                Manage email templates, automated responses, and customer communications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                • Email templates • Automated responses • Customer follow-ups
              </div>
              <Link href="/communications/email">
                <Button className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Tools
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
