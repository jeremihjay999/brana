import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("tech-ecommerce")
    const banners = await db.collection("banners").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(banners)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db("tech-ecommerce")
    const result = await db.collection("banners").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return NextResponse.json({ message: "Banner created", id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const body = await request.json()
    if (!id) return NextResponse.json({ error: "Banner ID required" }, { status: 400 })
    const client = await clientPromise
    const db = client.db("tech-ecommerce")
    await db.collection("banners").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    )
    return NextResponse.json({ message: "Banner updated" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Banner ID required" }, { status: 400 })
    
    const client = await clientPromise
    const db = client.db("tech-ecommerce")

    // First get the banner to access its image
    const banner = await db.collection("banners").findOne({
      _id: new ObjectId(id)
    })

    if (!banner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      )
    }

    // Delete image from Cloudinary if it exists
    if (banner.image && banner.image.includes("cloudinary")) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = banner.image.split('/')
        const publicId = urlParts[urlParts.length - 1].split('.')[0]
        
        // Delete from Cloudinary
        await new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(publicId, {
            invalidate: true,
            resource_type: "image"
          }, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          })
        })
      } catch (error) {
        console.error("Error deleting banner image from Cloudinary:", error)
        // Continue with banner deletion even if image deletion fails
      }
    }

    // Delete the banner from MongoDB
    await db.collection("banners").deleteOne({ _id: new ObjectId(id) })
    
    return NextResponse.json({ message: "Banner and associated image deleted successfully" })
  } catch (error) {
    console.error("Error deleting banner:", error)
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 })
  }
} 