import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { secretKey } = await request.json();

    // Simple secret key check for security
    if (secretKey !== "BRANA_KIDS_SUPER_ADMIN_2024") {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 403 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("admin_users");

    // Check if super admin already exists
    const existingSuperAdmin = await collection.findOne({ role: "super_admin" });
    if (existingSuperAdmin) {
      return NextResponse.json({
        success: false,
        message: "Super admin already exists",
        email: existingSuperAdmin.email
      });
    }

    // Super admin credentials
    const superAdminData = {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: await bcrypt.hash("superadmin123", 10),
      role: "super_admin",
      status: "active",
      permissions: [
        "manage_users",
        "manage_products",
        "manage_categories",
        "manage_orders",
        "manage_customers",
        "manage_inventory",
        "manage_promotions",
        "manage_banners",
        "manage_settings",
        "view_analytics",
        "manage_admins",
        "system_settings",
        "view_reports",
        "manage_content",
        "manage_media"
      ],
      createdAt: new Date(),
      lastLogin: null,
      isSuperAdmin: true
    };

    // Insert super admin
    const result = await collection.insertOne(superAdminData);

    return NextResponse.json({
      success: true,
      message: "Super admin created successfully!",
      credentials: {
        email: "superadmin@gmail.com",
        password: "superadmin123"
      },
      userId: result.insertedId
    });

  } catch (error) {
    console.error("Error creating super admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
