"use client"

import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ContactPage() {
  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <MobileNav />
            <Link href="/" className="hidden md:flex items-center transition-transform hover:scale-105">
              <div className="bg-white/90 dark:bg-amber-50 border border-border shadow-lg rounded-2xl p-0 flex items-center justify-center">
                <Image
                  src="https://res.cloudinary.com/duo5azl81/image/upload/v1749407303/logo2_zxxky4.png"
                  alt="Safir Dynamics"
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                  priority
                />
              </div>
            </Link>
            <MainNav />
          </div>
        </div>
      </header>
      <main className="container py-12 md:py-16 px-4 md:px-6 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-10 bg-card/80 rounded-2xl shadow-2xl p-8 border border-primary/20">
          {/* Contact Info */}
          <div className="flex flex-col gap-8 justify-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">Contact Us</h1>
            <p className="text-muted-foreground mb-4">We'd love to hear from you! Reach out with any questions, feedback, or partnership inquiries.</p>
            <div className="flex items-center gap-3 text-lg">
              <Mail className="w-6 h-6 text-primary" />
              <span>safirdynamics@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <Phone className="w-6 h-6 text-primary" />
              <span>+254 722 490182</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <MapPin className="w-6 h-6 text-primary" />
              <span>Pioneer house, kimathi street, 3rd floor, room 1, Nairobi, Kenya</span>
            </div>
            <div className="mt-6">
              <div className="w-full h-40 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-muted-foreground border border-primary/20">
                <span>Map Placeholder</span>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <form className="flex flex-col gap-6 justify-center">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <Input id="name" placeholder="Your Name" required className="bg-muted/50" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input id="email" type="email" placeholder="you@email.com" required className="bg-muted/50" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <Textarea id="message" placeholder="How can we help you?" rows={5} required className="bg-muted/50" />
            </div>
            <Button type="submit" className="w-full gap-2 text-lg px-8 py-4 shadow-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold border-2 border-primary/60 hover:from-accent hover:to-primary hover:scale-105 transition-all duration-200">
              <Send className="h-5 w-5" /> Send Message
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
} 