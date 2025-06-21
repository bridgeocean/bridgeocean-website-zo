"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Brain, Copy, Loader2, RefreshCw, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContentGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [simpleAIContent, setSimpleAIContent] = useState("")
  const [grokAIContent, setGrokAIContent] = useState("")
  const [isGeneratingSimple, setIsGeneratingSimple] = useState(false)
  const [isGeneratingGrok, setIsGeneratingGrok] = useState(false)
  const { toast } = useToast()

  // Example prompts for social media content
  const examplePrompts = [
    "Create a Facebook post about our premium charter services for business executives",
    "Write an Instagram caption showcasing our GMC Terrain for weekend getaways",
    "Generate a professional LinkedIn post about BridgeOcean's emergency logistics services",
    "Create engaging content about our Toyota Camry for family trips",
    "Write a Facebook post about our satellite-powered Nexus emergency coordination",
  ]

  // Simple AI Content Generator
  const generateSimpleAIContent = async (userPrompt: string) => {
    setIsGeneratingSimple(true)

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const lowerPrompt = userPrompt.toLowerCase()
      let content = ""

      if (lowerPrompt.includes("facebook")) {
        if (lowerPrompt.includes("charter") || lowerPrompt.includes("business")) {
          content = `🚗 **Premium Charter Services for Business Professionals**

Experience luxury and reliability with BridgeOcean's executive charter services.

✅ Professional drivers
✅ Premium vehicles (Toyota Camry & GMC Terrain)
✅ Full tank petrol included
✅ Same-day service available

Perfect for:
• Business meetings
• Airport transfers
• Corporate events
• Client transportation

📞 Book now: +234 906 918 3165
🌐 bridgeocean.xyz

#BridgeOcean #CharterServices #BusinessTravel #Lagos #PremiumTransport`
        } else if (lowerPrompt.includes("emergency") || lowerPrompt.includes("nexus")) {
          content = `🚨 **Nexus Emergency Logistics - When Every Second Counts**

BridgeOcean's satellite-powered emergency coordination system provides rapid response when you need it most.

🛰️ Real-time tracking
⚡ Immediate dispatch
🏥 Hospital coordination
📍 GPS-enabled routing

Available 24/7 for emergency situations.

Emergency Hotline: +234 906 918 3165
Visit: bridgeocean.xyz/nexus

#EmergencyServices #NexusLogistics #BridgeOcean #SatellitePowered #Emergency`
        }
      } else if (lowerPrompt.includes("instagram")) {
        if (lowerPrompt.includes("gmc") || lowerPrompt.includes("weekend")) {
          content = `🌟 Weekend adventures await! ✨

Our GMC Terrain is ready to take you on your next journey. Spacious, comfortable, and reliable - perfect for exploring Lagos and beyond.

📸 Tag us in your adventure photos!

#WeekendVibes #GMCTerrain #BridgeOcean #Adventure #Lagos #Charter #ExploreNigeria #PremiumRide`
        } else if (lowerPrompt.includes("camry") || lowerPrompt.includes("family")) {
          content = `👨‍👩‍👧‍👦 Family time is precious time 💕

Our Toyota Camry provides the perfect blend of comfort and safety for your family trips. Clean, reliable, and always ready for your next family adventure.

Book your family charter today! 

#FamilyTime #ToyotaCamry #BridgeOcean #FamilyTravel #SafeTravel #Lagos #Charter`
        }
      } else if (lowerPrompt.includes("linkedin")) {
        content = `Professional Transportation Solutions for Modern Businesses

At BridgeOcean, we understand that reliable transportation is crucial for business success. Our premium charter services provide:

• Executive-level vehicles
• Professional, vetted drivers  
• Flexible scheduling
• Competitive corporate rates
• Emergency logistics support through our Nexus platform

Serving Lagos and surrounding areas with excellence since our inception.

Contact us for corporate partnership opportunities.

#CorporateTransport #BusinessSolutions #BridgeOcean #ProfessionalServices`
      } else {
        content = `🚗 **BridgeOcean - Your Premium Transportation Partner**

Discover the difference with our professional charter services:

✨ Premium fleet (Toyota Camry & GMC Terrain)
✨ Professional drivers
✨ Full tank petrol included
✨ Same-day availability
✨ Emergency logistics support

Whether it's business or pleasure, we've got you covered.

📞 +234 906 918 3165
🌐 bridgeocean.xyz

#BridgeOcean #Charter #Lagos #PremiumTransport #Reliable`
      }

      setSimpleAIContent(content)
    } catch (error) {
      toast({
        title: "Error generating content",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSimple(false)
    }
  }

  // Grok AI Content Generator (Enhanced)
  const generateGrokAIContent = async (userPrompt: string) => {
    setIsGeneratingGrok(true)

    try {
      // Call the enhanced AI API
      const response = await fetch("/api/generate-whatsapp-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Create social media content for BridgeOcean: ${userPrompt}`,
          companyInfo: {
            name: "BridgeOcean",
            services: [
              "Nexus Emergency Logistics - Satellite-powered emergency coordination",
              "Premium Charter Services - Professional vehicles for hire",
              "Partnership Opportunities - Register vehicles with our platform",
            ],
            contact: {
              whatsapp: ["+234 906 918 3165", "+234 913 563 0154"],
              email: "bridgeocean@cyberservices.com",
              website: "bridgeocean.xyz",
            },
            pricing: {
              "Toyota Camry (2006)": "₦100,000 per 10 hours",
              "GMC Terrain (2011)": "₦200,000 per 10 hours",
            },
            features: [
              "Professional drivers included",
              "Full tank petrol included",
              "Same-day service available",
              "24/7 emergency services",
              "Satellite-powered coordination",
            ],
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGrokAIContent(data.text)
    } catch (error) {
      toast({
        title: "Error generating content",
        description: "Grok AI service unavailable. Please try Simple AI instead.",
        variant: "destructive",
      })
      setGrokAIContent("Grok AI service is currently unavailable. Please try the Simple AI generator.")
    } finally {
      setIsGeneratingGrok(false)
    }
  }

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: `${type} content has been copied to your clipboard`,
    })
  }

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
          <h1 className="text-lg font-semibold">AI Content Generator</h1>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Social Media Content Generator</h2>
          <p className="text-muted-foreground">
            Create engaging content for Facebook, Instagram, and LinkedIn using AI
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Content Prompt</CardTitle>
            <CardDescription>
              Describe the type of social media content you want to create for BridgeOcean
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">What content would you like to create?</label>
              <Textarea
                placeholder="e.g., Create a Facebook post about our premium charter services..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Example Prompts</label>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(example)}
                    className="text-xs h-auto p-2"
                  >
                    {example.length > 40 ? example.substring(0, 40) + "..." : example}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="simple" className="space-y-4">
          <TabsList>
            <TabsTrigger value="simple">
              <Brain className="h-4 w-4 mr-2" />
              Simple AI Generator
            </TabsTrigger>
            <TabsTrigger value="grok">
              <Sparkles className="h-4 w-4 mr-2" />
              Enhanced AI Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Simple AI Content Generator</CardTitle>
                <CardDescription>Fast and reliable content generation using BridgeOcean templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => generateSimpleAIContent(prompt)}
                  className="w-full"
                  disabled={isGeneratingSimple || !prompt.trim()}
                >
                  {isGeneratingSimple ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>

                {simpleAIContent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Generated Content</label>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(simpleAIContent, "Simple AI")}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">{simpleAIContent}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grok" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced AI Content Generator</CardTitle>
                <CardDescription>Advanced AI-powered content creation with deep BridgeOcean knowledge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => generateGrokAIContent(prompt)}
                  className="w-full"
                  disabled={isGeneratingGrok || !prompt.trim()}
                >
                  {isGeneratingGrok ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Enhanced Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Enhanced Content
                    </>
                  )}
                </Button>

                {grokAIContent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Generated Content</label>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => generateGrokAIContent(prompt)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(grokAIContent, "Enhanced AI")}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">{grokAIContent}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
