"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Percent, Tag, Truck, Gift, Copy, MoreHorizontal, Calendar } from "lucide-react"

interface ActivePromotion {
  id: string
  name: string
  type: "percentage" | "fixed" | "bogo" | "free-shipping"
  value: number
  code: string
  endDate: string
  usageLimit: number
  usageCount: number
  progress: number
}

export function ActivePromotions() {
  const [loading, setLoading] = useState(true)
  const [promotions, setPromotions] = useState<ActivePromotion[]>([])

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setPromotions([
        {
          id: "PROMO-1234",
          name: "Summer Sale",
          type: "percentage",
          value: 20,
          code: "SUMMER20",
          endDate: "2023-08-31T23:59:59",
          usageLimit: 1000,
          usageCount: 423,
          progress: 42,
        },
        {
          id: "PROMO-2345",
          name: "New Customer Discount",
          type: "percentage",
          value: 15,
          code: "WELCOME15",
          endDate: "2023-12-31T23:59:59",
          usageLimit: 0,
          usageCount: 1245,
          progress: 0,
        },
        {
          id: "PROMO-5678",
          name: "Buy One Get One Free",
          type: "bogo",
          value: 100,
          code: "BOGOFREE",
          endDate: "2023-07-30T23:59:59",
          usageLimit: 200,
          usageCount: 87,
          progress: 44,
        },
      ])
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const getTypeIcon = (type: ActivePromotion["type"]) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-5 w-5 text-primary" />
      case "fixed":
        return <Tag className="h-5 w-5 text-green-500" />
      case "bogo":
        return <Gift className="h-5 w-5 text-purple-500" />
      case "free-shipping":
        return <Truck className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const formatValue = (type: ActivePromotion["type"], value: number) => {
    switch (type) {
      case "percentage":
        return `${value}% Off`
      case "fixed":
        return `$${value.toFixed(2)} Off`
      case "bogo":
        return `Buy One Get One ${value === 100 ? "Free" : `${value}% Off`}`
      case "free-shipping":
        return "Free Shipping"
      default:
        return value
    }
  }

  if (loading) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex h-[100px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (promotions.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-4 text-center">
            <p className="text-muted-foreground">No active promotions at this time.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Active Promotions</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-primary">
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="group relative overflow-hidden rounded-lg border bg-card p-5 transition-all hover:shadow-md"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 to-primary"></div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">{getTypeIcon(promotion.type)}</div>
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">Active</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <h4 className="mb-1 text-lg font-medium">{promotion.name}</h4>
              <p className="text-sm font-medium text-primary">{formatValue(promotion.type, promotion.value)}</p>

              {promotion.code && (
                <div className="mt-3 flex items-center gap-1">
                  <code className="rounded bg-muted px-2 py-1 text-sm">{promotion.code}</code>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Ends: {formatDate(promotion.endDate)}</span>
              </div>

              {promotion.usageLimit > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">Usage</span>
                    <span>
                      {promotion.usageCount}/{promotion.usageLimit}
                    </span>
                  </div>
                  <Progress value={promotion.progress} className="h-2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
