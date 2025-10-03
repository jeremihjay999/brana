"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PromotionsTable } from "@/components/admin/promotions-table"
import { ActivePromotions } from "@/components/admin/active-promotions"
import { Plus, Search, Filter, Percent, Mail, BarChart3, Sparkles, Bell, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default PromotionsUpgradePage;

export function PromotionsUpgradePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-10 bg-gradient-to-br from-primary/10 to-background rounded-2xl shadow-2xl p-10">
      <div className="flex flex-col items-center gap-4">
        <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-500 p-6 shadow-lg mb-2">
          <Sparkles className="h-12 w-12 text-white drop-shadow-lg" />
        </span>
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text tracking-tight leading-tight">Unlock Promotions</h1>
        <p className="text-xl text-muted-foreground mb-4 font-medium">Upgrade your plan to access <span className="font-bold text-primary">advanced promotions</span>, discounts, and marketing tools. <br />Boost your sales and engage your customers with exclusive features designed for growth.</p>
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
          <Percent className="h-10 w-10 text-primary mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-primary">Automated Discounts</h2>
          <p className="text-base text-muted-foreground">Create time-limited offers and coupon codes to drive more sales.</p>
        </div>
        <div className="bg-white/90 dark:bg-card/90 rounded-2xl p-8 shadow-xl w-72 flex flex-col items-center gap-3 border border-primary/10 hover:scale-105 transition-transform">
          <Mail className="h-10 w-10 text-blue-500 mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-blue-500">Email Campaigns</h2>
          <p className="text-base text-muted-foreground">Send targeted promotions to your customers and increase engagement.</p>
        </div>
        <div className="bg-white/90 dark:bg-card/90 rounded-2xl p-8 shadow-xl w-72 flex flex-col items-center gap-3 border border-primary/10 hover:scale-105 transition-transform">
          <BarChart3 className="h-10 w-10 text-green-500 mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-green-500">Advanced Analytics</h2>
          <p className="text-base text-muted-foreground">Track promotion performance and optimize your marketing strategy.</p>
        </div>
      </div>
    </div>
  )
}
