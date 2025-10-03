"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Trash } from "lucide-react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
  sku?: string
  images: {
    url: string
    type: "url" | "file"
  }[]
  attributes: {
    [key: string]: string
  }
}

interface VariantRow {
  name: string
  value: string
  sku: string
  price: number
  stock: number
}

interface Product {
  _id?: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  images: {
    url: string
    type: "url" | "file"
  }[]
  isDeal?: boolean
  previousPrice?: number
  dealPrice?: number
  tags?: string[]
  hasVariants?: boolean
  variants?: ProductVariant[]
  variantAttributes?: {
    name: string
    options: string[]
  }[]
  // New variant creation fields
  newVariantName?: string
  newVariantSku?: string
  newVariantPrice?: number
  newVariantStock?: number
  newVariantImageUrl?: string
  newVariantImages?: {
    url: string
    type: "url" | "file"
  }[]
  // Variant table fields
  variantType?: string
  variantRows?: VariantRow[]
  // Media fields
  externalVideoUrl?: string
}

interface Category {
  _id: string
  name: string
  slug: string
}

interface AddProductFormProps {
  initialData?: Product
  categories: Category[]
  onSuccess: (data: any) => void
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
      {/* Text Style Group */}
      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <select
          onChange={(e) => {
            const value = e.target.value
            if (value === 'paragraph') {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level: parseInt(value) }).run()
            }
          }}
          className="h-8 px-2 rounded bg-background border text-sm"
          value={
            editor.isActive('heading', { level: 1 })
              ? '1'
              : editor.isActive('heading', { level: 2 })
              ? '2'
              : editor.isActive('heading', { level: 3 })
              ? '3'
              : 'paragraph'
          }
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
      </div>

      {/* Text Formatting Group */}
      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('bold') ? 'bg-muted' : ''}`}
          title="Bold"
        >
          <b>B</b>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('italic') ? 'bg-muted' : ''}`}
          title="Italic"
        >
          <i>I</i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('underline') ? 'bg-muted' : ''}`}
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('strike') ? 'bg-muted' : ''}`}
          title="Strike"
        >
          <s>S</s>
        </button>
      </div>

      {/* Lists Group */}
      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
          title="Numbered List"
        >
          1. List
        </button>
      </div>

      {/* Alignment Group */}
      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}`}
          title="Align Left"
        >
          ←
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}`}
          title="Align Center"
        >
          ↔
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 rounded hover:bg-muted ${editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}`}
          title="Align Right"
        >
          →
        </button>
      </div>

      {/* Links Group */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            const url = window.prompt('Enter the URL')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={`p-1 rounded hover:bg-muted ${editor.isActive('link') ? 'bg-muted' : ''}`}
          title="Add Link"
        >
          🔗
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          className="p-1 rounded hover:bg-muted"
          title="Remove Link"
          disabled={!editor.isActive('link')}
        >
          Unlink
        </button>
      </div>
    </div>
  )
}

export function AddProductForm({ initialData, categories, onSuccess }: AddProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      images: [],
      isDeal: false,
      previousPrice: undefined,
      dealPrice: undefined,
      tags: [],
      hasVariants: false,
      variants: [],
      variantAttributes: [],
      variantType: "Size",
      variantRows: [],
    }
  )
  const [imageType, setImageType] = useState<"url" | "file">("url")
  const [imageUrl, setImageUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tagInput, setTagInput] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content: formData.description,
    onUpdate: ({ editor }) => {
      handleChange('description', editor.getHTML())
    },
  })

  // Update editor content when formData.description changes
  useEffect(() => {
    if (editor && formData.description !== editor.getHTML()) {
      editor.commands.setContent(formData.description)
    }
  }, [formData.description, editor])

  const handleImageAdd = () => {
    if (formData.images && formData.images.length >= 3) {
      toast.error("Maximum of 3 images allowed")
      return
    }

    if (imageType === "url") {
      if (!imageUrl) {
        toast.error("Please enter an image URL")
        return
      }
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), { url: imageUrl, type: "url" }]
      }))
      setImageUrl("")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    if (formData.images && formData.images.length >= 3) {
      toast.error("Maximum of 3 images allowed")
      return
    }

    const file = e.target.files[0]
    try {
      setLoading(true)
      
      // Create FormData and append file and type
      const formDataObj = new FormData()
      formDataObj.append("image", file)
      formDataObj.append("type", "product") // Specify the type for Cloudinary preset

      // Upload to Cloudinary
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        console.error("Upload error response:", errorData);
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await uploadResponse.json()

      if (!data.url) {
        throw new Error("No URL returned from upload");
      }

      // Add the uploaded image URL to the form data
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), { url: data.url, type: "file" }]
      }))
      
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setLoading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleImageRemove = async (index: number) => {
    const imageToRemove = formData.images?.[index]
    
    if (imageToRemove?.type === "file" && imageToRemove.url.includes("cloudinary")) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageToRemove.url.split('/')
        const publicId = urlParts[urlParts.length - 1].split('.')[0]
        
        // Delete from Cloudinary
        const response = await fetch(`/api/upload?public_id=${publicId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          console.error("Failed to delete image from Cloudinary")
          // Continue with removing from form data even if Cloudinary deletion fails
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error)
        // Continue with removing from form data even if Cloudinary deletion fails
      }
    }

    // Remove from form data
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()]
        }))
      }
      setTagInput("")
    }
  }
  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)

      const response = await fetch("/api/products" + (initialData?._id ? `?id=${initialData._id}` : ""), {
        method: initialData ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save product")
      }

      onSuccess(data)
      toast.success(initialData ? "Product updated successfully" : "Product created successfully")
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Variant management functions
  const addVariantAttribute = () => {
    setFormData(prev => ({
      ...prev,
      variantAttributes: [...(prev.variantAttributes || []), { name: "", options: [] }]
    }))
  }

  const updateVariantAttribute = (index: number, field: 'name' | 'options', value: any) => {
    setFormData(prev => ({
      ...prev,
      variantAttributes: prev.variantAttributes?.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }))
  }

  const removeVariantAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variantAttributes: prev.variantAttributes?.filter((_, i) => i !== index)
    }))
  }

  const addVariantOption = (attrIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variantAttributes: prev.variantAttributes?.map((attr, i) => 
        i === attrIndex ? { ...attr, options: [...attr.options, ""] } : attr
      )
    }))
  }

  const updateVariantOption = (attrIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      variantAttributes: prev.variantAttributes?.map((attr, i) => 
        i === attrIndex ? {
          ...attr,
          options: attr.options.map((opt, j) => j === optionIndex ? value : opt)
        } : attr
      )
    }))
  }

  const removeVariantOption = (attrIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variantAttributes: prev.variantAttributes?.map((attr, i) => 
        i === attrIndex ? {
          ...attr,
          options: attr.options.filter((_, j) => j !== optionIndex)
        } : attr
      )
    }))
  }

  const generateVariants = () => {
    if (!formData.variantAttributes || formData.variantAttributes.length === 0) return

    const attributes = formData.variantAttributes.filter(attr => 
      attr.name.trim() && attr.options.length > 0 && attr.options.every(opt => opt.trim())
    )

    if (attributes.length === 0) {
      toast.error("Please add at least one attribute with options")
      return
    }

    // Generate all combinations
    const combinations: any[] = []
    const generateCombinations = (current: any, remaining: any[]) => {
      if (remaining.length === 0) {
        combinations.push(current)
        return
      }

      const [attr, ...rest] = remaining
      attr.options.forEach((option: string) => {
        generateCombinations({
          ...current,
          [attr.name]: option
        }, rest)
      })
    }

    generateCombinations({}, attributes)

    // Create variants
    const variants: ProductVariant[] = combinations.map((combo, index) => ({
      id: `variant-${Date.now()}-${index}`,
      name: Object.values(combo).join(" - "),
      price: formData.price || 0,
      stock: formData.stock || 0,
      sku: `${formData.name?.toLowerCase().replace(/\s+/g, '-')}-${Object.values(combo).join('-').toLowerCase()}`,
      images: [], // Start with empty images array
      attributes: combo
    }))

    setFormData(prev => ({
      ...prev,
      variants
    }))

    toast.success(`Generated ${variants.length} variants`)
  }

  const updateVariant = (variantId: string, field: keyof ProductVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map(variant => 
        variant.id === variantId ? { ...variant, [field]: value } : variant
      )
    }))
  }

  const removeVariant = (variantId: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.filter(variant => variant.id !== variantId)
    }))
  }

  // Variant image management functions
  const addVariantImage = async (variantId: string, file: File) => {
    try {
      setLoading(true)
      
      // Create FormData and append file and type
      const formDataObj = new FormData()
      formDataObj.append("image", file)
      formDataObj.append("type", "product") // Specify the type for Cloudinary preset

      // Upload to Cloudinary
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        console.error("Upload error response:", errorData);
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await uploadResponse.json()

      if (!data.url) {
        throw new Error("No URL returned from upload");
      }

      // Add the uploaded image URL to the variant
      setFormData(prev => ({
        ...prev,
        variants: prev.variants?.map(variant => 
          variant.id === variantId 
            ? { ...variant, images: [...variant.images, { url: data.url, type: "file" }] }
            : variant
        )
      }))
      
      toast.success("Variant image uploaded successfully")
    } catch (error) {
      console.error("Error uploading variant image:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload variant image")
    } finally {
      setLoading(false)
    }
  }

  const addVariantImageUrl = (variantId: string, imageUrl: string) => {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL")
      return
    }

    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map(variant => 
        variant.id === variantId 
          ? { ...variant, images: [...variant.images, { url: imageUrl, type: "url" }] }
          : variant
      )
    }))
  }

  const removeVariantImage = async (variantId: string, imageIndex: number) => {
    const variant = formData.variants?.find(v => v.id === variantId)
    const imageToRemove = variant?.images[imageIndex]
    
    if (imageToRemove?.type === "file" && imageToRemove.url.includes("cloudinary")) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageToRemove.url.split('/')
        const publicId = urlParts[urlParts.length - 1].split('.')[0]
        
        // Delete from Cloudinary
        const response = await fetch(`/api/upload?public_id=${publicId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          console.error("Failed to delete variant image from Cloudinary")
        }
      } catch (error) {
        console.error("Error deleting variant image from Cloudinary:", error)
      }
    }

    // Remove from variant images
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map(variant => 
        variant.id === variantId 
          ? { ...variant, images: variant.images.filter((_, i) => i !== imageIndex) }
          : variant
      )
    }))
  }

  // Manual variant creation functions
  const addNewVariantImage = async (file: File) => {
    try {
      setLoading(true)
      
      const formDataObj = new FormData()
      formDataObj.append("image", file)
      formDataObj.append("type", "product")

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await uploadResponse.json()

      if (!data.url) {
        throw new Error("No URL returned from upload");
      }

      setFormData(prev => ({
        ...prev,
        newVariantImages: [...(prev.newVariantImages || []), { url: data.url, type: "file" }]
      }))
      
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setLoading(false)
    }
  }

  const addNewVariantImageUrl = () => {
    if (!formData.newVariantImageUrl?.trim()) {
      toast.error("Please enter an image URL")
      return
    }

    setFormData(prev => ({
      ...prev,
      newVariantImages: [...(prev.newVariantImages || []), { url: prev.newVariantImageUrl!, type: "url" }],
      newVariantImageUrl: ""
    }))
  }

  const removeNewVariantImage = async (imageIndex: number) => {
    const imageToRemove = formData.newVariantImages?.[imageIndex]
    
    if (imageToRemove?.type === "file" && imageToRemove.url.includes("cloudinary")) {
      try {
        const urlParts = imageToRemove.url.split('/')
        const publicId = urlParts[urlParts.length - 1].split('.')[0]
        
        const response = await fetch(`/api/upload?public_id=${publicId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          console.error("Failed to delete image from Cloudinary")
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error)
      }
    }

    setFormData(prev => ({
      ...prev,
      newVariantImages: prev.newVariantImages?.filter((_, i) => i !== imageIndex)
    }))
  }

  const addNewVariant = () => {
    if (!formData.newVariantName || !formData.newVariantPrice || formData.newVariantStock === undefined) {
      toast.error("Please fill in all required fields")
      return
    }

    const newVariant: ProductVariant = {
      id: `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.newVariantName,
      price: formData.newVariantPrice,
      stock: formData.newVariantStock,
      sku: formData.newVariantSku || `${formData.name?.toLowerCase().replace(/\s+/g, '-')}-${formData.newVariantName.toLowerCase().replace(/\s+/g, '-')}`,
      images: formData.newVariantImages || [],
      attributes: {} // Manual variants don't have predefined attributes
    }

    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant],
      newVariantName: "",
      newVariantSku: "",
      newVariantPrice: undefined,
      newVariantStock: undefined,
      newVariantImageUrl: "",
      newVariantImages: []
    }))

    toast.success("Variant added successfully")
  }

  // Variant row management functions
  const addNewVariantRow = () => {
    setFormData(prev => ({
      ...prev,
      variantRows: [...(prev.variantRows || []), {
        name: "",
        value: "",
        sku: "",
        price: 0,
        stock: 0
      }]
    }))
  }

  const updateVariantRow = (index: number, field: keyof VariantRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      variantRows: prev.variantRows?.map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    }))
  }

  const removeVariantRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variantRows: prev.variantRows?.filter((_, i) => i !== index)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <div className="border rounded-md bg-white dark:bg-muted">
          <MenuBar editor={editor} />
          <EditorContent 
            editor={editor} 
            className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter price"
            value={formData.price}
            onChange={(e) => handleChange("price", parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            placeholder="Enter stock quantity"
            value={formData.stock}
            onChange={(e) => handleChange("stock", parseInt(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isDeal"
          checked={!!formData.isDeal}
          onChange={e => handleChange("isDeal", e.target.checked)}
        />
        <Label htmlFor="isDeal">Is this a deal?</Label>
      </div>

      {formData.isDeal && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="previousPrice">Previous Price</Label>
            <Input
              id="previousPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter previous price"
              value={formData.previousPrice ?? ""}
              onChange={e => handleChange("previousPrice", parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dealPrice">Deal Price</Label>
            <Input
              id="dealPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter deal price"
              value={formData.dealPrice ?? ""}
              onChange={e => handleChange("dealPrice", parseFloat(e.target.value))}
              required
            />
          </div>
        </div>
      )}

      {/* Variants Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="hasVariants"
            checked={!!formData.hasVariants}
            onChange={e => handleChange("hasVariants", e.target.checked)}
          />
          <Label htmlFor="hasVariants">This product has variants (e.g., Size, Color)</Label>
        </div>

        {formData.hasVariants && (
          <div className="space-y-6 p-4 border rounded-lg bg-muted/50">
            {/* Instructions */}
            <div className="p-4 bg-brana-green/10 border border-brana-green/20 rounded-lg">
              <h3 className="text-lg font-semibold text-brana-green mb-2">🛍️ Product Variants Setup</h3>
              <p className="text-sm text-gray-700 mb-3">
                Create variants with individual prices, stock quantities, and images. Each variant can have different pricing and inventory levels.
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <div>1. <strong>Add Attributes:</strong> Define variant types (Size, Color, etc.)</div>
                <div>2. <strong>Add Options:</strong> Define values for each attribute</div>
                <div>3. <strong>Generate Variants:</strong> Create all combinations automatically</div>
                <div>4. <strong>Customize:</strong> Set individual prices, stock, and images for each variant</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Variant Attributes</h3>
                <Button type="button" onClick={addVariantAttribute} size="sm" className="bg-brana-green hover:bg-brana-green/90 text-white">
                  + Add Attribute
                </Button>
              </div>

              {formData.variantAttributes?.map((attr, attrIndex) => (
                <div key={attrIndex} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      placeholder="Attribute name (e.g., Size, Color)"
                      value={attr.name}
                      onChange={(e) => updateVariantAttribute(attrIndex, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeVariantAttribute(attrIndex)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {attr.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Input
                            placeholder="Option value (e.g., Small, Red)"
                            value={option}
                            onChange={(e) => updateVariantOption(attrIndex, optionIndex, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeVariantOption(attrIndex, optionIndex)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addVariantOption(attrIndex)}
                      >
                        Add Option
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Product Variants Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Product Variants</h3>
                  <Button 
                    type="button" 
                    onClick={addNewVariantRow}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    + Add Variant
                  </Button>
                </div>

                {/* Variant Type Selector */}
                <div className="space-y-2">
                  <Label>Variant Type</Label>
                  <Select
                    value={formData.variantType || "Size"}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, variantType: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select variant type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Size">Size</SelectItem>
                      <SelectItem value="Color">Color</SelectItem>
                      <SelectItem value="Material">Material</SelectItem>
                      <SelectItem value="Style">Style</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Variants Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                      <div>Variant Name</div>
                      <div>Value</div>
                      <div>SKU</div>
                      <div>Price (KES)</div>
                      <div>Stock</div>
                      <div>Actions</div>
                    </div>
                  </div>
                  
                  <div className="divide-y">
                    {formData.variantRows?.map((variant, index) => (
                      <div key={index} className="px-4 py-3">
                        <div className="grid grid-cols-6 gap-4 items-center">
                          <div>
                            <Input
                              placeholder="e.g., Small, Red, Classic"
                              value={variant.name}
                              onChange={(e) => updateVariantRow(index, 'name', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Value"
                              value={variant.value}
                              onChange={(e) => updateVariantRow(index, 'value', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="SKU"
                              value={variant.sku}
                              onChange={(e) => updateVariantRow(index, 'sku', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={variant.price}
                              onChange={(e) => updateVariantRow(index, 'price', parseFloat(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={variant.stock}
                              onChange={(e) => updateVariantRow(index, 'stock', parseInt(e.target.value) || 0)}
                              className="text-sm"
                            />
                          </div>
                          <div className="flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeVariantRow(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.variantRows && formData.variantRows.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No variants added yet. Click "+ Add Variant" to get started.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Media Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Product Media</h3>
              
              {/* Product Images */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">Product Images</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Drag & drop images here or click to browse</p>
                      <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF, WEBP (Max 5MB each)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="mt-2"
                    >
                      Choose Images
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Videos */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">Product Videos</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Drag & drop videos here or click to browse</p>
                      <p className="text-xs text-gray-500 mt-1">Supported formats: MP4, AVI, MOV, WEBM (Max 50MB each)</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                    >
                      Choose Videos
                    </Button>
                  </div>
                </div>
              </div>

              {/* External Video URL */}
              <div className="space-y-2">
                <Label>External Video URL (YouTube, Vimeo)</Label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.externalVideoUrl || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, externalVideoUrl: e.target.value }))}
                />
              </div>
            </div>

            {/* Generated Variants */}
            {formData.variants && formData.variants.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">✅ Generated Variants ({formData.variants.length})</h3>
                  <div className="text-sm text-gray-600">
                    Each variant has individual price, stock, and image controls
                  </div>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {formData.variants.map((variant) => (
                    <div key={variant.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{variant.name}</h4>
                          <p className="text-sm text-muted-foreground">SKU: {variant.sku}</p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVariant(variant.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Price</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Stock</Label>
                          <Input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <Label>SKU</Label>
                        <Input
                          value={variant.sku || ''}
                          onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                          placeholder="Auto-generated SKU"
                        />
                      </div>

                      {/* Variant Images */}
                      <div className="mt-4 space-y-3">
                        <Label>Variant Images</Label>
                        
                        {/* Image Upload Options */}
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                addVariantImage(variant.id, e.target.files[0])
                              }
                            }}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Or enter image URL"
                            onChange={(e) => {
                              if (e.target.value.trim()) {
                                addVariantImageUrl(variant.id, e.target.value)
                                e.target.value = ""
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addVariantImageUrl(variant.id, e.currentTarget.value)
                                e.currentTarget.value = ""
                              }
                            }}
                            className="flex-1"
                          />
                        </div>

                        {/* Display Variant Images */}
                        {variant.images && variant.images.length > 0 && (
                          <div className="grid gap-2 grid-cols-3">
                            {variant.images.map((image, imageIndex) => (
                              <div key={imageIndex} className="relative group">
                                <div className="relative w-full aspect-square">
                                  <Image
                                    src={image.url}
                                    alt={`${variant.name} image ${imageIndex + 1}`}
                                    fill
                                    className="rounded-md object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                                  onClick={() => removeVariantImage(variant.id, imageIndex)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {variant.images && variant.images.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {variant.images.length} image(s) for this variant
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label>Image Upload Type</Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={imageType === "url" ? "default" : "outline"}
              onClick={() => setImageType("url")}
            >
              URL
            </Button>
            <Button
              type="button"
              variant={imageType === "file" ? "default" : "outline"}
              onClick={() => setImageType("file")}
            >
              File Upload
            </Button>
          </div>
        </div>

        {imageType === "url" ? (
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button type="button" onClick={handleImageAdd}>
              Add Image
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        )}

        <div className="grid gap-4 grid-cols-3">
          {formData.images?.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full aspect-square">
                <Image
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleImageRemove(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {formData.images && formData.images.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {formData.images.length}/3 images added
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-wrap gap-2">
          {formData.tags?.map((tag) => (
            <span key={tag} className="inline-flex items-center px-2 py-1 bg-muted rounded text-sm">
              {tag}
              <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleTagRemove(tag)}>&times;</button>
            </span>
          ))}
          <input
            id="tags"
            type="text"
            className="border rounded px-2 py-1 text-sm min-w-[100px]"
            placeholder="Add tag and press Enter"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
          />
        </div>
        <p className="text-xs text-muted-foreground">e.g. cctv, motion detection, night vision, security camera</p>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {initialData ? "Updating..." : "Creating..."}
            </>
          ) : (
            initialData ? "Update Product" : "Create Product"
          )}
        </Button>
      </div>
    </form>
  )
} 