import { NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

const BRIDGEOCEAN_KNOWLEDGE_BASE = {
  company: {
    name: "BridgeOcean",
    tagline: "Connecting Lagos with reliable transportation solutions",
    founded: "2023",
    location: "Lagos, Nigeria",
    mission: "To provide premium transportation services and emergency logistics coordination",
  },
  services: {
    charter: {
      name: "Premium Charter Services",
      vehicles: [
        {
          model: "Toyota Camry (2006)",
          price: "₦100,000 per 10 hours",
          features: ["Professional driver", "Full tank petrol", "Air conditioning", "Comfortable seating"],
        },
        {
          model: "GMC Terrain (2011)",
          price: "₦200,000 per 10 hours",
          features: ["Spacious interior", "Professional driver", "Full tank petrol", "Premium comfort"],
        },
      ],
      benefits: [
        "Same-day service available",
        "Professional vetted drivers",
        "Full tank petrol included",
        "24/7 customer support",
        "Flexible scheduling",
        "Corporate rates available",
      ],
    },
    nexus: {
      name: "Nexus Emergency Logistics",
      description: "Satellite-powered emergency coordination system",
      features: [
        "Real-time GPS tracking",
        "Immediate dispatch coordination",
        "Hospital network integration",
        "Traffic incident management",
        "Medical emergency prioritization",
        "24/7 emergency response",
      ],
      technology: "Satellite-powered coordination for rapid response",
    },
    partnership: {
      name: "Partner Vehicle Registration",
      requirements: [
        "Valid driver's license",
        "LASRRA card",
        "LASDRI card",
        "2 guarantors (8+ years relationship)",
        "Caution fee: ₦350,000",
      ],
      benefits: [
        "Consistent booking opportunities",
        "Competitive commission structure",
        "Professional network access",
        "Flexible scheduling",
        "Marketing support",
      ],
    },
  },
  contact: {
    whatsapp: ["+234 906 918 3165", "+234 913 563 0154"],
    email: "bridgeocean@cyberservices.com",
    website: "bridgeocean.xyz",
  },
  target_markets: [
    "Business executives",
    "Corporate clients",
    "Airport transfers",
    "Family transportation",
    "Emergency services",
    "Event transportation",
  ],
  competitive_advantages: [
    "Satellite-powered emergency coordination",
    "Professional driver network",
    "Same-day availability",
    "Comprehensive insurance coverage",
    "24/7 customer support",
    "Competitive pricing",
  ],
}

export async function POST(request: Request) {
  try {
    const { prompt, contentType = "social-media" } = await request.json()

    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI API key not configured")
    }

    // Create enhanced prompt with BridgeOcean context
    const enhancedPrompt = createEnhancedPrompt(prompt, contentType)

    // Build a single string prompt for generateText
    const systemContext = `You are a professional marketing content creator for BridgeOcean.

COMPANY CONTEXT:
${JSON.stringify(BRIDGEOCEAN_KNOWLEDGE_BASE, null, 2)}
`

    const combinedPrompt = `${systemContext}

USER REQUEST:
${enhancedPrompt}
`

    const { text: generatedContent } = await generateText({
      model: xai("grok-3"),
      prompt: combinedPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return NextResponse.json({
      content: generatedContent,
      source: "xai-grok-3",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("XAI Content Generation Error:", error)

    // Fallback to enhanced template-based generation
    const fallbackContent = generateEnhancedFallback(await request.json())

    return NextResponse.json({
      content: fallbackContent,
      source: "enhanced-fallback",
      timestamp: new Date().toISOString(),
      note: "Using enhanced fallback due to API issue",
    })
  }
}

function createEnhancedPrompt(userPrompt: string, contentType: string): string {
  const baseContext = `Create ${contentType} content for BridgeOcean based on this request: "${userPrompt}"`

  const platformGuidelines = {
    facebook:
      "Create a Facebook post with engaging copy, clear call-to-action, and relevant hashtags. Use emojis appropriately.",
    instagram:
      "Create an Instagram caption that's visually engaging, uses relevant hashtags, and encourages engagement.",
    linkedin: "Create professional LinkedIn content that highlights business value and industry expertise.",
    twitter: "Create concise Twitter content that's engaging and shareable within character limits.",
    whatsapp: "Create WhatsApp business message that's personal, informative, and action-oriented.",
    email: "Create professional email content with clear subject line and call-to-action.",
    "social-media": "Create versatile social media content that can work across platforms.",
  }

  const guideline = platformGuidelines[contentType] || platformGuidelines["social-media"]

  return `${baseContext}\n\n${guideline}\n\nMake sure to include specific BridgeOcean services, pricing, or contact information when relevant to the request.`
}

function generateEnhancedFallback(requestData: any): string {
  const { prompt } = requestData
  const lowerPrompt = prompt.toLowerCase()

  // More sophisticated fallback with knowledge base
  if (lowerPrompt.includes("facebook")) {
    if (lowerPrompt.includes("charter") || lowerPrompt.includes("business")) {
      return `🚗 **Premium Charter Services for Lagos Business Professionals**

Experience the BridgeOcean difference with our executive transportation solutions:

✅ **Toyota Camry**: ₦100,000/10hrs - Perfect for business meetings
✅ **GMC Terrain**: ₦200,000/10hrs - Ideal for executive travel
✅ Professional vetted drivers with LASRRA & LASDRI certification
✅ Same-day booking available
✅ Full tank petrol included

**Perfect for:**
• Airport transfers & business meetings
• Corporate events & client transportation  
• Executive travel across Lagos
• Emergency business transportation

**Why Choose BridgeOcean?**
🛰️ Nexus Emergency Logistics - Satellite-powered coordination
📞 24/7 customer support
💼 Corporate partnership rates available
🔒 Comprehensive insurance coverage

Book now: +234 906 918 3165
Visit: bridgeocean.xyz

#BridgeOcean #LagosTransport #BusinessTravel #CharterServices #PremiumTransport #Lagos #Nigeria`
    }

    if (lowerPrompt.includes("nexus") || lowerPrompt.includes("emergency")) {
      return `🚨 **Nexus Emergency Logistics - When Every Second Counts**

BridgeOcean's revolutionary satellite-powered emergency coordination system is transforming emergency response in Lagos.

🛰️ **Advanced Technology:**
• Real-time GPS tracking & routing
• Immediate dispatch coordination
• Hospital network integration
• Traffic incident management

⚡ **Rapid Response Features:**
• Medical emergency prioritization
• 24/7 emergency coordination
• Professional emergency drivers
• Direct hospital communication

📊 **Proven Results:**
• Reduced response times by 40%
• 24/7 availability across Lagos
• Integrated with major hospitals
• Professional emergency protocols

**Emergency Situations We Handle:**
🏥 Medical emergencies
🚗 Traffic incidents
🆘 Urgent transportation needs
📞 24/7 emergency dispatch

Emergency Hotline: +234 906 918 3165
Learn more: bridgeocean.xyz/nexus

#EmergencyServices #NexusLogistics #BridgeOcean #Lagos #EmergencyResponse #SatelliteTechnology #Nigeria`
    }
  }

  if (lowerPrompt.includes("instagram")) {
    if (lowerPrompt.includes("gmc") || lowerPrompt.includes("weekend")) {
      return `🌟 Weekend adventures start with the right ride! ✨

Our GMC Terrain is ready to take you on your next Lagos adventure. Spacious, comfortable, and reliable - perfect for exploring the city and beyond.

💫 **What makes it special:**
• Spacious interior for family trips
• Professional driver included
• Full tank petrol ready to go
• Same-day booking available

📸 Tag us in your adventure photos!
📞 Book your weekend ride: +234 906 918 3165

#WeekendVibes #GMCTerrain #BridgeOcean #LagosAdventure #Charter #ExploreNigeria #PremiumRide #Lagos #WeekendGetaway`
    }
  }

  if (lowerPrompt.includes("linkedin")) {
    return `**Transforming Business Transportation in Lagos**

At BridgeOcean, we understand that reliable transportation is the backbone of business success. Our comprehensive transportation solutions are designed for the modern Nigerian business landscape.

**Our Business Solutions:**
🚗 Executive Charter Services - Toyota Camry & GMC Terrain fleet
🛰️ Nexus Emergency Logistics - Satellite-powered coordination
🤝 Corporate Partnership Programs - Scalable solutions

**Why Leading Companies Choose BridgeOcean:**
• Professional vetted drivers with proper certification
• Same-day availability with flexible scheduling
• Competitive corporate rates and partnership opportunities
• 24/7 customer support and emergency coordination
• Comprehensive insurance coverage

**Industry Impact:**
Our Nexus Emergency Logistics platform has reduced emergency response times by 40% while providing real-time coordination for critical business situations.

Serving Lagos with excellence since 2023.

Ready to elevate your business transportation? Let's discuss partnership opportunities.

Contact: bridgeocean@cyberservices.com
Learn more: bridgeocean.xyz

#CorporateTransport #BusinessSolutions #BridgeOcean #Lagos #ProfessionalServices #Transportation #Nigeria`
  }

  // Default enhanced content
  return `🚗 **BridgeOcean - Your Trusted Transportation Partner in Lagos**

Discover premium transportation solutions designed for modern Lagos:

✨ **Our Fleet:**
• Toyota Camry (2006) - ₦100,000/10hrs
• GMC Terrain (2011) - ₦200,000/10hrs

✨ **What's Included:**
• Professional vetted drivers
• Full tank petrol
• Same-day availability
• 24/7 customer support

🛰️ **Nexus Emergency Logistics:**
Advanced satellite-powered emergency coordination for rapid response when you need it most.

🤝 **Partnership Opportunities:**
Join our growing network of professional drivers and vehicle owners.

Whether it's business or pleasure, we've got Lagos covered.

📞 +234 906 918 3165
🌐 bridgeocean.xyz
📧 bridgeocean@cyberservices.com

#BridgeOcean #Lagos #Charter #PremiumTransport #Reliable #Nigeria #Transportation`
}
