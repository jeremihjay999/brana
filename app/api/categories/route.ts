import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb-safe"
import { mockCategories } from "@/lib/mock-data"
import { ObjectId } from "mongodb"

// Function to create a slug from a string
function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    // Validate required fields
    if (!body.name || !body.icon) {
      return NextResponse.json(
        { error: "Name and icon are required" },
        { status: 400 }
      )
    }

    // Check for existing category with same name
    const existingCategory = await db.collection("categories").findOne({
      name: { $regex: new RegExp(`^${body.name}$`, 'i') }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      )
    }

    const category = {
      name: body.name,
      description: body.description || "",
      icon: body.icon,
      slug: slugify(body.name),
      featured: body.featured || false,
      status: "active",
      productCount: 0,
      subcategoryCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("categories").insertOne(category)

    return NextResponse.json(
      { 
        message: "Category created successfully", 
        category: {
          _id: result.insertedId,
          ...category
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const categories = await db.collection("categories")
      .find({})
      .toArray()
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return mock data if MongoDB is not available
    console.log("Using mock categories data")
    return NextResponse.json(mockCategories)
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Delete the category
    const result = await db.collection("categories").deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Get updated list after deletion
    const updatedCategories = await db.collection("categories")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      message: "Category deleted successfully",
      categories: updatedCategories
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const body = await request.json()

    console.log('Received update request for id:', id)
    console.log('Update data:', body)

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // First check if category exists
    const existingCategory = await db.collection("categories").findOne({
      _id: new ObjectId(id)
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // If updating name, check for duplicates (excluding current category)
    if (body.name && body.name !== existingCategory.name) {
      const duplicateCategory = await db.collection("categories").findOne({
        name: { $regex: new RegExp(`^${body.name}$`, 'i') },
        _id: { $ne: new ObjectId(id) }
      })

      if (duplicateCategory) {
        return NextResponse.json(
          { error: "A category with this name already exists" },
          { status: 400 }
        )
      }
    }

    // Prepare update data with proper type handling
    const updateData = {
      ...existingCategory, // Start with existing data
      ...body, // Override with new data
      featured: typeof body.featured === 'boolean' ? body.featured : existingCategory.featured,
      status: body.status || existingCategory.status,
      updatedAt: new Date(),
      // Update slug if name is changed
      ...(body.name && { slug: slugify(body.name) })
    }

    // Remove _id from update data
    delete updateData._id

    console.log('Final update data:', updateData)

    // Update the category
    const result = await db.collection("categories").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update category" },
        { status: 500 }
      )
    }

    // Get the updated category
    const updatedCategory = await db.collection("categories").findOne({
      _id: new ObjectId(id)
    })

    console.log('Updated category:', updatedCategory)

    return NextResponse.json({
      message: "Category updated successfully",
      category: updatedCategory
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
} 