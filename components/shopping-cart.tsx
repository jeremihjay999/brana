"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingCartIcon as CartIcon, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"
import { getWhatsAppUrl, generateOrderMessage } from "@/lib/whatsapp"

export function ShoppingCart() {
  const { items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, total } = useCart()
  const [open, setOpen] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", notes: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleOrderField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOrderForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Function to handle WhatsApp checkout
  const handleWhatsAppCheckout = () => {
    setShowOrderModal(true)
  }

  const handleOrderSubmit = async () => {
    setLoading(true)
    const message = generateOrderMessage(
      cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      orderForm.name || undefined,
      orderForm.phone || undefined
    )
    const whatsappUrl = getWhatsAppUrl(message)

    // Save order to DB with correct fields
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orderForm.name || "WhatsApp",
          phone: orderForm.phone,
          products: cartItems,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "pending",
          notes: orderForm.notes
        })
      })
    } catch (err) {
      // Optionally handle error (e.g., show toast)
    }
    setLoading(false)
    setShowOrderModal(false)
    window.open(whatsappUrl, '_blank')
    setOpen(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <CartIcon className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
            <span className="sr-only">Open cart</span>
          </div>
        </SheetTrigger>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader className="px-1">
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          {cartItems.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-muted p-6">
                <CartIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
              </div>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4 py-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="space-y-4 pt-4">
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleWhatsAppCheckout}>
                  Checkout via WhatsApp
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                  Continue Shopping
                </Button>
                <Button variant="ghost" className="w-full text-red-600" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input name="name" placeholder="Full Name" value={orderForm.name} onChange={handleOrderField} required />
            <Input name="phone" placeholder="Phone Number" value={orderForm.phone} onChange={handleOrderField} required />
            <Textarea name="notes" placeholder="Order Notes (optional)" value={orderForm.notes} onChange={handleOrderField} />
          </div>
          <DialogFooter>
            <Button onClick={handleOrderSubmit} disabled={loading || !orderForm.phone || !orderForm.name} className="w-full">
              {loading ? "Processing..." : "Submit & Continue to WhatsApp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
