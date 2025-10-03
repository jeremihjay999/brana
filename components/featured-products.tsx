"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-context"

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

export function FeaturedProducts() {
  const { toast } = useToast()
  const { addToCart, items: cartItems } = useCart()
  const [wishlist, setWishlist] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const productsPerSlide = 4
  const maxProducts = 12 // Maximum number of latest products to display

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/products")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch products")
        }
        const data = await response.json()
        // Handle both array and object responses for products
        const productsArray = Array.isArray(data) ? data : (data.products || [])
        // Sort all products by createdAt descending (newest first) and limit to maxProducts
        const sortedProducts = productsArray
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, maxProducts) // Limit to maximum 12 products
        setProducts(sortedProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError(error instanceof Error ? error.message : "Failed to load products")
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [toast])

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

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev + 1
      const maxSlides = Math.ceil(products.length / productsPerSlide) - 1
      return next > maxSlides ? 0 : next
    })
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev - 1
      return next < 0 ? Math.ceil(products.length / productsPerSlide) - 1 : next
    })
  }

  useEffect(() => {
    if (products.length <= productsPerSlide) return
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [products.length])

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter">Latest Products</h2>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="mt-2 h-6 w-3/4 bg-muted rounded" />
                  <div className="mt-2 h-4 w-1/2 bg-muted rounded" />
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
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter">Latest Products</h2>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const visibleProducts = products.slice(
    currentSlide * productsPerSlide,
    (currentSlide + 1) * productsPerSlide
  )

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter">Latest Products</h2>
            <p className="text-muted-foreground">Discover our newest additions to the collection</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
        <div className="relative mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
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
                  {(() => {
                    const inCart = cartItems.some(item => item.id === product._id)
                    return (
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
                        disabled={inCart}
                      >
                        {inCart ? (
                          <>
                            <span className="text-white">In Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    )
                  })()}
                </CardFooter>
              </Card>
            ))}
          </div>
          {products.length > productsPerSlide && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 z-30 -translate-y-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous products</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 z-30 -translate-y-1/2 translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next products</span>
              </Button>
              <div className="absolute bottom-0 left-1/2 z-30 flex -translate-x-1/2 translate-y-1/2 gap-2">
                {Array.from({ length: Math.ceil(products.length / productsPerSlide) }).map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      index === currentSlide ? "w-6 bg-primary" : "bg-primary/30",
                    )}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <span className="sr-only">Go to slide {index + 1}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
