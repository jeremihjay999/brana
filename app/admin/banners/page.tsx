"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Banner {
  _id?: string
  title: string
  subtitle: string
  description: string
  image: string
  categorySlug: string
  createdAt?: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [form, setForm] = useState<Banner>({ title: "", subtitle: "", description: "", image: "", categorySlug: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const fileInputRef = useRef(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    fetchBanners()
    fetchCategories()
  }, [])

  const fetchBanners = async () => {
    const res = await fetch("/api/banners")
    const data = await res.json()
    setBanners(data)
  }

  const fetchCategories = async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data.map((cat: any) => ({ name: cat.name, slug: cat.slug })))
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Create a local preview first
    const localUrl = URL.createObjectURL(file)
    setImagePreview(localUrl)
    
    // Check dimensions first
    const img = new window.Image()
    img.src = localUrl
    img.onload = async () => {
      if (img.width !== 1200 || img.height !== 400) {
        alert("Image must be exactly 1200x400 pixels.")
        if (fileInputRef.current) fileInputRef.current.value = ""
        setImagePreview("")
        return
      }
      
      try {
        // Show loading state
        setLoading(true)
        
        // Create FormData with type for Cloudinary preset
        const formData = new FormData()
        formData.append("image", file)
        formData.append("type", "banner") // Specify banner type for Cloudinary preset
        
        // Upload to Cloudinary
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          console.error("Upload error:", errorData)
          throw new Error(errorData.error || "Failed to upload banner image")
        }
        
        const data = await res.json()
        
        if (!data.url) {
          throw new Error("No URL returned from upload")
        }
        
        // Update form with the Cloudinary URL
        setForm((prev) => ({ ...prev, image: data.url }))
        setImagePreview(data.url)
      } catch (error) {
        console.error("Error uploading banner image:", error)
        alert(error instanceof Error ? error.message : "Failed to upload image")
        // Reset on error
        if (fileInputRef.current) fileInputRef.current.value = ""
        setImagePreview("")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    if (editingId) {
      await fetch(`/api/banners?id=${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } else {
      await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }
    setForm({ title: "", subtitle: "", description: "", image: "", categorySlug: "" })
    setEditingId(null)
    setLoading(false)
    fetchBanners()
  }

  const handleEdit = (banner: Banner) => {
    setForm(banner)
    setEditingId(banner._id || null)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this banner?")) return
    await fetch(`/api/banners?id=${id}`, { method: "DELETE" })
    fetchBanners()
  }

  return (
    <div className="container py-4 md:py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10 text-center">Homepage Banners</h1>
      <div className="flex flex-col gap-8 md:flex-row md:gap-8">
        {/* Form Section */}
        <div className="w-full md:w-1/3">
          <Card className="shadow-lg border border-border bg-background/80">
            <CardHeader className="border-b border-border pb-4 mb-4">
              <CardTitle className="text-2xl">{editingId ? "Edit Banner" : "Add Banner"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <Input name="subtitle" placeholder="Subtitle" value={form.subtitle} onChange={handleChange} required />
                <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                <div>
                  <label className="block text-sm font-medium mb-1">Banner Image (1200x400px)</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Banner preview" style={{ width: '100%', maxWidth: 360, height: 120, objectFit: "cover", marginTop: 8, borderRadius: 8, border: '1px solid #eee' }} />
                  )}
                </div>
                <select
                  name="categorySlug"
                  value={form.categorySlug}
                  onChange={handleChange}
                  required
                  className="w-full rounded border px-3 py-2 bg-background text-foreground"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-muted-foreground">Buttons Preview:</div>
                  <div className="flex gap-2 flex-wrap">
                    <Button type="button" variant="outline" disabled className="flex-1 min-w-[120px]">
                      Shop {categories.find(c => c.slug === form.categorySlug)?.name || "[Category]"}
                    </Button>
                    <Button type="button" variant="outline" disabled className="flex-1 min-w-[120px]">
                      All Products
                    </Button>
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full py-3 text-base">{editingId ? "Update" : "Add"} Banner</Button>
                {editingId && <Button type="button" variant="outline" className="w-full py-3 text-base" onClick={() => { setForm({ title: "", subtitle: "", description: "", image: "", categorySlug: "" }); setEditingId(null); setImagePreview(""); }}>Cancel</Button>}
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Banner List Section */}
        <div className="w-full md:w-2/3">
          <div className="mb-4 md:mb-6 border-b border-border pb-2 flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold">All Banners</h2>
          </div>
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading banners...</div>
          ) : banners.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No banners yet. Add one using the form.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {banners.map(banner => (
                <Card key={banner._id} className="shadow-md border border-border bg-background/90 hover:shadow-xl transition-shadow flex flex-col h-full">
                  <div className="relative w-full h-40 rounded-t overflow-hidden">
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full shadow">{banner.categorySlug}</span>
                  </div>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-base md:text-lg mb-1 truncate" title={banner.title}>{banner.title}</CardTitle>
                    <div className="font-semibold text-primary mb-1 truncate" title={banner.subtitle}>{banner.subtitle}</div>
                  </CardHeader>
                  <CardContent className="flex-1 px-4 pb-4">
                    <div className="text-muted-foreground mb-2 line-clamp-3 text-sm md:text-base">{banner.description}</div>
                    <div className="flex gap-2 mt-4 flex-col sm:flex-row">
                      <Button size="sm" onClick={() => handleEdit(banner)} className="flex-1 py-3 text-base">Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(banner._id!)} className="flex-1 py-3 text-base">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 