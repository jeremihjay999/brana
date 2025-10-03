"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductsTable } from "@/components/admin/products-table"
import { AddProductForm } from "@/components/admin/add-product-form"
import { Plus, Filter, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Category {
  _id: string
  name: string
  slug: string
}

export default function ProductsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    refreshProducts()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to fetch categories")
    }
  }

  const refreshProducts = async () => {
    try {
      setLoading(true)
      let url = "/api/products"
      const params = new URLSearchParams()
      
      if (searchQuery) {
        params.append("search", searchQuery)
      }
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      
      // Handle both array and object responses
      const productsArray = Array.isArray(data) ? data : (data.products || [])
      
      // Sort products by date in descending order (newest first)
      const sortedProducts = productsArray.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setProducts(sortedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  // Add useEffect to refresh products when search or category changes
  useEffect(() => {
    refreshProducts()
  }, [searchQuery, selectedCategory])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and listings</p>
        </div>
        <Button 
          className="gap-2 bg-gradient-to-r from-[#00C3A5] to-[#00A896] hover:opacity-90 text-white"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-h-[90vh] flex flex-col gap-0 p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new product.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <AddProductForm 
              categories={categories}
              onSuccess={() => {
                setShowAddDialog(false)
                refreshProducts()
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input 
          placeholder="Search products..." 
          className="sm:max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-1 items-center gap-2 sm:justify-end">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProductsTable 
        searchQuery={searchQuery} 
        selectedCategory={selectedCategory === 'all' ? '' : selectedCategory}
        categories={categories}
        products={products}
        onProductsChange={setProducts}
        refreshProducts={refreshProducts}
        loading={loading}
      />
    </div>
  )
}
