"use client"

import { useState } from "react"
import { Bell, Menu, Search, Calendar, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function AdminHeader({ showMobileMenu, setShowMobileMenu }: { showMobileMenu: boolean, setShowMobileMenu: (open: boolean) => void }) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const isUpgraded = false // Set to true if user is upgraded
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Call the logout API to clear server-side cookies
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      // Clear client-side storage
      localStorage.removeItem('adminToken')
      localStorage.removeItem('userInfo')
      
      // Redirect to login page
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur-sm">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="hidden items-center gap-2 md:flex">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{currentDate}</span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-[300px] rounded-full bg-muted/50 pl-10 pr-4" />
        </div>

        <Button variant="outline" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>

        {/* Notification Bell - disabled for non-upgraded users */}
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full"
          onClick={() => {
            if (!isUpgraded) {
              toast.info("Upgrade to unlock notifications.")
              return
            }
            // If upgraded, open notifications modal/dropdown (not implemented here)
          }}
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]">3</Badge>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Mobile Logout Button - fallback for mobile */}
        <Button 
          variant="destructive" 
          size="icon"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="md:hidden rounded-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>

        <ThemeToggle />
      </div>
    </header>
  )
}
