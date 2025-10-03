"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InventoryTable } from "@/components/admin/inventory-table"
import { InventoryAlerts } from "@/components/admin/inventory-alerts"
import { Plus, FileDown, FileUp, Filter, Search, Boxes, Bell, RefreshCw, Sparkles, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default InventoryUpgradePage;

export function InventoryUpgradePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-10 bg-gradient-to-br from-primary/10 to-background rounded-2xl shadow-2xl p-10">
      <div className="flex flex-col items-center gap-4">
        <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-500 p-6 shadow-lg mb-2">
          <Sparkles className="h-12 w-12 text-white drop-shadow-lg" />
        </span>
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text tracking-tight leading-tight">Unlock Inventory Management</h1>
        <p className="text-xl text-muted-foreground mb-4 font-medium">Upgrade your plan to access <span className="font-bold text-primary">advanced inventory</span> tracking, low-stock alerts, and automated restocking tools. <br />Take control of your stock and never miss a sale.</p>
        <Button size="lg" className="text-lg px-10 py-4 font-bold shadow-2xl bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary transition rounded-full uppercase tracking-wider">Upgrade Now</Button>
        <div className="relative flex items-center justify-center mt-6">
          <span className="inline-flex items-center justify-center rounded-full bg-muted/80 p-4 shadow-md">
            <Bell className="h-8 w-8 text-primary" />
            <span className="absolute -top-2 -right-2 flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-blue-500 text-white font-bold text-base border-2 border-background">
              <Lock className="h-4 w-4" />
            </span>
          </span>
        </div>
        <span className="text-sm text-muted-foreground mt-2">Upgrade to unlock notifications and alerts.</span>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mt-8">
        <div className="bg-white/90 dark:bg-card/90 rounded-2xl p-8 shadow-xl w-72 flex flex-col items-center gap-3 border border-primary/10 hover:scale-105 transition-transform">
          <Boxes className="h-10 w-10 text-primary mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-primary">Real-Time Tracking</h2>
          <p className="text-base text-muted-foreground">Monitor stock levels and movements in real time across all products.</p>
        </div>
        <div className="bg-white/90 dark:bg-card/90 rounded-2xl p-8 shadow-xl w-72 flex flex-col items-center gap-3 border border-primary/10 hover:scale-105 transition-transform">
          <Bell className="h-10 w-10 text-blue-500 mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-blue-500">Low-Stock Alerts</h2>
          <p className="text-base text-muted-foreground">Get notified instantly when products are running low.</p>
        </div>
        <div className="bg-white/90 dark:bg-card/90 rounded-2xl p-8 shadow-xl w-72 flex flex-col items-center gap-3 border border-primary/10 hover:scale-105 transition-transform">
          <RefreshCw className="h-10 w-10 text-green-500 mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-green-500">Automated Restocking</h2>
          <p className="text-base text-muted-foreground">Set up rules for automatic restocking and supplier notifications.</p>
        </div>
      </div>
    </div>
  )
}
