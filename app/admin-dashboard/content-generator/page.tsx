"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Brain, Copy, Loader2, RefreshCw, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContentGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [contentType, setContentType] = useState("social-media")
  const [simpleAIContent, setSimpleAIContent] = useState("")
  const [enhancedAIContent, setEnhancedAIContent] = useState("")
  const [isGeneratingSimple, setIsGeneratingSimple] = useState(false)
  const [isGeneratingEnhanced, setIsGeneratingEnhanced] = useState(false)
  const { toast } = useToast()

  // Enhanced example prompts with more variety
  const examplePrompts = [
    "Create a Facebook post about our premium charter services for business executives",
    "Write an Instagram story showcasing our GMC Terrain for weekend getaways",
    "Generate a professional LinkedIn post about BridgeOcean's emergency logistics services",
    "Create engaging content about our Toyota Camry for family trips",
    "Write a Facebook post about our satellite-powered Nexus emergency coordination",
    "Create a WhatsApp business message for charter booking inquiries",
    "Write a Twitter thread about our partnership opportunities",
    "Generate email content for corporate clients about our services",
    "Create Instagram content highlighting our professional drivers",
    "Write LinkedIn content about transportation innovation in Lagos",
  ]

  const contentTypes = [
    { value: "social-media", label: "General Social Media" },
    { value: "facebook", label: "Facebook Post" },
    { value: "instagram", label: "Instagram Caption" },
    { value: "linkedin", label: "LinkedIn Post" },
    { value: "twitter", label: "Twitter/X Post" },
    { value: "whatsapp", label: "WhatsApp Business" },
    { value: "email", label: "Email Content" },
  ]

  // Enhanced Simple AI Generator with better logic
  const generateSimpleAIContent = async (userPrompt: string) => {
    setIsGeneratingSimple(true)

    try {
      const response = await fetch("/api/xai-content-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
          contentType: contentType,
          mode: "simple",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setSimpleAIContent(data.content)

      toast({
        title: "Content Generated Successfully",
        description: `Generated using ${data.source}`,
      })
    } catch (error) {
      console.error("Error generating simple content:", error)
      toast({
        title: "Error generating content",
        description: "Please try again or check your connection",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSimple(false)
    }
  }

  // Enhanced AI Generator with xAI/Grok integration
  const generateEnhancedAIContent = async (userPrompt: string) => {
    setIsGeneratingEnhanced(true)

    try {
      const response = await fetch("/api/xai-content-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
          contentType: contentType,
          mode: "enhanced",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate enhanced content")
      }

      const data = await response.json()
      setEnhancedAIContent(data.content)

      toast({
        title: "Enhanced Content Generated",
        description: `Generated using ${data.source === "xai-grok" ? "xAI Grok" : "Enhanced Fallback"}`,
      })
    } catch (error) {
      console.error("Error generating enhanced content:", error)
      toast({
        title: "Error generating enhanced content",
        description: "Please try again or check your xAI configuration",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingEnhanced(false)
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
          <h2 className="text-2xl font-bold tracking-tight">BridgeOcean Content Generator</h2>
          <p className="text-muted-foreground">Create engaging content using AI with BridgeOcean's knowledge base</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Content Configuration</CardTitle>
            <CardDescription>Configure your content generation with BridgeOcean context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Type</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content Prompt</label>
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
                    {example.length > 50 ? example.substring(0, 50) + "..." : example}
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
              Smart AI Generator
            </TabsTrigger>
            <TabsTrigger value="enhanced">
              <Zap className="h-4 w-4 mr-2" />
              xAI Grok Enhanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Smart AI Content Generator</CardTitle>
                <CardDescription>Enhanced template-based generation with BridgeOcean knowledge base</CardDescription>
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
                      Generate Smart Content
                    </>
                  )}
                </Button>

                {simpleAIContent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Generated Content</label>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(simpleAIContent, "Smart AI")}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
                      {simpleAIContent}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enhanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>xAI Grok Enhanced Generator</CardTitle>
                <CardDescription>
                  Advanced AI-powered content creation using xAI Grok with deep BridgeOcean knowledge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => generateEnhancedAIContent(prompt)}
                  className="w-full"
                  disabled={isGeneratingEnhanced || !prompt.trim()}
                >
                  {isGeneratingEnhanced ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating with xAI Grok...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate with xAI Grok
                    </>
                  )}
                </Button>

                {enhancedAIContent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Generated Content</label>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => generateEnhancedAIContent(prompt)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(enhancedAIContent, "xAI Grok")}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
                      {enhancedAIContent}
                    </div>
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
