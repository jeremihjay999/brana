import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const productId = params.id

    // Validate ObjectId format
    if (!ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      )
    }

    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId)
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Convert ObjectId to string for JSON serialization
    const productWithStringId = {
      ...product,
      _id: product._id.toString()
    }

    return NextResponse.json(productWithStringId)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

