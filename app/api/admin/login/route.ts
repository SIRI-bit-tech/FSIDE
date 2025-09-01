import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// In production, use a proper database
const adminUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find admin user
    const admin = adminUsers.find((user) => user.email === email)
    if (!admin) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Generate token (in production, use JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 })
  }
}
