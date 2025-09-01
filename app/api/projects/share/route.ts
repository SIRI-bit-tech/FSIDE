import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { project_id, permission, expires_in } = body

    // Generate a secure share token (in production, use crypto.randomBytes)
    const shareToken = Math.random().toString(36).substring(2, 15)

    const shareUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/ide/shared/${shareToken}`

    // In production, save share link to database with expiration
    const shareData = {
      share_url: shareUrl,
      token: shareToken,
      project_id,
      permission,
      expires_at: new Date(Date.now() + (expires_in === "7d" ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)),
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(shareData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate share link" }, { status: 500 })
  }
}
