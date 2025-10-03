"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  TrendingUp, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Clock, 
  Star,
  Eye,
  BarChart3
} from "lucide-react"

interface Order {
  id: string
  customer: string
  email: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  date: string
  total: number
  items: number
  paymentMethod: string
  products: any[]
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  status: "active" | "inactive"
  orders: number
  totalSpent: number
  lastOrder: string
  dateJoined: string
  avatar?: string
  orderHistory: Order[]
  averageOrderValue: number
  customerLifetimeValue: number
  orderFrequency: number
  lastActivity: string
}

interface CustomerTrackingModalProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerTrackingModal({ customer, open, onOpenChange }: CustomerTrackingModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!customer) return null

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 10000) return "VIP"
    if (totalSpent >= 5000) return "Gold"
    if (totalSpent >= 1000) return "Silver"
    return "Bronze"
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "VIP":
        return <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400">VIP</Badge>
      case "Gold":
        return <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">Gold</Badge>
      case "Silver":
        return <Badge className="bg-gray-500/20 text-gray-600 dark:text-gray-400">Silver</Badge>
      default:
        return <Badge className="bg-orange-500/20 text-orange-600 dark:text-orange-400">Bronze</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-600">Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-600">Processing</Badge>
      case "shipped":
        return <Badge className="bg-purple-500/20 text-purple-600">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-500/20 text-green-600">Delivered</Badge>
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-600">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-600">{status}</Badge>
    }
  }

  const calculateMetrics = () => {
    const orders = customer.orderHistory
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
    
    // Calculate days since first order
    const firstOrderDate = new Date(orders[0]?.date || customer.dateJoined)
    const daysSinceFirstOrder = Math.floor((Date.now() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Calculate days since last order
    const lastOrderDate = new Date(customer.lastOrder)
    const daysSinceLastOrder = Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Calculate order frequency (orders per month)
    const monthsSinceFirstOrder = daysSinceFirstOrder / 30
    const orderFrequency = monthsSinceFirstOrder > 0 ? totalOrders / monthsSinceFirstOrder : totalOrders
    
    // Calculate customer lifetime value
    const customerLifetimeValue = totalSpent * 1.5 // Simple calculation
    
    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      daysSinceFirstOrder,
      daysSinceLastOrder,
      orderFrequency,
      customerLifetimeValue,
    }
  }

  const metrics = calculateMetrics()
  const tier = getCustomerTier(customer.totalSpent)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Eye className="h-5 w-5" />
            Customer Tracking: {customer.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Customer Information</span>
                  <div className="flex items-center gap-2">
                    {getTierBadge(tier)}
                    {getStatusBadge(customer.status)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer ID</p>
                  <p className="text-lg font-semibold">{customer.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-lg font-semibold">{customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Joined</p>
                  <p className="text-lg font-semibold">{formatDate(customer.dateJoined)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Activity</p>
                  <p className="text-lg font-semibold">{formatDate(customer.lastActivity)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{metrics.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl font-bold">{formatCurrency(metrics.totalSpent)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Order</p>
                      <p className="text-2xl font-bold">{formatCurrency(metrics.averageOrderValue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Lifetime Value</p>
                      <p className="text-2xl font-bold">{formatCurrency(metrics.customerLifetimeValue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Complete order history for this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.orderHistory.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Behavior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Order Frequency</span>
                    <span className="font-semibold">{metrics.orderFrequency.toFixed(1)} orders/month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Days Since First Order</span>
                    <span className="font-semibold">{metrics.daysSinceFirstOrder} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Days Since Last Order</span>
                    <span className="font-semibold">{metrics.daysSinceLastOrder} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Customer Tier</span>
                    <span className="font-semibold">{tier}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                    <span className="font-semibold">{formatCurrency(metrics.totalSpent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Order Value</span>
                    <span className="font-semibold">{formatCurrency(metrics.averageOrderValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Customer Lifetime Value</span>
                    <span className="font-semibold">{formatCurrency(metrics.customerLifetimeValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Revenue per Month</span>
                    <span className="font-semibold">{formatCurrency(metrics.totalSpent / Math.max(metrics.daysSinceFirstOrder / 30, 1))}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Tracking</CardTitle>
                <CardDescription>Real-time tracking and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-muted-foreground">Last Order</p>
                    <p className="text-lg font-semibold">{metrics.daysSinceLastOrder} days ago</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Package className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm text-muted-foreground">Active Status</p>
                    <p className="text-lg font-semibold">{customer.status}</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm text-muted-foreground">Engagement Score</p>
                    <p className="text-lg font-semibold">{Math.min(100, Math.max(0, 100 - metrics.daysSinceLastOrder))}%</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Recommendations</h4>
                  <div className="space-y-2">
                    {metrics.daysSinceLastOrder > 30 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Re-engagement needed:</strong> Customer hasn't ordered in {metrics.daysSinceLastOrder} days. 
                          Consider sending a personalized offer.
                        </p>
                      </div>
                    )}
                    {metrics.orderFrequency > 2 && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>High-value customer:</strong> This customer orders frequently. 
                          Consider VIP treatment and exclusive offers.
                        </p>
                      </div>
                    )}
                    {metrics.averageOrderValue > 1000 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Premium customer:</strong> High average order value. 
                          Focus on premium products and services.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 