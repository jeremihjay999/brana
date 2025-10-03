"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const pathname = usePathname();

  // Only render the form for login/signup
  if (pathname === "/admin/login" || pathname === "/admin/signup") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
        <main className="relative flex-1 overflow-y-auto bg-muted/30 p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
} 