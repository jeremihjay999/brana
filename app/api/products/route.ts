import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import { mockProducts } from "@/lib/mock-data"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Validate required fields for product
function validateProduct(body: any, isUpdate = false) {
  const requiredFields = ['name', 'category', 'price', 'stock']
  const missingFields = requiredFields.filter(field => !isUpdate && !body[field])
  
  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`
  }

  if (body.price && isNaN(parseFloat(body.price))) {
    return 'Price must be a valid number'
  }

  if (body.stock && isNaN(parseInt(body.stock))) {
    return 'Stock must be a valid number'
  }

  if (body.images && !Array.isArray(body.images)) {
    return 'Images must be an array'
  }

  if (body.images && body.images.length > 3) {
    return 'Maximum of 3 images allowed'
  }

  // Deal validation
  if (body.isDeal) {
    if (
      body.previousPrice === undefined ||
      body.dealPrice === undefined ||
      isNaN(parseFloat(body.previousPrice)) ||
      isNaN(parseFloat(body.dealPrice))
    ) {
      return 'Both Previous Price and Deal Price are required and must be valid numbers for a deal.'
    }
  }

  // Variants validation
  if (body.hasVariants) {
    if (!body.variants || !Array.isArray(body.variants) || body.variants.length === 0) {
      return 'At least one variant is required when hasVariants is true'
    }

    for (const variant of body.variants) {
      if (!variant.name || !variant.price || variant.stock === undefined) {
        return 'Each variant must have name, price, and stock'
      }
      if (isNaN(parseFloat(variant.price)) || isNaN(parseInt(variant.stock))) {
        return 'Variant price and stock must be valid numbers'
      }
      
      // Validate variant images if present
      if (variant.images && !Array.isArray(variant.images)) {
        return 'Variant images must be an array'
      }
      if (variant.images && variant.images.length > 3) {
        return 'Maximum of 3 images allowed per variant'
      }
    }
  }

  return null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validationError = validateProduct(body)
    
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("branakids")

    // Check for existing product with same name
    const existingProduct = await db.collection("products").findOne({
      name: { $regex: new RegExp(`^${body.name}$`, 'i') }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 400 }
      )
    }

    const product = {
      name: body.name,
      description: body.description || "",
      category: body.category,
      price: parseFloat(body.price),
      stock: parseInt(body.stock),
      status: body.stock > 0 ? "in-stock" : "out-of-stock",
      images: body.images || [],
      isDeal: !!body.isDeal,
      ...(body.isDeal && !isNaN(parseFloat(body.previousPrice)) && !isNaN(parseFloat(body.dealPrice))
        ? {
            previousPrice: parseFloat(body.previousPrice),
            dealPrice: parseFloat(body.dealPrice)
          }
        : {}),
      tags: Array.isArray(body.tags) ? body.tags.map(t => String(t).trim()).filter(Boolean) : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(product)

    return NextResponse.json(
      { 
        message: "Product created successfully", 
        product: {
          _id: result.insertedId,
          ...product
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100)
    const search = searchParams.get("search")?.trim() || ""
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db("branakids")
    const collection = db.collection("products")

    // Build query
    let query: any = {}
    if (search) {
      // Try text search first
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $elemMatch: { $regex: search, $options: "i" } } }
        ]
      }
    }

    // Get total count for pagination
    const total = await collection.countDocuments(query)
    // Get paginated products
    const products = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .project({
        name: 1,
        category: 1,
        price: 1,
        stock: 1,
        status: 1,
        images: 1,
        isDeal: 1,
        dealPrice: 1,
        previousPrice: 1,
        tags: 1,
        createdAt: 1,
        updatedAt: 1,
        // _id is always included
      })
      .toArray()

    return NextResponse.json({
      products,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : { message: String(error) }
    return NextResponse.json(
      { error: "Failed to fetch products", details: errorDetails },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const validationError = validateProduct(body, true)
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("branakids")

    // Check if product exists
    const existingProduct = await db.collection("products").findOne({
      _id: new ObjectId(id)
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Check for duplicate name
    if (body.name && body.name !== existingProduct.name) {
      const duplicateProduct = await db.collection("products").findOne({
        name: { $regex: new RegExp(`^${body.name}$`, 'i') },
        _id: { $ne: new ObjectId(id) }
      })

      if (duplicateProduct) {
        return NextResponse.json(
          { error: "A product with this name already exists" },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData = {
      ...body,
      ...(body.price && { price: parseFloat(body.price) }),
      ...(body.stock && { 
        stock: parseInt(body.stock),
        status: parseInt(body.stock) > 0 ? "in-stock" : "out-of-stock"
      }),
      isDeal: !!body.isDeal,
      ...(body.isDeal && !isNaN(parseFloat(body.previousPrice)) && !isNaN(parseFloat(body.dealPrice))
        ? {
            previousPrice: parseFloat(body.previousPrice),
            dealPrice: parseFloat(body.dealPrice)
          }
        : {
            previousPrice: undefined,
            dealPrice: undefined
          }),
      updatedAt: new Date()
    }
    // Remove _id if present
    if (updateData._id) {
      delete updateData._id;
    }

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      )
    }

    // Get updated product
    const updatedProduct = await db.collection("products").findOne({
      _id: new ObjectId(id)
    })

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("branakids")

    // First get the product to access its images
    const product = await db.collection("products").findOne({
      _id: new ObjectId(id)
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Delete images from Cloudinary if they were uploaded files
    if (product.images && Array.isArray(product.images)) {
      const deletePromises = product.images
        .filter(img => img.type === "file" && img.url.includes("cloudinary"))
        .map(async (img) => {
          try {
            // Extract public_id from Cloudinary URL
            const urlParts = img.url.split('/')
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
            console.error("Error deleting image from Cloudinary:", error)
            // Continue with product deletion even if image deletion fails
          }
        })

      // Wait for all image deletions to complete
      await Promise.all(deletePromises)
    }

    // Delete the product from MongoDB
    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Get updated list
    const products = await db.collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      message: "Product and associated images deleted successfully",
      products
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
} 