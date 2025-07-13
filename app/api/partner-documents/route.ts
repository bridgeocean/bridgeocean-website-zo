import { type NextRequest, NextResponse } from "next/server"
import { listDocumentsByType } from "@/lib/aws-s3"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentType = searchParams.get("type")

    if (!documentType) {
      return NextResponse.json({ error: "Document type is required" }, { status: 400 })
    }

    const documents = await listDocumentsByType(documentType)

    const formattedDocuments = documents.map((doc) => ({
      key: doc.Key,
      size: doc.Size,
      lastModified: doc.LastModified,
      fileName: doc.Key?.split("/").pop(),
    }))

    return NextResponse.json({
      success: true,
      documentType,
      count: formattedDocuments.length,
      documents: formattedDocuments,
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch documents",
      },
      { status: 500 },
    )
  }
}
