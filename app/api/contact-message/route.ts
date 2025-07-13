import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    console.log("Contact message API called!")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const formData = await request.json()

    console.log("Received contact data:", formData)

    // Save to database
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          status: "new",
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Database insert error:", error)
      return NextResponse.json({ error: "Database insert failed", details: error.message }, { status: 500 })
    }

    console.log("Contact message saved successfully:", data)

    // Send email notification to admin
    try {
      const emailResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: "bridgeocean@cyberservices.com",
            subject: `New Contact Form Submission: ${formData.subject}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
          }),
        },
      )

      if (emailResponse.ok) {
        console.log("Email notification sent successfully")
      } else {
        console.error("Failed to send email notification")
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Don't fail the main request if email fails
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "API Error", details: error.message }, { status: 500 })
  }
}
