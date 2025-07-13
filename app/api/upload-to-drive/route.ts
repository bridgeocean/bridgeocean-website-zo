import { type NextRequest, NextResponse } from "next/server"
import { uploadToS3 } from "@/lib/aws-s3"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum 10MB allowed." }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPG, PNG, and PDF files are allowed.",
        },
        { status: 400 },
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileName = `${documentType}_${timestamp}_${sanitizedName}`

    // Upload to S3
    const uploadResult = await uploadToS3({
      file,
      documentType,
      fileName,
    })

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully to AWS S3",
      fileName: file.name,
      documentType: documentType,
      uploadedFileName: fileName,
      s3Key: uploadResult.key,
      s3Url: uploadResult.url,
      folderPath: uploadResult.folderPath,
      location: `S3 Bucket: ${uploadResult.bucket}/${uploadResult.folderPath}`,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    )
  }
}
