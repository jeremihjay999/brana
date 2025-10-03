"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Heart,
  Star,
  Shield,
  Truck,
  Clock,
  MessageCircle
} from "lucide-react"
import { getWhatsAppUrl, getWhatsAppPhone } from "@/lib/whatsapp"

export function Footer() {
  const [categories, setCategories] = useState<any[]>([])
  const [whatsappPhone, setWhatsappPhone] = useState("+254758212888")

  useEffect(() => {
    // Get phone number from utility function
    setWhatsappPhone(getWhatsAppPhone())
    
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories")
        if (!res.ok) throw new Error("Failed to fetch categories")
        const data = await res.json()
        // Sort by createdAt descending and take the latest 6
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6)
          : []
        setCategories(sorted)
      } catch {
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  const handleWhatsAppContact = () => {
    const message = "Hello! I have a question about your products. Can you help me? 🌟"
    const whatsappUrl = getWhatsAppUrl(message)
    window.open(whatsappUrl, '_blank')
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold text-brana-green">BRANA</div>
              <div className="text-2xl font-bold text-brana-pink">KIDS</div>
              <div className="text-brana-yellow text-lg">⭐</div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Let Your Kid Smile! We provide quality children's products that bring joy and happiness to your little ones. From toys to clothing, we have everything your child needs.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-brana-green" />
                <Link 
                  href={getWhatsAppUrl("Hello! I'm interested in your products. Can you help me?")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-brana-green transition-colors text-sm"
                >
                  {whatsappPhone}
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-brana-green" />
                <span className="text-gray-300 text-sm">info@branakids.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-brana-green" />
                <span className="text-gray-300 text-sm">Nairobi, Kenya</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-brana-pink transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-brana-pink transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-brana-pink transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-brana-pink transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-brana-green transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-brana-green transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-300 hover:text-brana-green transition-colors text-sm">
                  Special Deals
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-brana-green transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-brana-green transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Categories</h3>
            <ul className="space-y-3">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id}>
                    <Link 
                      href={`/category/${cat.slug}`} 
                      className="text-gray-300 hover:text-brana-green transition-colors text-sm"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><span className="text-gray-300 text-sm">Toys & Games</span></li>
                  <li><span className="text-gray-300 text-sm">Clothing</span></li>
                  <li><span className="text-gray-300 text-sm">Books</span></li>
                  <li><span className="text-gray-300 text-sm">Accessories</span></li>
                  <li><span className="text-gray-300 text-sm">Educational</span></li>
                </>
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-brana-green transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-brana-green transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-brana-green transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-brana-green transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-brana-green transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>

            {/* WhatsApp Contact Button */}
            <button
              onClick={handleWhatsAppContact}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Chat with Us</span>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-brana-green/20 p-2 rounded-lg">
                <Truck className="h-5 w-5 text-brana-green" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Free Delivery</h4>
                <p className="text-gray-400 text-xs">On orders over KSh 2,000</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-brana-pink/20 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-brana-pink" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Secure Payment</h4>
                <p className="text-gray-400 text-xs">100% safe transactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-brana-blue/20 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-brana-blue" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">24/7 Support</h4>
                <p className="text-gray-400 text-xs">We're here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {new Date().getFullYear()} BRANA KIDS. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span className="hidden md:inline">in Kenya</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-brana-green transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-brana-green transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-brana-green transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}