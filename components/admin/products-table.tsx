"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, Trash, Download } from "lucide-react"
import { toast } from "sonner"
import { AddProductForm } from "./add-product-form"

interface Product {
  _id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  images: {
    url: string
    type: "url" | "file"
  }[]
  createdAt: string
  updatedAt: string
  tags?: string[]
}

interface Category {
  _id: string
  name: string
  slug: string
}

interface ProductsTableProps {
  searchQuery?: string
  selectedCategory?: string
  categories: Category[]
  products: Product[]
  onProductsChange: (products: Product[]) => void
  refreshProducts: () => Promise<void>
  loading: boolean
}

export function ProductsTable({ 
  searchQuery = "", 
  selectedCategory = "", 
  categories = [],
  products,
  onProductsChange,
  refreshProducts,
  loading
}: ProductsTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete product")
      }

      await refreshProducts()
      toast.success("Product deleted successfully")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete product")
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setShowEditDialog(true)
  }

  const handleEditSuccess = async (data: any) => {
    await refreshProducts()
    setShowEditDialog(false)
    setEditingProduct(null)
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map((product) => product._id))
    }
  }

  const toggleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const handleExport = () => {
    // Filter selected products or use all if none selected
    const productsToExport = selectedProducts.length > 0
      ? products.filter(product => selectedProducts.includes(product._id))
      : products

    // Prepare CSV data
    const csvData = [
      // Headers
      ['ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Created At'].join(','),
      // Rows
      ...productsToExport.map(product => [
        product._id,
        `"${product.name}"`,
        `"${product.category}"`,
        product.price,
        product.stock,
        product.status,
        new Date(product.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    // Create and trigger download
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', 'products.csv')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">Low Stock</Badge>
      case "out-of-stock":
        return <Badge className="bg-red-500/20 text-red-600 dark:text-red-400">Out of Stock</Badge>
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
      ) : products.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all products"
                  />
                </TableHead>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product._id)}
                      onCheckedChange={() => toggleSelectProduct(product._id)}
                      aria-label={`Select ${product.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        product.images.map((image, index) => (
                          <div key={index} className="relative w-10 h-10">
                            <Image
                              src={image.url}
                              alt={`${product.name} image ${index + 1}`}
                              fill
                              className="rounded-md object-cover ring-2 ring-background"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="relative w-10 h-10">
                          <Image
                            src="/placeholder.svg"
                            alt={product.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.tags && product.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map(tag => (
                          <span key={tag} className="inline-block bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>Ksh {product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product._id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Make changes to the product details below.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto pr-6">
                {editingProduct && (
                  <AddProductForm
                    initialData={editingProduct}
                    categories={categories}
                    onSuccess={handleEditSuccess}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
