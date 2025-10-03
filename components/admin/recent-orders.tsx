"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatCurrency } from "@/lib/utils"
import { Eye } from "lucide-react"

interface RecentOrdersProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Order {
  id: string
  customer: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  date: string
  total: number
  items: number
}

export function RecentOrders({ className, ...props }: RecentOrdersProps) {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    setLoading(true)
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        // Map and sort orders by date descending
        const orders = (Array.isArray(data) ? data : [])
          .map((order: any) => ({
            id: order._id || order.id,
            customer: order.name || order.customer || order.phone || "-",
            status: order.products && order.products[0] ? order.products[0].status : "pending",
            date: order.products && order.products[0] ? order.products[0].createdAt : order.createdAt || new Date().toISOString(),
            total: order.products ? order.products.reduce((sum: number, p: any) => sum + (parseFloat(p.price) * (parseInt(p.quantity) || 1)), 0) : 0,
            items: order.products ? order.products.length : 0,
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
        setOrders(orders)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
      case "processing":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400"
      case "shipped":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400"
      case "delivered":
        return "bg-green-500/20 text-green-600 dark:text-green-400"
      case "cancelled":
        return "bg-red-500/20 text-red-600 dark:text-red-400"
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <Card className={cn("col-span-2", className)} {...props}>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders and their status</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-2 p-4 text-sm font-medium text-muted-foreground md:grid-cols-7">
                <div className="col-span-2">Order</div>
                <div className="hidden md:block">Items</div>
                <div>Status</div>
                <div>Date</div>
                <div className="text-right">Total</div>
                <div className="text-right">Actions</div>
              </div>
              {orders.map((order) => (
                <div key={order.id} className="grid grid-cols-6 gap-2 border-t p-4 text-sm md:grid-cols-7">
                  <div className="col-span-2">
                    <div className="font-medium">{order.id}</div>
                    <div className="text-muted-foreground">{order.customer}</div>
                  </div>
                  <div className="hidden md:block">{order.items}</div>
                  <div>
                    <Badge className={cn("capitalize", getStatusColor(order.status))}>{order.status}</Badge>
                  </div>
                  <div>{formatDate(order.date)}</div>
                  <div className="text-right font-medium">{formatCurrency(order.total)}</div>
                  <div className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View order {order.id}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">View All Orders</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
