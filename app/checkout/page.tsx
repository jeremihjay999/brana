"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/components/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Send } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { getWhatsAppUrl, generateOrderMessage } from "@/lib/whatsapp"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate WhatsApp message using utility function
      const message = generateOrderMessage(
        items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        formData.name || undefined,
        formData.phone || undefined
      )

      // Create WhatsApp URL
      const whatsappUrl = getWhatsAppUrl(message)

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank')

      // Clear cart and show success message
      clearCart()
      toast({
        title: "Order Submitted",
        description: "Your order has been sent to our support team. We'll contact you shortly!",
      })
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (items.length === 0) {
    return (
      <>
        <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav />
            <MobileNav />
          </div>
        </header>
        <main className="container py-12 md:py-16 px-4 md:px-6 min-h-[60vh] flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to your cart before checking out.</p>
            <Button onClick={() => router.push('/products')}>Browse Products</Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <MobileNav />
        </div>
      </header>
      <main className="container py-12 md:py-16 px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">Delivery Address</label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="bg-muted/50"
                    placeholder="Any special instructions or preferences?"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full gap-2 text-lg px-8 py-4 shadow-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold border-2 border-primary/60 hover:from-accent hover:to-primary hover:scale-105 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Place Order
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 