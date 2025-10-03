"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, Trash, Eye, Plus, Star, StarOff, Package, Layers } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  subcategories: number
  status: "active" | "inactive"
  featured: boolean
}

export function CategoriesTable() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setCategories([
        {
          id: "CAT-1234",
          name: "Computers & Laptops",
          slug: "computers-laptops",
          description: "Desktop computers, laptops, and accessories",
          productCount: 156,
          subcategories: 5,
          status: "active",
          featured: true,
        },
        {
          id: "CAT-2345",
          name: "Smartphones & Tablets",
          slug: "smartphones-tablets",
          description: "Mobile phones, tablets, and accessories",
          productCount: 98,
          subcategories: 3,
          status: "active",
          featured: true,
        },
        {
          id: "CAT-3456",
          name: "Gaming",
          slug: "gaming",
          description: "Gaming consoles, games, and accessories",
          productCount: 72,
          subcategories: 4,
          status: "active",
          featured: true,
        },
        {
          id: "CAT-4567",
          name: "Audio",
          slug: "audio",
          description: "Headphones, speakers, and audio equipment",
          productCount: 64,
          subcategories: 3,
          status: "active",
          featured: true,
        },
        {
          id: "CAT-5678",
          name: "Wearables",
          slug: "wearables",
          description: "Smartwatches, fitness trackers, and wearable tech",
          productCount: 45,
          subcategories: 2,
          status: "active",
          featured: false,
        },
        {
          id: "CAT-6789",
          name: "Networking",
          slug: "networking",
          description: "Routers, switches, and networking equipment",
          productCount: 38,
          subcategories: 3,
          status: "active",
          featured: false,
        },
        {
          id: "CAT-7890",
          name: "Components",
          slug: "components",
          description: "Computer parts and components",
          productCount: 112,
          subcategories: 6,
          status: "active",
          featured: false,
        },
        {
          id: "CAT-8901",
          name: "Accessories",
          slug: "accessories",
          description: "Various tech accessories",
          productCount: 87,
          subcategories: 4,
          status: "active",
          featured: false,
        },
        {
          id: "CAT-9012",
          name: "Clearance",
          slug: "clearance",
          description: "Discounted and clearance items",
          productCount: 23,
          subcategories: 0,
          status: "inactive",
          featured: false,
        },
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getStatusBadge = (status: Category["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-500/20 text-gray-600 dark:text-gray-400">Inactive</Badge>
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border">
      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Subcategories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="group">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{category.productCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span>{category.subcategories}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(category.status)}</TableCell>
                  <TableCell>
                    {category.featured ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Badge className="bg-yellow-500/20 text-yellow-600">Featured</Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <StarOff className="h-4 w-4" />
                        <span>—</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Products
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Subcategory
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {category.featured ? (
                            <>
                              <StarOff className="mr-2 h-4 w-4" />
                              Remove from Featured
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Add to Featured
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
