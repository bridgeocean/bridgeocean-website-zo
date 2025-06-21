"use client"

import Link from "next/link"
import { WhatsAppIntegration } from "@/components/whatsapp-integration"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Settings, MessageCircle, ExternalLink } from "lucide-react"
import { ArrowLeft } from "lucide-react"

export default function WhatsAppPage() {
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
          <h1 className="text-lg font-semibold">WhatsApp Communications</h1>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="send" className="space-y-4">
          <TabsList>
            <TabsTrigger value="send">Send Messages</TabsTrigger>
            <TabsTrigger value="business">Business Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <WhatsAppIntegration />
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Business Contact Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Primary Business WhatsApp</Label>
                      <div className="flex items-center gap-2">
                        <Input value="+234 906 918 3165" readOnly />
                        <Button size="sm" onClick={() => window.open("https://wa.me/2349069183165", "_blank")}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Business WhatsApp</Label>
                      <div className="flex items-center gap-2">
                        <Input value="+234 913 563 0154" readOnly />
                        <Button size="sm" onClick={() => window.open("https://wa.me/2349135630154", "_blank")}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input value="BridgeOcean" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Description</Label>
                    <Input value="Satellite-Powered Emergency Logistics & Charter Services" readOnly />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() =>
                      window.open(
                        "https://wa.me/2349069183165?text=Test%20message%20from%20BridgeOcean%20platform",
                        "_blank",
                      )
                    }
                  >
                    Test Primary WhatsApp (+234 906 918 3165)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() =>
                      window.open(
                        "https://wa.me/2349135630154?text=Test%20message%20from%20BridgeOcean%20platform",
                        "_blank",
                      )
                    }
                  >
                    Test Secondary WhatsApp (+234 913 563 0154)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open("https://business.whatsapp.com/", "_blank")}
                  >
                    WhatsApp Business Web
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Integration Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WhatsApp Web</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Business API</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Webhook</span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Not Set</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Grok AI</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
