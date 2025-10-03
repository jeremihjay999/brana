"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddCategoryForm } from "@/components/admin/add-category-form"
import { Plus, Eye, Pencil, Star, Search, Filter, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { renderIcon } from "@/lib/icons"

interface Category {
  _id: string
  name: string
  description: string
  icon: string
  slug: string
  featured: boolean
  productCount?: number
  subcategoryCount?: number
  status: "active" | "inactive"
  createdAt: string
}

export default function CategoriesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
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
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete category")
      }

      const data = await response.json()
      setCategories(data.categories)
      toast.success("Category deleted successfully")
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error(error.message || "Failed to delete category")
    }
  }

  const handleEdit = async (formData: CategoryFormData) => {
    if (!editingCategory) return;
    
    try {
      setLoading(true);
      
      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        featured: formData.featured,
        status: formData.status
      };
      
      console.log('Sending update data:', updateData);
      
      const response = await fetch(`/api/categories?id=${editingCategory._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update category');
      }
      
      // Refresh categories to get latest data
      await fetchCategories();
      
      toast.success('Category updated successfully');
      setShowEditDialog(false);
      
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update category');
      
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (categoryId: string, currentFeatured: boolean) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !currentFeatured
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update featured status');
      }
      
      // Refresh categories to get latest data
      await fetchCategories();
      
      toast.success('Featured status updated successfully');
      
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update featured status');
      
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories?id=${category._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: category.status === "active" ? "inactive" : "active",
        }),
      })
      if (!response.ok) throw new Error("Failed to update category")
      
      toast.success("Category status updated successfully")
      fetchCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update status")
    }
  }

  // Ensure consistent boolean values for featured flag
  const filteredCategories = categories.map(category => ({
    ...category,
    featured: Boolean(category.featured)
  })).filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Use strict boolean comparison
  const featuredCategories = filteredCategories.filter(cat => cat.featured === true)
  const nonFeaturedCategories = filteredCategories.filter(cat => cat.featured === false)

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white text-gray-900">Categories</h1>
          <p className="dark:text-gray-400 text-gray-500">Manage product categories and subcategories</p>
        </div>
        <Button 
          className="gap-2 bg-gradient-to-r from-[#00C3A5] to-[#00A896] hover:opacity-90 text-white"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-h-[90vh] overflow-hidden dark:bg-[#1A1F2C] bg-white dark:border-gray-700 border-gray-200">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="dark:text-white text-gray-900">Add New Category</DialogTitle>
            <DialogDescription className="dark:text-gray-400 text-gray-500">
              Fill in the details to create a new category.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
            <AddCategoryForm 
              onSuccess={() => {
                fetchCategories()
                setShowAddForm(false)
                toast.success("Category added successfully")
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Featured Categories Grid */}
      {featuredCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCategories.map((category) => (
            <div 
              key={category._id} 
              className="relative rounded-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #094F4E 0%, #083636 100%)",
              }}
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#0D5C5B]">
                    {renderIcon(category.icon, "h-6 w-6 text-[#00C3A5]")}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => toggleFeatured(category._id, category.featured)}
                    className="flex items-center gap-1.5 px-3 py-1.5 dark:bg-[#2A3446] bg-gray-100 dark:hover:bg-[#2A3446]/80 hover:bg-gray-200 rounded-full"
                  >
                    <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                    <span className="text-xs font-medium text-[#FFD700]">Featured</span>
                  </Button>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-sm dark:text-gray-400 text-gray-500">{products.filter(p => p.category === category.slug || p.category === category.name).length} products</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 gap-2 bg-gradient-to-r from-[#00C3A5] to-[#00A896] hover:opacity-90 text-white"
                  >
                    <Eye className="h-4 w-4" /> View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2 dark:bg-transparent bg-white dark:border-gray-700 border-gray-200 dark:text-gray-200 text-gray-900 dark:hover:bg-gray-800/30 hover:bg-gray-100"
                    onClick={() => {
                      setEditingCategory(category)
                      setShowEditDialog(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(category._id)}
                  className="absolute top-2 right-2 dark:text-white text-red-500 hover:text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Categories Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">All Categories</h2>
          <p className="dark:text-gray-400 text-gray-500">View and manage your product categories</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 dark:text-gray-400 text-gray-500" />
            <Input 
              placeholder="Search categories..." 
              className="pl-9 dark:bg-[#1A1F2C] bg-white dark:border-gray-800 border-gray-200 dark:text-gray-200 text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="dark:border-gray-700 border-gray-200">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

        <div className="dark:bg-[#1A1F2C] bg-white rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase dark:border-gray-800 border-gray-200">
              <tr>
                <th className="px-4 py-3 dark:text-gray-400 text-gray-500">Name</th>
                <th className="px-4 py-3 dark:text-gray-400 text-gray-500">Slug</th>
                <th className="px-4 py-3 dark:text-gray-400 text-gray-500">Products</th>
                <th className="px-4 py-3 dark:text-gray-400 text-gray-500">Subcategories</th>
                <th className="px-4 py-3 dark:text-gray-400 text-gray-500">Status</th>
                <th className="px-4 py-3 dark:text-gray-400 text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800 divide-gray-200">
              {nonFeaturedCategories.map((category) => (
                <tr key={category._id} className="dark:hover:bg-gray-800/50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium dark:text-white text-gray-900">{category.name}</td>
                  <td className="px-4 py-3 dark:text-gray-400 text-gray-500">{category.slug}</td>
                  <td className="px-4 py-3 dark:text-gray-400 text-gray-500">{products.filter(p => p.category === category.slug || p.category === category.name).length}</td>
                  <td className="px-4 py-3 dark:text-gray-400 text-gray-500">{category.subcategoryCount || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      category.status === "active" 
                        ? "bg-gradient-to-r from-[#00C3A5] to-[#00A896] text-white" 
                        : "bg-red-500/20 text-red-500"
                    }`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 dark:hover:bg-gray-800 hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 dark:hover:bg-gray-800 hover:bg-gray-100"
                        onClick={() => {
                          setEditingCategory(category)
                          setShowEditDialog(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(category._id)}
                        className="h-8 w-8 dark:text-gray-400 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-h-[90vh] overflow-hidden dark:bg-[#1A1F2C] bg-white dark:border-gray-700 border-gray-200">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="dark:text-white text-gray-900">Edit Category</DialogTitle>
            <DialogDescription className="dark:text-gray-400 text-gray-500">
              Make changes to the category here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
              <AddCategoryForm
                initialData={editingCategory}
                onSuccess={(data) => handleEdit(data)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
