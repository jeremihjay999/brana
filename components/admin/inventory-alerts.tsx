"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowRight, ShoppingCart, AlertCircle } from "lucide-react"

interface InventoryAlert {
  id: string
  type: "low-stock" | "out-of-stock" | "overstock"
  product: string
  sku: string
  message: string
}

export function InventoryAlerts() {
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setAlerts([
        {
          id: "ALERT-1",
          type: "out-of-stock",
          product: "Wireless Charging Pad",
          sku: "ACC-CHRG-WL",
          message: "Product is out of stock. Reorder immediately.",
        },
        {
          id: "ALERT-2",
          type: "out-of-stock",
          product: "4K Streaming Media Player",
          sku: "STREAM-4K-1",
          message: "Product is out of stock. Reorder immediately.",
        },
        {
          id: "ALERT-3",
          type: "low-stock",
          product: "Next-Gen Gaming Console",
          sku: "GAME-CON-X",
          message: "Stock level below reorder point. Consider reordering.",
        },
        {
          id: "ALERT-4",
          type: "low-stock",
          product: "Mechanical Gaming Keyboard",
          sku: "KB-MECH-RGB",
          message: "Stock level below reorder point. Consider reordering.",
        },
        {
          id: "ALERT-5",
          type: "overstock",
          product: "Smart Home Hub",
          sku: "SMART-HUB-1",
          message: "Excess inventory detected. Consider promotions.",
        },
      ])
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

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

  if (alerts.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-4 text-center">
            <p className="text-muted-foreground">No inventory alerts at this time.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Inventory Alerts
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-primary">
          View All Alerts
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`
                flex flex-col justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50
                ${
                  alert.type === "out-of-stock"
                    ? "border-l-4 border-l-red-500"
                    : alert.type === "low-stock"
                      ? "border-l-4 border-l-yellow-500"
                      : "border-l-4 border-l-blue-500"
                }
              `}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    className={
                      alert.type === "out-of-stock"
                        ? "bg-red-500/20 text-red-600 dark:text-red-400"
                        : alert.type === "low-stock"
                          ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                          : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    }
                  >
                    {alert.type === "out-of-stock"
                      ? "Out of Stock"
                      : alert.type === "low-stock"
                        ? "Low Stock"
                        : "Overstock"}
                  </Badge>
                  {alert.type === "out-of-stock" ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : alert.type === "low-stock" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <h3 className="font-medium">{alert.product}</h3>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-xs font-mono text-muted-foreground">SKU: {alert.sku}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" variant="outline" className="gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  Reorder
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
