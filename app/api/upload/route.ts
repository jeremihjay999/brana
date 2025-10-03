import { NextResponse } from "next/server"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Define upload presets for different use cases
const uploadPresets = {
  product: {
    folder: "tech-ecommerce/products",
    transformation: [
      { width: 1200, height: 1200, crop: "fill", quality: "auto" },
      { fetch_format: "auto" }
    ],
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  },
  banner: {
    folder: "tech-ecommerce/banners",
    transformation: [
      { width: 1200, height: 400, crop: "fill", quality: "auto" },
      { fetch_format: "auto" }
    ],
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  },
  thumbnail: {
    folder: "tech-ecommerce/thumbnails",
    transformation: [
      { width: 300, height: 300, crop: "fill", quality: "auto" },
      { fetch_format: "auto" }
    ],
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File
    const type = formData.get("type") as "product" | "banner" | "thumbnail" || "product"
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary configuration missing" },
        { status: 500 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`

    // Get upload preset based on type
    const preset = uploadPresets[type] || uploadPresets.product

    // Upload to Cloudinary with preset
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64String,
        {
          folder: preset.folder,
          resource_type: "auto",
          allowed_formats: preset.allowed_formats,
          transformation: preset.transformation,
          // Add metadata for better organization
          tags: [type, "tech-ecommerce"],
          // Enable automatic backup
          backup: true,
          // Enable eager transformations for faster delivery
          eager: [
            { width: 300, height: 300, crop: "fill", quality: "auto", fetch_format: "auto" },
            { width: 600, height: 600, crop: "fill", quality: "auto", fetch_format: "auto" }
          ],
          eager_async: true
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })

    // Return the secure URL and additional metadata
    return NextResponse.json({ 
      url: (result as any).secure_url,
      public_id: (result as any).public_id,
      width: (result as any).width,
      height: (result as any).height,
      format: (result as any).format,
      bytes: (result as any).bytes,
      eager: (result as any).eager // Includes the eager transformations
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}

// Optional: Add a DELETE endpoint to remove images from Cloudinary
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get("public_id")
    
    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID required" },
        { status: 400 }
      )
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary configuration missing" },
        { status: 500 }
      )
    }

    // Delete from Cloudinary with options
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, {
        invalidate: true, // Invalidate CDN cache
        resource_type: "image" // Specify resource type
      }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })

    return NextResponse.json({ 
      message: "Image deleted successfully",
      result
    })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    )
  }
} 