"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Star, Heart, Sparkles, ArrowRight, Play } from "lucide-react"
import { getWhatsAppUrl } from "@/lib/whatsapp"
import Image from "next/image"

export function HeroSection() {
  const handleWhatsAppOrder = () => {
    const message = "Hello! I'm interested in your products. Can you help me find the perfect items for my child? 🌟"
    const whatsappUrl = getWhatsAppUrl(message)
    window.open(whatsappUrl, '_blank')
  }

  return (
    <section className="relative bg-gradient-to-br from-brana-green/5 via-brana-pink/5 to-brana-blue/5 py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-brana-yellow rounded-full animate-bounce-gentle"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-brana-pink rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-brana-blue rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-brana-green rounded-full animate-bounce-gentle" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-brana-green">Let Your</span>
                <br />
                <span className="text-brana-pink">Kid Smile</span>
                <br />
                <span className="text-brana-blue">Every Day!</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                Discover amazing toys, clothes, and accessories that bring joy and happiness to your little ones. Quality products designed for children's growth and development.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-brana-green">500+</div>
                <div className="text-sm text-gray-600">Happy Kids</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-brana-pink">1000+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-brana-blue">5★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleWhatsAppOrder}
                className="bg-gradient-to-r from-brana-green to-brana-green/90 hover:from-brana-green/90 hover:to-brana-green text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shop Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-brana-pink text-brana-pink hover:bg-brana-pink hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Video
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">4.9/5 (200+ reviews)</span>
              </div>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Featured Product 1 */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-brana-green/10 to-brana-pink/10 mb-3">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-4xl">🧸</div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        SALE
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm mb-1">LEGO Classic</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(12)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">KSh 2,500</span>
                    <span className="text-sm text-gray-500 line-through">KSh 3,200</span>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Product 2 */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-8">
                <CardContent className="p-4">
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-brana-pink/10 to-brana-blue/10 mb-3">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-4xl">🎨</div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        FEATURED
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm mb-1">Art Supplies</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(8)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">KSh 1,800</span>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Product 3 */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-brana-blue/10 to-brana-yellow/10 mb-3">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-4xl">🚗</div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        NEW
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm mb-1">Toy Cars</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(15)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">KSh 800</span>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Product 4 */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-8">
                <CardContent className="p-4">
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-brana-yellow/10 to-brana-green/10 mb-3">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-4xl">📚</div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        BEST
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm mb-1">Learning Books</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(22)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">KSh 1,200</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-brana-yellow rounded-full animate-bounce-gentle"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-brana-pink rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-brana-blue rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  )
}