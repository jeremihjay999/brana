"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Laptop, Smartphone, Gamepad, Headphones, Watch, Wifi, Cpu, Package, Star, Eye, Edit } from "lucide-react"

interface CategoryCard {
  id: string
  name: string
  icon: keyof typeof icons
  productCount: number
  featured: boolean
}

const icons = {
  Laptop,
  Smartphone,
  Gamepad,
  Headphones,
  Watch,
  Wifi,
  Cpu,
  Package,
}

export function CategoryCards() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<CategoryCard[]>([])

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setCategories([
        {
          id: "CAT-1234",
          name: "Computers & Laptops",
          icon: "Laptop",
          productCount: 156,
          featured: true,
        },
        {
          id: "CAT-2345",
          name: "Smartphones & Tablets",
          icon: "Smartphone",
          productCount: 98,
          featured: true,
        },
        {
          id: "CAT-3456",
          name: "Gaming",
          icon: "Gamepad",
          productCount: 72,
          featured: true,
        },
        {
          id: "CAT-4567",
          name: "Audio",
          icon: "Headphones",
          productCount: 64,
          featured: true,
        },
      ])
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex h-[100px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const Icon = icons[category.icon]
        return (
          <Card
            key={category.id}
            className="group overflow-hidden border-none shadow-sm transition-all hover:shadow-md"
          >
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                <div className="flex flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {category.featured && (
                      <Badge className="flex items-center gap-1 bg-yellow-500/20 text-yellow-600">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{category.productCount} products</p>

                  <div className="mt-6 flex items-center gap-2">
                    <Button variant="default" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
