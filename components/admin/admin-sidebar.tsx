"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Box,
  CircleUser,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  Zap,
  ChevronRight,
  Sparkles,
  Shield,
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Super Admin",
    href: "/admin/super-admin",
    icon: Shield,
    superAdminOnly: true,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Promotions",
    href: "/admin/promotions",
    icon: BarChart3,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Box,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: CircleUser,
    adminOnly: true,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Banners",
    href: "/admin/banners",
    icon: Sparkles,
  },
]

export function AdminSidebar({ showMobileMenu, setShowMobileMenu }: { showMobileMenu: boolean, setShowMobileMenu: (open: boolean) => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userData, setUserData] = useState<{ name: string; email: string; role?: string } | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Get user data from localStorage
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr)
          setUserData(userInfo)
        } catch (e) {
          console.error('Failed to parse user info', e)
        }
      }
    }
  }, [])

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

  // Filter nav items based on user role
  const filteredNavItems = sidebarNavItems.filter(item => {
    if (item.superAdminOnly) {
      return userData?.role === 'super_admin';
    }
    if (item.adminOnly) {
      return userData?.role === 'admin' || userData?.role === 'super_admin';
    }
    return true;
  });

  // Sidebar overlay and close logic for mobile
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          showMobileMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setShowMobileMenu(false)}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <div
        className={cn(
          "fixed z-50 top-0 left-0 h-full w-64 flex flex-col border-r bg-background transition-transform duration-300 md:static md:flex md:w-64 dark:bg-background dark:border-r-[#202234]",
          showMobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b px-3 py-4 justify-between flex-shrink-0">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-semibold transition-all duration-300 ease-in-out md:gap-3"
            onClick={() => setShowMobileMenu(false)}
          >
            <div className="h-10 w-10 rounded-lg shadow-lg bg-white p-1 flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <div className="text-lg font-bold text-brana-green">BRANA</div>
                <div className="text-sm font-bold text-brana-pink">KIDS</div>
              </div>
            </div>
            <span className="ml-2 text-xl font-bold text-primary whitespace-nowrap">Admin Panel</span>
          </Link>
          {/* Show close button only on mobile */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(false)}>
            <span className="sr-only">Close Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        
        {/* Navigation - scrollable area */}
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/50 text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="whitespace-nowrap transition-all duration-300 ease-in-out opacity-100 visible w-auto">
                    {item.title}
                  </span>
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-300 ease-in-out hover:opacity-100 md:opacity-100" />
                  )}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        
        {/* Footer with user profile and logout - always visible */}
        <div className="border-t p-4 dark:border-t-[#202234] flex-shrink-0 bg-background">
          <div className="flex flex-col space-y-3">
            {/* User profile section */}
            <div className="flex items-center gap-3 rounded-md bg-[#1E1F2D] p-3 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600/20 text-teal-500">
                <CircleUser className="h-6 w-6" />
              </div>
              <div className="overflow-hidden transition-all duration-300 ease-in-out opacity-100 visible w-auto">
                <p className="text-sm font-medium leading-none text-white">
                  {userData?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {userData?.email || 'admin@techlux.com'}
                </p>
              </div>
            </div>
            
            {/* Logout button - made more prominent on mobile */}
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full justify-start gap-3 text-white hover:text-white rounded-md p-3 h-auto font-normal disabled:opacity-70 md:bg-red-600/20 md:text-red-500 md:hover:bg-red-600/30 md:border md:border-red-500/30"
            >
              <div className="bg-red-600 rounded-full h-8 w-8 flex items-center justify-center md:bg-red-500/20">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="whitespace-nowrap font-medium">
                {isLoggingOut ? "Signing out..." : "Log out"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
