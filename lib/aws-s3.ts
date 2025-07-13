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

// Document type mapping for better folder organization
const DOCUMENT_FOLDER_MAP: Record<string, string> = {
  identification: "partner-registration/identification",
  vehicleRegistration: "partner-registration/vehicle-registration",
  insuranceCertificate: "partner-registration/insurance-certificates",
  vehiclePhotos: "partner-registration/vehicle-photos",
  // Future document types can be added here
  charterBooking: "charter-bookings/confirmations",
  userProfile: "user-profiles/images",
  fleetImages: "fleet-management/vehicle-photos",
  marketingAssets: "marketing/assets",
}

export async function uploadToS3({ file, documentType, fileName }: UploadToS3Options) {
  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Get the organized folder path
    const folderPath = DOCUMENT_FOLDER_MAP[documentType] || `general-uploads/${documentType}`

    // Create timestamp for unique naming
    const timestamp = Date.now()
    const dateString = new Date().toISOString().split("T")[0] // YYYY-MM-DD

    // Create S3 key with organized folder structure
    const key = `${folderPath}/${dateString}/${timestamp}_${fileName}`

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
        folderPath: folderPath,
      },
    })

    const result = await s3Client.send(command)

    return {
      success: true,
      key: key,
      bucket: BUCKET_NAME,
      url: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
      etag: result.ETag,
      folderPath: folderPath,
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

// Helper function to list files in a specific folder
export async function listDocumentsByType(documentType: string) {
  try {
    const { ListObjectsV2Command } = await import("@aws-sdk/client-s3")

    const folderPath = DOCUMENT_FOLDER_MAP[documentType] || `general-uploads/${documentType}`

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `${folderPath}/`,
    })

    const result = await s3Client.send(command)
    return result.Contents || []
  } catch (error) {
    console.error("Error listing documents:", error)
    throw error
  }
}
