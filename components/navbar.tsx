"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu,
  X,
  ChevronDown
} from "lucide-react"
import { useCart } from "@/components/cart-context"
import { CartModal } from "@/components/cart-modal"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { items: cartItems } = useCart()
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCartOpen, setCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleStorageChange = () => {
      const savedWishlist = localStorage.getItem('branakids-wishlist')
      setWishlistCount(savedWishlist ? JSON.parse(savedWishlist).length : 0)
    }
    window.addEventListener('storage', handleStorageChange)
    handleStorageChange() // Initial load
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    setSearchTerm(query)
    if (query.length > 1) {
      try {
        const res = await fetch(`/api/products?search=${query}&limit=5`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data.products || [])
        } else {
          setSearchResults([])
        }
      } catch (error) {
        setSearchResults([])
      }
    } else {
      setSearchResults([])
    }
  }, [])

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <header className={`bg-background/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md border-b' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4">
          {/* Top bar with contact and auth */}
          <div className="flex justify-between items-center h-10 text-xs text-muted-foreground border-b">
            <div className="flex items-center gap-4">
              <span>Let your kid smile!</span>
              <span className="hidden md:block">|</span>
              <Link href="/contact" className="hidden md:flex items-center gap-1 hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-1 hover:text-primary transition-colors">
                <User className="h-3.5 w-3.5" />
                <span>Account</span>
              </Link>
            </div>
          </div>

          {/* Main Navbar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="bg-primary rounded-full p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground h-6 w-6"><path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10A10 10 0 0 0 12 2Z"/><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M12 12a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/></svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-primary">BRANA</span>
                <span className="text-xs font-medium text-muted-foreground leading-tight">KIDS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex justify-center flex-1">
              <MainNav onSearch={handleSearch} searchValue={searchTerm} searchResults={searchResults} onResultClick={clearSearch} />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:hidden"> {/* Search icon for tablet */}
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                title="Wishlist"
                asChild
              >
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{wishlistCount}</Badge>
                  )}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                title="Shopping Cart"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{cartItemCount}</Badge>
                )}
              </Button>
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="lg:hidden container mx-auto px-4 pb-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pr-10 rounded-lg border-2"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              {searchTerm ? (
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={clearSearch}>
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" disabled>
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>
            {searchTerm && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {/* Search results rendering */}
              </div>
            )}
          </div>
        </div>
      </header>

      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu}
        onSearch={handleSearch}
        searchValue={searchTerm}
        searchResults={searchResults}
        onResultClick={clearSearch}
      />
      <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}