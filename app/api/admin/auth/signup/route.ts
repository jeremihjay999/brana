import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection("admin_users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with 'user' role and 'pending' status
    const result = await db.collection("admin_users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role is user, not admin
      status: "pending", // Default status is pending until approved
      createdAt: new Date(),
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.insertedId.toString(), 
        email,
        role: "user" // Set correct role in token
      },
      process.env.JWT_SECRET || "your-admin-secret-key",
      { expiresIn: "7d" }
    );

    return NextResponse.json({ 
      token,
      user: {
        name,
        email,
        role: "user",
        status: "pending"
      }
    });
  } catch (error) {
    console.error("Admin signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 