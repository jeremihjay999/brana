"use client"

import React from "react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { ShoppingCart } from "@/components/shopping-cart"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
  searchHandler?: (value: string) => void
  searchValue?: string
}

export function Layout({ children, searchHandler, searchValue }: LayoutProps) {
  const pathname = usePathname()
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <MobileNav onSearch={searchHandler} />
            <Link href="/" className="hidden md:flex items-center transition-transform hover:scale-105">
              <div className="bg-white/90 dark:bg-amber-50 border border-border shadow-lg rounded-2xl p-2 flex items-center justify-center relative">
                <div className="flex items-center space-x-1">
                  <div className="text-xl font-bold text-brana-green">BRANA</div>
                  <div className="text-lg font-bold text-brana-pink">KIDS</div>
                </div>
                <div className="absolute -top-1 -right-1 text-brana-yellow text-sm">⭐</div>
              </div>
            </Link>
          </div>
          
          <MainNav onSearch={searchHandler} searchValue={searchValue} />
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <div className="h-5 w-px bg-border mx-0.5 hidden md:block" />
              <ShoppingCart />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">{children}</main>
      
      <Footer />
    </div>
  )
} 