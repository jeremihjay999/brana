"use client"

import { useCart } from "@/components/cart-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from "lucide-react"
import Image from "next/image"
import { getWhatsAppUrl, generateOrderMessage } from "@/lib/whatsapp"
import { useRouter } from "next/navigation"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart()
  const router = useRouter()

  const handleWhatsAppOrder = () => {
    const message = generateOrderMessage(
      items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal
    )
    const whatsappUrl = getWhatsAppUrl(message)
    window.open(whatsappUrl, '_blank')
  }

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-brana-green" />
            <span>Shopping Cart ({items.length} items)</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started!</p>
              <Button onClick={onClose} className="bg-brana-green hover:bg-brana-green/90">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                    <p className="text-sm text-brana-green font-semibold">
                      KSh {item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-semibold text-gray-900">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-brana-green">
                  KSh {subtotal.toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-brana-green hover:bg-brana-green/90 text-white"
                >
                  Proceed to Checkout
                </Button>
                
                <Button 
                  onClick={handleWhatsAppOrder}
                  variant="outline"
                  className="w-full bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Order via WhatsApp
                </Button>
                
                <Button 
                  onClick={clearCart}
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

