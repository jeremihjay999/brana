import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

const sampleProducts = [
  {
    name: "LEGO Classic Creative Bricks",
    description: "Build anything you can imagine with this classic LEGO set. Perfect for creative play and learning.",
    category: "Building Blocks",
    price: 2500,
    stock: 20,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: false,
    featured: true,
    tags: ["building", "creative", "classic", "lego"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Barbie Dreamhouses",
    description: "Beautiful dollhouse for imaginative play. Features multiple rooms and accessories.",
    category: "Dolls & Accessories",
    price: 5000,
    stock: 8,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: true,
    dealPrice: 5000,
    previousPrice: 8500,
    featured: true,
    tags: ["dollhouse", "barbie", "imagination", "pretend play"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Fisher-Price Learning Laptop",
    description: "Educational laptop for toddlers. Teaches letters, numbers, and basic concepts.",
    category: "Educational Toys",
    price: 1800,
    stock: 15,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: false,
    featured: true,
    tags: ["educational", "laptop", "learning", "toddler"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "VTech Kidizoom Camera",
    description: "Digital camera designed for kids. Durable and easy to use with fun effects.",
    category: "Electronic Toys",
    price: 2900,
    stock: 12,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: false,
    featured: true,
    tags: ["camera", "digital", "electronic", "photography"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "LEGO Technic Race Car",
    description: "Build and race with this amazing LEGO Technic set. Advanced building for older kids.",
    category: "Building Blocks",
    price: 3400,
    stock: 10,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: true,
    dealPrice: 3400,
    previousPrice: 3800,
    featured: true,
    tags: ["lego", "technic", "race car", "advanced"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Colorful Building Blocks Set",
    description: "Vibrant building blocks for creative play. Safe and durable for all ages.",
    category: "Building Blocks",
    price: 1200,
    stock: 25,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: true,
    dealPrice: 1200,
    previousPrice: 1800,
    featured: false,
    tags: ["building", "colorful", "creative", "safe"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Toy Cars Collection",
    description: "Set of 6 die-cast toy cars. Perfect for racing and collecting.",
    category: "Toys",
    price: 800,
    stock: 30,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: true,
    dealPrice: 800,
    previousPrice: 1200,
    featured: false,
    tags: ["cars", "die-cast", "collection", "racing"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Spinning Top Set",
    description: "Traditional spinning tops with modern design. Great for hand-eye coordination.",
    category: "Toys",
    price: 600,
    stock: 20,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: false,
    featured: false,
    tags: ["spinning", "traditional", "wooden", "coordination"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const sampleCategories = [
  {
    name: "Building Blocks",
    description: "Creative building sets and blocks",
    icon: "blocks",
    slug: "building-blocks",
    featured: true,
    status: "active",
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Dolls & Accessories",
    description: "Dolls, dollhouses, and accessories",
    icon: "doll",
    slug: "dolls-accessories",
    featured: true,
    status: "active",
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Educational Toys",
    description: "Learning and educational toys",
    icon: "book",
    slug: "educational-toys",
    featured: true,
    status: "active",
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Electronic Toys",
    description: "Electronic and digital toys",
    icon: "smartphone",
    slug: "electronic-toys",
    featured: true,
    status: "active",
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Toys",
    description: "General toys and games",
    icon: "gamepad",
    slug: "toys",
    featured: false,
    status: "active",
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export async function POST() {
  try {
    const { db } = await connectToDatabase()
    
    // Check if products already exist
    const existingProducts = await db.collection("products").countDocuments()
    const existingCategories = await db.collection("categories").countDocuments()
    
    let productsAdded = 0
    let categoriesAdded = 0
    
    // Add products if none exist
    if (existingProducts === 0) {
      const productResult = await db.collection("products").insertMany(sampleProducts)
      productsAdded = productResult.insertedCount
    }
    
    // Add categories if none exist
    if (existingCategories === 0) {
      const categoryResult = await db.collection("categories").insertMany(sampleCategories)
      categoriesAdded = categoryResult.insertedCount
    }
    
    return NextResponse.json({
      success: true,
      message: "Sample data seeding completed",
      productsAdded,
      categoriesAdded,
      existingProducts,
      existingCategories
    })
    
  } catch (error) {
    console.error("Error seeding sample data:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to seed sample data",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const productCount = await db.collection("products").countDocuments()
    const categoryCount = await db.collection("categories").countDocuments()
    
    return NextResponse.json({
      success: true,
      productCount,
      categoryCount,
      hasData: productCount > 0 && categoryCount > 0
    })
    
  } catch (error) {
    console.error("Error checking data status:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to check data status",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

