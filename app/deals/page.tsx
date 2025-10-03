"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart as LucideShoppingCart, Percent, Package, HelpCircle, Search } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { cn, formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "@/components/shopping-cart"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"

export default function DealsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart, items: cartItems } = useCart()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    if (search.length > 0) {
      setLoadingProducts(true)
      fetch("/api/products")
        .then(res => res.json())
        .then(data => setAllProducts(Array.isArray(data) ? data : data.products || []))
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

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true)
      const res = await fetch("/api/products")
      const data = await res.json()
      const products = Array.isArray(data) ? data : data.products || []
      setProducts(products.filter((p: any) => p.isDeal))
      setLoading(false)
    }
    fetchDeals()
  }, [])

  // Filter products by search
  const filteredProducts = debouncedSearch
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : products

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center relative">
          <div className="flex items-center gap-2 mr-4">
            <Link href="/" className="hidden md:flex items-center space-x-2 transition-transform hover:scale-105">
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
          </div>
          <MainNav
            onSearch={setSearch}
            searchValue={search}
            searchResults={searchResults}
            onResultClick={() => setSearch("")}
          />
          <MobileNav />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <ThemeToggle />
              <ShoppingCart />
            </nav>
          </div>
        </div>
      </header>
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">Deals</h2>
          {loading ? (
            <p>Loading deals...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-muted-foreground">No deals available right now.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map(product => (
                <Card key={product._id} className="group overflow-hidden rounded-lg border-0 bg-card/50 transition-all hover:shadow-lg dark:bg-card/30 dark:hover:bg-card/40">
                  <Link href={`/product/${product._id}`} className="relative block overflow-hidden pt-[100%]">
                    <Image
                      src={product.images?.[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">{product.category}</div>
                    <Link href={`/product/${product._id}`} className="mt-1 block">
                      <h3 className="line-clamp-1 text-lg font-medium">{product.name}</h3>
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(product.dealPrice || product.price)}
                      </div>
                      <span className="ml-2 text-sm line-through text-muted-foreground">{formatCurrency(product.previousPrice)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.stock < 5 ? (
                          <span className="text-red-500">Only {product.stock} left</span>
                        ) : (
                          <span>In stock</span>
                        )}
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
                                price: product.dealPrice || product.price,
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
                      )
                    })()}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
} 