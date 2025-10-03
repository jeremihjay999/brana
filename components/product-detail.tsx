"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  ArrowLeft,
  Plus,
  Minus,
  Share2,
  MessageCircle
} from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { useCart } from "@/components/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { getWhatsAppUrl } from "@/lib/whatsapp"
import { useRouter } from "next/navigation"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: Array<{ url: string; alt?: string }>
  isDeal?: boolean
  dealPrice?: number
  previousPrice?: number
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface ProductDetailProps {
  product: Product
  onClose: () => void
}

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { addToCart, items: cartItems } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  const inCart = cartItems.some(item => item.id === product._id)
  const displayPrice = product.isDeal && product.dealPrice ? product.dealPrice : product.price
  const originalPrice = product.isDeal && product.previousPrice ? product.previousPrice : null

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: displayPrice,
      image: product.images[0]?.url || '/placeholder.jpg',
      quantity: quantity
    })
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleBuyNow = () => {
    // Add to cart first
    addToCart({
      id: product._id,
      name: product.name,
      price: displayPrice,
      image: product.images[0]?.url || '/placeholder.jpg',
      quantity: quantity
    })
    
    // Navigate to checkout
    router.push('/checkout')
  }

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'm interested in this product:

*${product.name}*
Price: KSh ${displayPrice.toLocaleString()}
Quantity: ${quantity}

Can you help me with more details? 🌟`
    
    const whatsappUrl = getWhatsAppUrl(message)
    window.open(whatsappUrl, '_blank')
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product.name} ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleWishlist}
              className={cn(
                "rounded-full",
                isWishlisted ? "text-red-500" : "text-gray-400"
              )}
            >
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
              {product.images[selectedImage]?.url ? (
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🧸</div>
                    <span className="text-gray-400 text-lg">No Image Available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "aspect-square relative overflow-hidden rounded-lg border-2 transition-all",
                      selectedImage === index 
                        ? "border-brana-green" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            {/* Product Title & Badge */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                {product.isDeal && (
                  <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold">
                    SALE
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">(4.9) • 200+ reviews</span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-gray-900">
                    KSh {displayPrice.toLocaleString()}
                  </span>
                  {originalPrice && (
                    <span className="text-2xl text-red-500 line-through">
                      KSh {originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.isDeal && (
                  <div className="text-green-600 font-semibold">
                    Save KSh {(originalPrice! - displayPrice).toLocaleString()}!
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "This amazing product is perfect for your child's development and entertainment. Made with high-quality materials and designed to last."}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-brana-green/10 text-brana-green">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="h-10 w-10"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                product.stock > 10 ? "bg-green-500" : 
                product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
              )} />
              <span className="text-sm font-medium">
                {product.stock > 10 ? "In Stock" : 
                 product.stock > 0 ? "Low Stock" : "Out of Stock"}
              </span>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={inCart || product.stock === 0}
                  className="bg-brana-green hover:bg-brana-green/90 text-white py-3 rounded-xl font-semibold"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {inCart ? "In Cart" : "Add to Cart"}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
                >
                  Buy Now
                </Button>
              </div>
              
              <Button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Order via WhatsApp
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center space-x-3">
                <div className="bg-brana-green/20 p-2 rounded-lg">
                  <Truck className="h-5 w-5 text-brana-green" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Free Delivery</div>
                  <div className="text-xs text-gray-500">On orders over KSh 2,000</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-brana-pink/20 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-brana-pink" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Secure Payment</div>
                  <div className="text-xs text-gray-500">100% safe transactions</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-brana-blue/20 p-2 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-brana-blue" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Easy Returns</div>
                  <div className="text-xs text-gray-500">30-day return policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

