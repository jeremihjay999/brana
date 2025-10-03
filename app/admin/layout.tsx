import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { AdminShell } from "./AdminShell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Safir Dynamics Admin | Dashboard",
  description: "Admin dashboard for Safir Dynamics e-commerce platform",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`min-h-screen bg-background ${inter.className}`}>
      <AdminShell>{children}</AdminShell>
      <Toaster />
    </div>
  )
}
