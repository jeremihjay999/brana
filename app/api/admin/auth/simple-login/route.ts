import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Super admin login (works without MongoDB)
    if (email === "superadmin@gmail.com" && password === "superadmin123") {
      const token = jwt.sign(
        { 
          userId: "super-admin-id", 
          email: "superadmin@branakids.co.ke",
          role: "super_admin"
        },
        process.env.JWT_SECRET || "your-admin-secret-key",
        { expiresIn: "7d" }
      );

      // Set HTTP-only cookie with the token
      const cookieStore = cookies();
      cookieStore.set({
        name: 'adminToken',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        sameSite: 'strict',
      });

      return NextResponse.json({ 
        success: true,
        token,
        user: {
          name: "Super Admin",
          email: "superadmin@gmail.com",
          role: "super_admin"
        },
        message: "Super admin login successful"
      });
    }

    // For other users, return error (MongoDB not available)
    return NextResponse.json(
      { 
        error: "Invalid credentials or database not available",
        details: "Use superadmin@gmail.com / superadmin123 for super admin access"
      },
      { status: 401 }
    );

  } catch (error) {
    console.error("Simple login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
