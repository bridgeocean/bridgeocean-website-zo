import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()

    // Using a simple email service (you can replace with your preferred service)
    // For now, using a basic SMTP setup
    const emailData = {
      from: "noreply@bridgeocean.com",
      to: to,
      subject: subject,
      html: html,
    }

    // You can integrate with services like:
    // - Resend (recommended)
    // - SendGrid
    // - Nodemailer with Gmail
    // - AWS SES

    // For demonstration, using a webhook approach
    // Replace this with your actual email service
    console.log("Email would be sent:", emailData)

    // Temporary solution: Log the email content
    // In production, replace with actual email service

    return NextResponse.json({
      success: true,
      message: "Email notification logged (configure email service for actual sending)",
    })
  } catch (error: any) {
    console.error("Email API Error:", error)
    return NextResponse.json(
      {
        error: "Email sending failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
