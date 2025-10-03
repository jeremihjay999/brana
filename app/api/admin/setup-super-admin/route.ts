import { NextResponse } from "next/server";

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

    // For now, return the super admin credentials
    // In a real setup, this would create the user in the database
    return NextResponse.json({
      success: true,
      message: "Super admin setup instructions",
      credentials: {
        email: "superadmin@branakids.co.ke",
        password: "SuperAdmin123!"
      },
      instructions: [
        "1. Make sure MongoDB is running",
        "2. Run: npm run create-super-admin",
        "3. Or use the /admin/create-super-admin page",
        "4. Then login with the credentials above"
      ],
      note: "The super admin user needs to be created in the database first"
    });

  } catch (error) {
    console.error("Error in setup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

