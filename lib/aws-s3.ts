import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "bridgeocean-partner-documents"

interface UploadToS3Options {
  file: File
  documentType: string
  fileName: string
}

export async function uploadToS3({ file, documentType, fileName }: UploadToS3Options) {
  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create S3 key with folder structure
    const key = `${documentType}/${Date.now()}_${fileName}`

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalName: fileName,
        documentType: documentType,
        uploadDate: new Date().toISOString(),
      },
    })

    const result = await s3Client.send(command)

    return {
      success: true,
      key: key,
      bucket: BUCKET_NAME,
      url: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
      etag: result.ETag,
    }
  } catch (error) {
    console.error("S3 upload error:", error)
    throw error
  }
}

export async function generatePresignedUrl(key: string, expiresIn = 3600) {
  // For viewing uploaded documents (optional)
  try {
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner")
    const { GetObjectCommand } = await import("@aws-sdk/client-s3")

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    throw error
  }
}
