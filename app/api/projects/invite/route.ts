import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { project_id, email, permission } = body

    // In production, send actual email invitation
    console.log(`Sending invitation to ${email} for project ${project_id} with ${permission} permission`)

    // Mock email sending
    const invitation = {
      id: Date.now().toString(),
      project_id,
      email,
      permission,
      status: "sent",
      sent_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json(invitation)
  } catch (error) {
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
  }
}
