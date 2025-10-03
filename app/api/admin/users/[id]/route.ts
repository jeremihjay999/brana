import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

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

    // Get the update data from the request body
    const updates = await request.json();
    
    // Validate updates (only allow status and role changes)
    const allowedUpdates = {
      status: ['active', 'pending', 'inactive'],
      role: ['admin', 'user']
    };
    
    const sanitizedUpdates: Record<string, any> = {};
    
    if (updates.status && allowedUpdates.status.includes(updates.status)) {
      sanitizedUpdates.status = updates.status;
    }
    
    if (updates.role && allowedUpdates.role.includes(updates.role)) {
      sanitizedUpdates.role = updates.role;
    }
    
    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid updates provided" },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Update the user
    const result = await db.collection("admin_users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: sanitizedUpdates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 