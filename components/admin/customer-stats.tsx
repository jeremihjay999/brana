"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Users, UserPlus, Wallet, TrendingUp, ShoppingBag } from "lucide-react"

interface Order {
  id: string
  customer: string
  email: string
  status: string
  date: string
  total: number
  items: number
  products: any[]
}

export function CustomerStats() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    newCustomers: 0,
    repeatCustomers: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalOrders: 0,
    customerRetentionRate: 0,
    totalCustomersChange: 0,
    activeCustomersChange: 0,
    newCustomersChange: 0,
    repeatCustomersChange: 0,
  })

  useEffect(() => {
    setLoading(true)
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        // Group orders by customer (phone number)
        const customerMap = new Map<string, Order[]>()
        
        data.forEach((order: any) => {
          const phone = order.phone || order.email || "unknown"
          if (!customerMap.has(phone)) {
            customerMap.set(phone, [])
          }
          
          const orderData: Order = {
            id: order._id,
            customer: order.name || "",
            email: order.phone || "",
            status: order.products && order.products[0] ? order.products[0].status : "pending",
            date: order.products && order.products[0] ? order.products[0].createdAt : order.createdAt || new Date().toISOString(),
            total: order.products ? order.products.reduce((sum: number, p: any) => sum + (parseFloat(p.price) * (parseInt(p.quantity) || 1)), 0) : 0,
            items: order.products ? order.products.length : 0,
            products: order.products || [],
          }
          
          customerMap.get(phone)!.push(orderData)
        })

        // Calculate statistics
        const customers = Array.from(customerMap.values())
        const totalCustomers = customers.length
        const totalOrders = data.length
        const totalRevenue = data.reduce((sum: number, order: any) => {
          return sum + (order.products ? order.products.reduce((orderSum: number, p: any) => orderSum + (parseFloat(p.price) * (parseInt(p.quantity) || 1)), 0) : 0)
        }, 0)
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        // Calculate active customers (ordered in last 3 months)
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        const activeCustomers = customers.filter(customerOrders => {
          const lastOrder = customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
          return new Date(lastOrder.date) > threeMonthsAgo
        }).length

        // Calculate new customers (first order in last month)
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        const newCustomers = customers.filter(customerOrders => {
          const firstOrder = customerOrders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
          return new Date(firstOrder.date) > oneMonthAgo
        }).length

        // Calculate repeat customers (more than 1 order)
        const repeatCustomers = customers.filter(customerOrders => customerOrders.length > 1).length

        // Calculate customer retention rate
        const customerRetentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0

        // Calculate month-over-month changes (simplified)
        const twoMonthsAgo = new Date()
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
        const previousMonthCustomers = customers.filter(customerOrders => {
          const lastOrder = customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
          return new Date(lastOrder.date) > twoMonthsAgo && new Date(lastOrder.date) <= oneMonthAgo
        }).length

        const totalCustomersChange = previousMonthCustomers > 0 ? ((totalCustomers - previousMonthCustomers) / previousMonthCustomers) * 100 : 0
        const activeCustomersChange = totalCustomersChange // Simplified
        const newCustomersChange = totalCustomersChange // Simplified
        const repeatCustomersChange = totalCustomersChange // Simplified

        setStats({
          totalCustomers,
          activeCustomers,
          newCustomers,
          repeatCustomers,
          totalRevenue,
          averageOrderValue,
          totalOrders,
          customerRetentionRate,
          totalCustomersChange,
          activeCustomersChange,
          newCustomersChange,
          repeatCustomersChange,
        })
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch orders for stats:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex h-[80px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toFixed(2)}`
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border-none shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 to-primary"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">{stats.totalCustomers.toLocaleString()}</p>
              <div className="mt-2 flex items-center text-xs">
                {stats.totalCustomersChange > 0 ? (
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    {stats.totalCustomersChange.toFixed(1)}%
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <ArrowDown className="mr-1 h-3 w-3" />
                    {Math.abs(stats.totalCustomersChange).toFixed(1)}%
                  </div>
                )}
                <span className="ml-1 text-muted-foreground">from last month</span>
              </div>
            </div>
            <div className="rounded-full bg-primary/10 p-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">{stats.activeCustomers.toLocaleString()}</p>
              <div className="mt-2 flex items-center text-xs">
                {stats.activeCustomersChange > 0 ? (
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    {stats.activeCustomersChange.toFixed(1)}%
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <ArrowDown className="mr-1 h-3 w-3" />
                    {Math.abs(stats.activeCustomersChange).toFixed(1)}%
                  </div>
                )}
                <span className="ml-1 text-muted-foreground">from last month</span>
              </div>
            </div>
            <div className="rounded-full bg-green-500/10 p-4">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">{formatCurrency(stats.totalRevenue)}</p>
              <div className="mt-2 flex items-center text-xs">
                <span className="text-muted-foreground">
                  {stats.totalOrders} orders • Avg: {formatCurrency(stats.averageOrderValue)}
                </span>
              </div>
            </div>
            <div className="rounded-full bg-blue-500/10 p-4">
              <Wallet className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">{stats.customerRetentionRate.toFixed(1)}%</p>
              <div className="mt-2 flex items-center text-xs">
                <span className="text-muted-foreground">
                  {stats.repeatCustomers} repeat customers
                </span>
              </div>
            </div>
            <div className="rounded-full bg-purple-500/10 p-4">
              <ShoppingBag className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
