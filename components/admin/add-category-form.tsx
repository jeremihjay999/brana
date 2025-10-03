"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Search, Laptop, Smartphone, Headphones, Camera, Watch, Tv, 
  Monitor, Mouse, Keyboard, Speaker, Printer, Router, Server, 
  GamepadIcon, Battery, Bluetooth, Wifi, Cloud, Database, 
  ShoppingBag, Package, Box, Gift, Tag, Star } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Category {
  _id: string
  name: string
  description: string
  icon: string
  featured: boolean
  status: "active" | "inactive"
}

interface AddCategoryFormProps {
  onSuccess?: (data?: any) => void
  initialData?: Category
}

// Create a mapping of icon names to their components
const iconComponents = {
  Laptop,
  Smartphone,
  Headphones,
  Camera,
  Watch,
  Tv,
  Monitor,
  Mouse,
  Keyboard,
  Speaker,
  Printer,
  Router,
  Server,
  GamepadIcon,
  Battery,
  Bluetooth,
  Wifi,
  Cloud,
  Database,
  ShoppingBag,
  Package,
  Box,
  Gift,
  Tag,
  Star
}

export function AddCategoryForm({ onSuccess, initialData }: AddCategoryFormProps) {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIcon, setSelectedIcon] = useState<string | null>(initialData?.icon || null)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "",
    featured: initialData?.featured || false,
    status: initialData?.status || "active",
  })

  // Filter icons based on search query
  const filteredIcons = Object.keys(iconComponents).filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIcon) {
      toast.error("Please select an icon")
      return
    }
    setLoading(true)

    try {
      const endpoint = initialData ? `/api/categories?id=${initialData._id}` : "/api/categories"
      const method = initialData ? "PATCH" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          icon: selectedIcon,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process category")
      }

      toast.success(initialData ? "Category updated successfully" : "Category added successfully")
      
      if (!initialData) {
        // Only reset form for new categories
        setFormData({
          name: "",
          description: "",
          icon: "",
          featured: false,
          status: "active",
        })
        setSelectedIcon(null)
      }

      // Pass the updated/new category data back
      onSuccess?.(data.category)
    } catch (error: any) {
      toast.error(error.message || (initialData ? "Failed to update category" : "Failed to add category"))
      console.error("Error processing category:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? (checked ? "active" : "inactive") : checked,
    }))
  }

  // Auto-select an icon based on category name
  useEffect(() => {
    if (formData.name && !selectedIcon) {
      const categoryName = formData.name.toLowerCase()
      const matchingIcon = Object.keys(iconComponents).find((iconName) =>
        iconName.toLowerCase().includes(categoryName)
      )
      if (matchingIcon) {
        setSelectedIcon(matchingIcon)
      }
    }
  }, [formData.name, selectedIcon])

  const renderIcon = (iconName: string) => {
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents]
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-4">
        <Label>Icon Selection</Label>
        <div className="relative">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
          {filteredIcons.map((iconName) => (
            <button
              key={iconName}
              type="button"
              onClick={() => setSelectedIcon(iconName)}
              className={`p-2 rounded-md hover:bg-accent ${
                selectedIcon === iconName ? "bg-accent" : ""
              }`}
            >
              {renderIcon(iconName)}
            </button>
          ))}
        </div>

        {selectedIcon && (
          <div className="flex items-center gap-2">
            <Label>Selected Icon:</Label>
            {renderIcon(selectedIcon)}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Featured Category</Label>
          <div className="text-[0.8rem] text-muted-foreground">
            Display this category in the featured section
          </div>
        </div>
        <Switch
          checked={formData.featured}
          onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Status</Label>
          <div className="text-[0.8rem] text-muted-foreground">
            Enable or disable this category
          </div>
        </div>
        <Switch
          checked={formData.status === "active"}
          onCheckedChange={(checked) => handleSwitchChange("status", checked)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : initialData ? "Update Category" : "Add Category"}
      </Button>
    </form>
  )
} 