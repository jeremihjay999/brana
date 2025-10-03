"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import * as LucideIcons from "lucide-react"
import { Cpu } from "lucide-react"

// Predefined color palette
const colorPalette = [
  "bg-red-500/10 text-red-500",
  "bg-green-500/10 text-green-500",
  "bg-blue-500/10 text-blue-500",
  "bg-purple-500/10 text-purple-500",
  "bg-yellow-500/10 text-yellow-500",
  "bg-pink-500/10 text-pink-500",
  "bg-orange-500/10 text-orange-500",
  "bg-teal-500/10 text-teal-500",
  "bg-indigo-500/10 text-indigo-500",
  "bg-cyan-500/10 text-cyan-500",
]

// Fixed color assignments for specific categories
const fixedColorMap = {
  "Audio": "bg-red-500/10 text-red-500",
  "Smartphone $ Tablets": "bg-green-500/10 text-green-500",
  "test": "bg-purple-500/10 text-purple-500",
}

// Function to get color for a category
function getCategoryColor(categoryName: string, index: number): string {
  // First check if there's a fixed color assignment
  if (fixedColorMap[categoryName]) {
    return fixedColorMap[categoryName]
  }
  
  // Otherwise, assign a color from the palette based on index
  return colorPalette[index % colorPalette.length]
}

interface Category {
  _id: string
  name: string
  slug: string
  icon: string
  featured?: boolean
}

export function CategoryBrowser() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError(error instanceof Error ? error.message : "Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getIcon = (iconName: string) => {
    // Get the icon component from Lucide Icons
    const Icon = (LucideIcons as any)[iconName] || Cpu
    return Icon
  }

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter">Browse Categories</h2>
            <p className="mt-2 text-muted-foreground">Loading categories...</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="h-full animate-pulse">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="h-12 w-12 rounded-full bg-muted"></div>
                  <div className="mt-3 h-4 w-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter">Browse Categories</h2>
            <p className="mt-2 text-red-500">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tighter">Browse Categories</h2>
          <p className="mt-2 text-muted-foreground">
            Explore our wide range of tech categories to find exactly what you need
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((category, index) => {
            const Icon = getIcon(category.icon)
            const color = getCategoryColor(category.name, index)
            
            return (
              <Link key={category._id} href={`/category/${category.slug}`}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className={`rounded-full p-3 ${color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 font-medium">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
