"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Heart, Search, Star, ShoppingCart, Filter, AlertCircle, RefreshCw } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { useCart } from "@/components/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"

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
  isDeal?: boolean
  dealPrice?: number
  previousPrice?: number
  tags?: string[]
}

interface Category {
  _id: string
  name: string
  description: string
  icon: string
  slug: string
  featured: boolean
  status: string
  productCount: number
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T> {
  products?: T[]
  categories?: T[]
  error?: string
  message?: string
}

export default function LandingPage() {
  const { addToCart, items: cartItems } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [retryCount, setRetryCount] = useState(0)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('branakids-wishlist')
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error)
      }
    }
  }, [])

  // Fetch data with retry logic
  const fetchData = useCallback(async (retry = 0) => {
    try {
      setLoading(true)
      setError(null)
      
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          }
        }),
        fetch("/api/categories", {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          }
        })
      ])
      
      if (!productsRes.ok) {
        throw new Error(`Products API error: ${productsRes.status} ${productsRes.statusText}`)
      }
      
      if (!categoriesRes.ok) {
        throw new Error(`Categories API error: ${categoriesRes.status} ${categoriesRes.statusText}`)
      }
      
      const productsData: ApiResponse<Product> = await productsRes.json()
      const categoriesData: Category[] = await categoriesRes.json()
      
      // Handle different response formats
      const productsArray = Array.isArray(productsData) 
        ? productsData 
        : (productsData.products || [])
      
      if (!Array.isArray(productsArray)) {
        throw new Error("Invalid products data format")
      }
      
      if (!Array.isArray(categoriesData)) {
        throw new Error("Invalid categories data format")
      }
      
      setProducts(productsArray)
      setCategories(categoriesData)
      setRetryCount(0) // Reset retry count on success
      
    } catch (error) {
      console.error("Error fetching data:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load data"
      setError(errorMessage)
      
      // Retry logic (max 3 retries)
      if (retry < 3) {
        setRetryCount(retry + 1)
        setTimeout(() => {
          fetchData(retry + 1)
        }, 2000 * (retry + 1)) // Exponential backoff
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter products with memoization
  const filteredProducts = useCallback(() => {
    return products.filter(product => {
      const matchesSearch = !search || 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        (product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes(search.toLowerCase())
        ))
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category)
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [products, search, selectedCategories, priceRange])

  // Event handlers
  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => {
      if (prev.includes(id)) {
        const newWishlist = prev.filter(item => item !== id)
        localStorage.setItem('branakids-wishlist', JSON.stringify(newWishlist))
        toast({
          title: "Removed from wishlist",
          description: "Product has been removed from your wishlist",
        })
        return newWishlist
      } else {
        const newWishlist = [...prev, id]
        localStorage.setItem('branakids-wishlist', JSON.stringify(newWishlist))
        toast({
          title: "Added to wishlist", 
          description: "Product has been added to your wishlist",
        })
        return newWishlist
      }
    })
  }, [toast])

  const handleAddToCart = useCallback((product: Product) => {
    const displayPrice = product.isDeal && product.dealPrice ? product.dealPrice : product.price
    
    addToCart({
      id: product._id,
      name: product.name,
      price: displayPrice,
      image: product.images[0]?.url || "/placeholder.jpg",
      quantity: 1
    })
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }, [addToCart, toast])

  const handleCategoryChange = useCallback((category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, category]
        : prev.filter(c => c !== category)
    )
  }, [])

  const handleRetry = useCallback(() => {
    setRetryCount(0)
    fetchData()
  }, [fetchData])

  const handleProductClick = useCallback((productId: string) => {
    router.push(`/product/${productId}`)
  }, [router])


  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brana-green border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading BRANA KIDS</h2>
          <p className="text-gray-600">
            {retryCount > 0 ? `Retrying... (${retryCount}/3)` : "Fetching products..."}
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={handleRetry}
            className="bg-brana-green hover:bg-brana-green/90 text-white px-6 py-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const currentProducts = filteredProducts()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />


      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-72 bg-gray-50 rounded-xl p-6 h-fit sticky top-24 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Filter className="h-5 w-5 text-brana-green" />
              <h3 className="font-bold text-xl text-gray-800">Filters</h3>
            </div>
            
            <div className="mb-8">
              <h4 className="font-semibold text-lg mb-4 text-gray-700">Category</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {categories.slice(0, 8).map((category) => (
                  <div key={category._id} className="flex items-center space-x-3">
                    <Checkbox
                      id={category.name}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.name, checked as boolean)
                      }
                      className="border-2 border-gray-300 data-[state=checked]:bg-brana-green data-[state=checked]:border-brana-green"
                    />
                    <label 
                      htmlFor={category.name}
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-brana-green transition-colors"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 text-gray-700">Price Range (KSh)</h4>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>KSh {priceRange[0].toLocaleString()}</span>
                  <span>KSh {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentProducts.length} Products Found
              </h2>
              {loading && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentProducts.map((product) => {
                const inCart = cartItems.some(item => item.id === product._id)
                const isWishlisted = wishlist.includes(product._id)
                const displayPrice = product.isDeal && product.dealPrice ? product.dealPrice : product.price
                const originalPrice = product.isDeal && product.previousPrice ? product.previousPrice : null

                return (
                  <Card 
                    key={product._id} 
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white rounded-xl hover:-translate-y-1 product-card compact-card cursor-pointer"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <div className="relative h-full flex flex-col">
                      {/* Product Image Container */}
                      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl">
                        {product.images[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-brana-green/10 to-brana-pink/10 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-3xl mb-1">🧸</div>
                              <span className="text-gray-400 text-xs font-medium">No Image</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2">
                          {product.isDeal ? (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                              SALE
                            </span>
                          ) : (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                              FEATURED
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-md border-0 rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWishlist(product._id)
                          }}
                        >
                          <Heart 
                            className={cn(
                              "h-4 w-4 transition-colors",
                              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                            )} 
                          />
                        </Button>

                        {/* Cart Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-12 right-2 bg-white/90 hover:bg-white shadow-md border-0 rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddToCart(product)
                          }}
                          disabled={inCart || product.stock === 0}
                        >
                          <ShoppingCart 
                            className={cn(
                              "h-4 w-4 transition-colors",
                              inCart ? "text-brana-green" : "text-gray-400 hover:text-brana-green"
                            )} 
                          />
                        </Button>
                      </div>

                      <CardContent className="p-4 flex-1 flex flex-col">
                        {/* Product Name */}
                        <h3 className="font-bold text-sm mb-2 line-clamp-1 text-gray-800 group-hover:text-brana-green transition-colors duration-300">
                          {product.name}
                        </h3>
                        
                        {/* Age Group */}
                        <div className="text-xs text-gray-500 mb-2 font-medium">
                          {product.category === "Toys" ? "Preschool" : 
                           product.category === "Books" ? "School Age" : 
                           product.category === "Clothing" ? "Toddlers" : "All Ages"}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            ({Math.floor(Math.random() * 5) + 1})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="space-y-1 mb-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg text-gray-800">
                              KSh {displayPrice.toLocaleString()}
                            </span>
                            <Button
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                              disabled={product.stock === 0}
                              onClick={(e) => {
                                e.stopPropagation()
                                // Handle buy now action
                              }}
                            >
                              Buy Now
                            </Button>
                          </div>
                          {originalPrice && (
                            <span className="text-sm text-red-500 line-through font-medium">
                              KSh {originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center space-x-1 mb-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            product.stock > 10 ? "bg-green-500" : 
                            product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                          )} />
                          <span className="text-xs text-gray-500 font-medium">
                            {product.stock > 10 ? "In Stock" : 
                             product.stock > 0 ? "Low Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0 mt-auto">
                        <div className="w-full text-center">
                          <span className="text-xs text-gray-500">
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </CardFooter>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* No results */}
            {currentProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  onClick={() => {
                    setSearch("")
                    setSelectedCategories([])
                    setPriceRange([0, 10000])
                  }}
                  className="bg-brana-green hover:bg-brana-green/90 text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Temporary Visual Indicator - Remove after testing */}
      <div className="fixed top-4 left-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-sm font-bold">✅ Changes Applied:</div>
        <div className="text-xs">• Product cards fixed</div>
        <div className="text-xs">• Count badges working</div>
        <div className="text-xs">• No opacity changes</div>
      </div>

      {/* Test Buttons - Remove after testing */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <Button 
          onClick={() => {
            const testItem = {
              id: 'test-cart-' + Date.now(),
              name: 'Test Cart Item',
              price: 1000,
              image: '/placeholder.jpg',
              quantity: 1
            }
            addToCart(testItem)
            console.log('Added to cart:', testItem)
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1"
        >
          Test Cart (+1)
        </Button>
        <Button 
          onClick={() => {
            const testId = 'test-wishlist-' + Date.now()
            const newWishlist = [...wishlist, testId]
            setWishlist(newWishlist)
            localStorage.setItem('branakids-wishlist', JSON.stringify(newWishlist))
            console.log('Added to wishlist:', testId, 'New wishlist:', newWishlist)
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1"
        >
          Test Wishlist (+1)
        </Button>
      </div>
    </div>
  )
}