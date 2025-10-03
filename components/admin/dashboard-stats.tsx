"use client"

import { useEffect, useState } from "react"
import { ArrowUp, DollarSign, Package, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DashboardStats() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
        ])
        const orders = await ordersRes.json()
        const products = await productsRes.json()
        const revenue = Array.isArray(orders)
          ? orders.reduce(
              (sum, o) =>
                sum +
                (o.products?.reduce(
                  (s, p) => s + (parseFloat(p.price) * (parseInt(p.quantity) || 1)),
                  0
                ) || 0),
              0
            )
          : 0
        setStats({
          revenue,
          orders: Array.isArray(orders) ? orders.length : 0,
          products: Array.isArray(products) ? products.length : 0,
        })
      } catch {
        setStats({ revenue: 0, orders: 0, products: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="overflow-hidden border-none shadow-md">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                {loading ? <span className="animate-pulse">...</span> : `Ksh ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <span className="text-lg font-bold text-green-500">Ksh</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Orders</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                {loading ? <span className="animate-pulse">...</span> : stats.orders}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
              <ShoppingCart className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Products</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                {loading ? <span className="animate-pulse">...</span> : stats.products}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10">
              <Package className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
