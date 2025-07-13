import { NextResponse } from "next/server"

// POST /api/send-contact
export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Read the key ONLY on the server
    const access_key = "5646250a-18d1-4d84-a6be-2d4e7f57605c"

    if (!access_key) {
      return NextResponse.json({ success: false, message: "Server mis-config: missing Web3Forms key" }, { status: 500 })
    }

    // Forward the request to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...data,
        access_key,
        from_name: data.name,
        replyto: data.email,
      }),
    })

    const result = await response.json()
    return NextResponse.json(result, { status: response.ok ? 200 : 400 })
  } catch (err) {
    console.error("Web3Forms proxy error:", err)
    return NextResponse.json({ success: false, message: "Unexpected server error" }, { status: 500 })
  }
}
