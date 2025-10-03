"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ShoppingCart, Search, Star, Sparkles } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/cart-context"
import { Layout } from "@/components/layout"
import { SimpleProductFilters } from "@/components/simple-product-filters"

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
  isDeal: boolean
  dealPrice?: number
  previousPrice?: number
  tags?: string[]
}

function ProductsContent({ products, loading, error }: { products: Product[]; loading: boolean; error: string | null }) {
  const { toast } = useToast()
  const { addToCart, items: cartItems } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [wishlist, setWishlist] = useState<string[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const searchValue = searchParams.get("search") || ""
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue)

  // Update filtered products when products change
  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchValue), 300)
    return () => clearTimeout(handler)
  }, [searchValue])

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

  // Apply search filter to already filtered products
  const searchFilteredProducts = debouncedSearch
    ? filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          (product.tags && product.tags.some((tag: string) => tag.toLowerCase().includes(debouncedSearch.toLowerCase())))
      )
    : filteredProducts

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter">All Products</h2>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="animate-pulse">
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
              <h2 className="text-3xl font-bold tracking-tighter">All Products</h2>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-amber-50 via-pink-50 to-blue-50 min-h-screen">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="flex-1 min-w-0 order-1 md:order-1">
            <h2 className="text-4xl font-bold tracking-tighter brana-text-gradient">
              {searchParams.get("featured") === "1" ? "Featured Products" : "All Products"}
            </h2>
            <p className="text-muted-foreground text-lg mt-2">
              {searchParams.get("featured") === "1" ? "Browse all promoted products" : "Browse our complete product collection"}
            </p>
          </div>
          <form
            onSubmit={e => e.preventDefault()}
            className="w-full max-w-md flex items-center relative order-2 md:order-2 md:justify-end"
          >
            <Input
              type="text"
              value={searchValue}
              onChange={e => {
                const newSearch = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (newSearch) {
                  params.set("search", newSearch);
                } else {
                  params.delete("search");
                }
                router.push(`${pathname}?${params.toString()}`);
              }}
              placeholder="Search for toys, clothes, books..."
              className="pl-10 pr-4 py-3 rounded-full border-2 border-brana-green/20 bg-white text-base shadow-lg focus:border-brana-green focus:ring-2 focus:ring-brana-green/30 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brana-green w-5 h-5" />
          </form>
        </div>

        {/* Main Content with Filters */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <SimpleProductFilters
              products={products}
              onFiltersChange={setFilteredProducts}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchFilteredProducts.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-lg p-8">
                  <Sparkles className="h-16 w-16 text-brana-pink mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
                  <p className="text-muted-foreground text-center">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                </div>
              ) : (
                searchFilteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="group overflow-hidden rounded-2xl border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <Link href={`/product/${product._id}`} className="relative block overflow-hidden pt-[100%]">
                      {/* Featured Badge */}
                      {product.isDeal && (
                        <div className="absolute top-3 left-3 z-20">
                          <span className="bg-brana-blue text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            FEATURED
                          </span>
                        </div>
                      )}
                      
                      {/* Sale Badge */}
                      {product.isDeal && product.previousPrice && (
                        <div className="absolute top-3 right-12 z-20">
                          <span className="bg-brana-yellow text-white px-2 py-1 rounded-full text-xs font-bold">
                            SALE
                          </span>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "absolute right-3 top-3 z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white",
                          wishlist.includes(product._id) ? "text-brana-pink" : "text-gray-600",
                        )}
                        onClick={(e) => {
                          e.preventDefault()
                          toggleWishlist(product._id)
                        }}
                      >
                        <Heart className="h-4 w-4" fill={wishlist.includes(product._id) ? "currentColor" : "none"} />
                        <span className="sr-only">Add to wishlist</span>
                      </Button>

                      <Image
                        src={product.images?.[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        quality={85}
                        loading="lazy"
                      />
                    </Link>
                    
                    <CardContent className="p-4">
                      {/* Category */}
                      <div className="text-sm text-brana-purple font-medium mb-2">
                        {product.category}
                      </div>
                      
                      {/* Product Name */}
                      <Link href={`/product/${product._id}`} className="mt-1 block">
                        <h3 className="line-clamp-2 text-lg font-bold text-gray-800 hover:text-brana-green transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Age Group (simulated) */}
                      <div className="text-xs text-gray-500 mb-3">
                        {Math.random() > 0.5 ? 'Preschool' : Math.random() > 0.5 ? 'Toddlers' : 'School Age'}
                      </div>

                      {/* Rating (simulated) */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(Math.random() * 3) + 3 ? 'text-brana-yellow fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Price */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex flex-col items-start">
                          {product.isDeal ? (
                            <>
                              <span className="text-2xl font-extrabold text-brana-green leading-tight">
                                {formatCurrency(product.dealPrice || product.price)}
                              </span>
                              {product.previousPrice && (
                                <span className="text-sm text-gray-500 line-through flex items-center gap-1">
                                  was {formatCurrency(product.previousPrice)}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xl font-bold text-brana-green">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.stock < 5 ? (
                            <span className="text-brana-pink font-medium">Only {product.stock} left</span>
                          ) : (
                            <span className="text-brana-green font-medium">In stock</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 space-y-2">
                      <Button
                        className={cn(
                          "w-full gap-2 rounded-full font-semibold transition-all duration-200",
                          cartItems.some((item) => item.id === product._id)
                            ? "bg-brana-green hover:bg-brana-green/90 text-white"
                            : "bg-brana-pink hover:bg-brana-pink/90 text-white hover:scale-105"
                        )}
                        onClick={() => {
                          if (!cartItems.some((item) => item.id === product._id)) {
                            addToCart({
                              id: product._id,
                              name: product.name,
                              price: product.isDeal ? (product.dealPrice || product.price) : product.price,
                              image: product.images?.[0]?.url || "/placeholder.svg"
                            })
                            toast({
                              title: "Added to cart",
                              description: `${product.name} has been added to your cart`,
                            })
                          }
                        }}
                        disabled={product.status === "out-of-stock" || cartItems.some((item) => item.id === product._id)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {cartItems.some((item) => item.id === product._id) ? "In Cart" : "Add to Cart"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-brana-blue text-brana-blue hover:bg-brana-blue hover:text-white transition-all duration-200"
                      >
                        Buy Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/products")
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        // Handle both array and object responses
        const productsArray = Array.isArray(data) ? data : (data.products || [])
        setProducts(productsArray)
      } catch (err: any) {
        setError(err.message || "Failed to load products")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(handler)
  }, [search])

  // Filter products by search (name, description, tags)
  const filteredProducts = debouncedSearch
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          (product.tags && product.tags.some((tag: string) => tag.toLowerCase().includes(debouncedSearch.toLowerCase())))
      )
    : products

  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Layout searchHandler={setSearch} searchValue={search} searchResults={products}>
        <ProductsContent products={products} loading={loading} error={error} />
      </Layout>
    </Suspense>
  )
} 