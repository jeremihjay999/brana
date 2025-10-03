import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    // Extract token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the token
    const secret = process.env.JWT_SECRET || "your-admin-secret-key";
    let decodedToken;
    
    try {
      decodedToken = jwt.verify(token, secret) as { userId: string; role: string };
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check if the user is an admin
    if (decodedToken.role !== 'admin') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get all users from the database, excluding the password field
    const users = await db.collection("admin_users")
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 