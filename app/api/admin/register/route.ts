import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// In production, use a proper database
const adminUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Check if admin already exists
    const existingAdmin = adminUsers.find((user) => user.email === email)
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin account already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const newAdmin = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date().toISOString(),
    }

    adminUsers.push(newAdmin)

    // Generate token (in production, use JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      message: "Admin account created successfully",
      token,
      user: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create admin account" }, { status: 500 })
  }
}
