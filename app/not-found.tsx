"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { ShoppingCart } from "@/components/shopping-cart"
import { Footer } from "@/components/footer"
import { Sparkles } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground dark:bg-[#10111a] dark:text-white transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-[#10111a]/95">
        <div className="container flex h-16 items-center relative">
          <MainNav />
          <MobileNav />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <ThemeToggle />
              <ShoppingCart />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="flex flex-col items-center gap-6">
          <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-6 shadow-lg">
            <Sparkles className="h-12 w-12 text-white" />
          </span>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">Coming Soon</h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-6 dark:text-gray-300">
            This page or feature is not available yet. We're working hard to bring it to you soon!
          </p>
          <Button asChild size="lg" className="px-8 py-4 text-lg font-bold">
            <Link href="/">Go Back Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
} 