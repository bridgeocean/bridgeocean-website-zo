import { type NextRequest, NextResponse } from "next/server"
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "bridgeocean-partner-documents"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentType = searchParams.get("type")

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: documentType ? `${documentType}/` : undefined,
      MaxKeys: 100,
    })

    const result = await s3Client.send(command)

    const documents =
      result.Contents?.map((object) => ({
        key: object.Key,
        size: object.Size,
        lastModified: object.LastModified,
        url: `https://${BUCKET_NAME}.s3.amazonaws.com/${object.Key}`,
      })) || []

    return NextResponse.json({
      success: true,
      documents,
      count: documents.length,
    })
  } catch (error) {
    console.error("Error listing documents:", error)
    return NextResponse.json(
      {
        error: "Failed to list documents",
      },
      { status: 500 },
    )
  }
}
