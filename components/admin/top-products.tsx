"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TopProductsProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Product {
  id: string
  name: string
  category: string
  sales: number
  revenue: number
  tags?: string[]
}

export function TopProducts({ className, ...props }: TopProductsProps) {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch("/api/orders").then(res => res.json()),
      fetch("/api/products").then(res => res.json()),
    ]).then(([orders, products]) => {
      // Count sales for each product for the current month
      const now = new Date()
      const month = now.getMonth()
      const year = now.getFullYear()
      const salesMap: Record<string, { sales: number; revenue: number }> = {}
      ;(Array.isArray(orders) ? orders : []).forEach((order: any) => {
        (order.products || []).forEach((p: any) => {
          const createdAt = new Date(p.createdAt || order.createdAt || now)
          if (createdAt.getMonth() === month && createdAt.getFullYear() === year) {
            if (!salesMap[p.name]) salesMap[p.name] = { sales: 0, revenue: 0 }
            salesMap[p.name].sales += parseInt(p.quantity) || 1
            salesMap[p.name].revenue += parseFloat(p.price) * (parseInt(p.quantity) || 1)
          }
        })
      })
      // Map to product list
      const topProducts = Object.entries(salesMap)
        .map(([name, { sales, revenue }]) => {
          const prod = (Array.isArray(products) ? products : []).find((pr: any) => pr.name === name)
          return {
            id: prod?._id || name,
            name,
            category: prod?.category || "-",
            sales,
            revenue,
          }
        })
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)
      setProducts(topProducts)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <Card className={cn("col-span-1", className)} {...props}>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best selling products this month</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Ksh {(product.revenue).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
