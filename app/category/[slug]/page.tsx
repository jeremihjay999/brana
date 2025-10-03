"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ShoppingCart as LucideShoppingCart } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { ShoppingCart } from "@/components/shopping-cart"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCart } from "@/components/cart-context"
import { Input } from "@/components/ui/input"

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
}

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string }
  const { toast } = useToast()
  const [category, setCategory] = useState<{ name: string; description: string } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const { addToCart, items: cartItems } = useCart()

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch all categories and find the one with the matching slug
        const catRes = await fetch("/api/categories")
        if (!catRes.ok) throw new Error("Failed to fetch categories")
        const categories = await catRes.json()
        const foundCategory = categories.find((cat: any) => cat.slug === slug)
        if (!foundCategory) throw new Error("Category not found")
        setCategory({ name: foundCategory.name, description: foundCategory.description })
        // Fetch all products
        const prodRes = await fetch("/api/products")
        if (!prodRes.ok) throw new Error("Failed to fetch products")
        const allProducts = await prodRes.json()
        // Filter products by category name
        const filtered = allProducts.filter((product: Product) => product.category?.toLowerCase() === foundCategory.name.toLowerCase())
        setProducts(filtered)
      } catch (err: any) {
        setError(err.message || "Failed to load category or products")
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchCategoryAndProducts()
  }, [slug])

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    if (search.length > 0) {
      setLoadingProducts(true)
      fetch("/api/products")
        .then(res => res.json())
        .then(data => setAllProducts(Array.isArray(data) ? data : []))
        .finally(() => setLoadingProducts(false))
    } else {
      setAllProducts([])
    }
  }, [search])

  const searchResults = debouncedSearch
    ? allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : []

  const toggleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id))
      toast({
        title: "Removed from wishlist",
        description: "Product has been removed from your wishlist",
      })
    } else {
      setWishlist([...wishlist, id])
      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist",
      })
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <MobileNav onSearch={setSearch} />
            <Link href="/" className="hidden md:flex items-center transition-transform hover:scale-105">
              <div className="bg-white/90 dark:bg-amber-50 border border-border shadow-lg rounded-2xl p-1 flex items-center justify-center">
                <Image
                  src="https://res.cloudinary.com/duo5azl81/image/upload/v1749407303/logo2_zxxky4.png"
                  alt="Safir Dynamics"
                  width={200}
                  height={70}
                  className="h-10 w-10 object-contain"
                  priority
                />
              </div>
            </Link>
            <MainNav onSearch={setSearch} searchValue={search} searchResults={searchResults} onResultClick={() => setSearch("")} />
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <div className="h-5 w-px bg-border mx-0.5 hidden md:block" />
            <ShoppingCart />
          </div>
        </div>
      </header>
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <h2 className="text-3xl font-bold tracking-tighter">Loading...</h2>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <h2 className="text-3xl font-bold tracking-tighter text-red-500">{error}</h2>
            </div>
          ) : category ? (
            <>
              <div className="mb-8 flex flex-col items-center text-center">
                <h2 className="text-3xl font-bold tracking-tighter">{category.name}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <p className="text-muted-foreground">No products found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((product) => {
                    const inCart = cartItems.some(item => item.id === product._id)
                    return (
                      <Card
                        key={product._id}
                        className="group overflow-hidden rounded-lg border-0 bg-card/50 transition-all hover:shadow-lg dark:bg-card/30 dark:hover:bg-card/40"
                      >
                        <Link href={`/product/${product._id}`} className="relative block overflow-hidden pt-[100%]">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "absolute right-4 top-4 z-10 bg-background/80 backdrop-blur-sm",
                              wishlist.includes(product._id) ? "text-red-500" : "text-muted-foreground",
                            )}
                            onClick={(e) => {
                              e.preventDefault()
                              toggleWishlist(product._id)
                            }}
                          >
                            <Heart className="h-5 w-5" fill={wishlist.includes(product._id) ? "currentColor" : "none"} />
                            <span className="sr-only">Add to wishlist</span>
                          </Button>
                          <Image
                            src={product.images?.[0]?.url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            quality={85}
                            loading="lazy"
                          />
                        </Link>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">{product.category}</div>
                          <Link href={`/product/${product._id}`} className="mt-1 block">
                            <h3 className="line-clamp-1 text-lg font-medium">{product.name}</h3>
                          </Link>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-lg font-bold">{formatCurrency(product.price)}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.stock < 5 ? (
                                <span className="text-red-500">Only {product.stock} left</span>
                              ) : (
                                <span>In stock</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            className={cn("w-full gap-2 font-bold", inCart ? "bg-blue-600 text-white hover:bg-blue-700" : "")}
                            onClick={() => {
                              if (!inCart) {
                                addToCart({
                                  id: product._id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.images?.[0]?.url || "/placeholder.svg"
                                })
                                toast({
                                  title: "Added to cart",
                                  description: `${product.name} has been added to your cart`,
                                })
                              }
                            }}
                            disabled={inCart || product.status === "out-of-stock"}
                          >
                            {inCart ? (
                              <span className="text-white">In Cart</span>
                            ) : (
                              <>
                                <LucideShoppingCart className="h-4 w-4" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              )}
            </>
          ) : null}
        </div>
      </section>
      <Footer />
    </>
  )
} 