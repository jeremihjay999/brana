"use client"

import { useState, useEffect, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, ShoppingBag, Mail, UserX, User, Calendar, Phone, Eye, TrendingUp, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { CustomerTrackingModal } from "@/components/admin/customer-tracking-modal"

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

interface CustomersTableProps {
  filterStatus?: "active" | "inactive"
}

export function CustomersTable({ filterStatus }: CustomersTableProps) {
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [trackingModalOpen, setTrackingModalOpen] = useState(false)

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
            paymentMethod: order.paymentMethod || "",
            products: order.products || [],
          }
          
          customerMap.get(phone)!.push(orderData)
        })

        // Convert to customer objects
        const customerData: Customer[] = Array.from(customerMap.entries()).map(([phone, orders]) => {
          const sortedOrders = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          const firstOrder = sortedOrders[0]
          const lastOrder = sortedOrders[sortedOrders.length - 1]
          const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
          const averageOrderValue = totalSpent / orders.length
          
          // Calculate customer lifetime value (total spent + potential future value)
          const customerLifetimeValue = totalSpent * 1.5 // Simple calculation
          
          // Calculate order frequency (orders per month)
          const firstOrderDate = new Date(firstOrder.date)
          const lastOrderDate = new Date(lastOrder.date)
          const monthsDiff = (lastOrderDate.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
          const orderFrequency = monthsDiff > 0 ? orders.length / monthsDiff : orders.length
          
          // Determine if customer is active (ordered in last 3 months)
          const threeMonthsAgo = new Date()
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
          const isActive = new Date(lastOrder.date) > threeMonthsAgo
          
          return {
            id: `CUST-${phone.slice(-4)}`,
            name: firstOrder.customer || "Unknown Customer",
            email: phone,
            phone: phone,
            status: isActive ? "active" : "inactive",
            orders: orders.length,
            totalSpent: totalSpent,
            lastOrder: lastOrder.date,
            dateJoined: firstOrder.date,
            orderHistory: sortedOrders,
            averageOrderValue: averageOrderValue,
            customerLifetimeValue: customerLifetimeValue,
            orderFrequency: orderFrequency,
            lastActivity: lastOrder.date,
          }
        })

        // Sort by total spent (highest first)
        const sortedCustomers = customerData.sort((a, b) => b.totalSpent - a.totalSpent)
        setCustomers(sortedCustomers)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch orders:", error)
        setLoading(false)
        toast.error("Failed to load customer data")
      })
  }, [])

  // Filter customers based on search and status
  const filteredCustomersMemo = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.id.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = !filterStatus || customer.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
  }, [customers, search, filterStatus])

  useEffect(() => {
    setFilteredCustomers(filteredCustomersMemo)
  }, [filteredCustomersMemo])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toFixed(2)}`
  }

  const getStatusBadge = (status: Customer["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-500/20 text-gray-600 dark:text-gray-400">Inactive</Badge>
      default:
        return null
    }
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

  const handleViewProfile = (customer: Customer) => {
    setSelectedCustomer(customer)
    // You can implement a modal or navigation to detailed view
    toast.info(`Viewing profile for ${customer.name}`)
  }

  const handleViewOrders = (customer: Customer) => {
    // Navigate to orders filtered by this customer
    toast.info(`Viewing orders for ${customer.name}`)
  }

  const handleSendEmail = (customer: Customer) => {
    // Implement email functionality
    toast.info(`Sending email to ${customer.email}`)
  }

  const handleToggleStatus = (customer: Customer) => {
    // Implement status toggle
    const newStatus = customer.status === "active" ? "inactive" : "active"
    toast.info(`${customer.name} status changed to ${newStatus}`)
  }

  const handleShowTracking = (customer: Customer) => {
    setSelectedCustomer(customer)
    setTrackingModalOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2 items-center">
          <Input
            placeholder="Search customers..."
            className="sm:max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Total: {filteredCustomers.length} customers</span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-md border">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-right">Avg Order</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => {
                    const tier = getCustomerTier(customer.totalSpent)
                    return (
                      <TableRow key={customer.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(customer.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-xs text-muted-foreground">{customer.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{customer.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>{getTierBadge(tier)}</TableCell>
                        <TableCell className="text-right font-medium">{customer.orders}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(customer.totalSpent)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(customer.averageOrderValue)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDate(customer.lastOrder)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDate(customer.dateJoined)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewProfile(customer)}>
                                <User className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewOrders(customer)}>
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                View Orders ({customer.orders})
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShowTracking(customer)}>
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Customer Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendEmail(customer)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleToggleStatus(customer)}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                {customer.status === "active" ? "Deactivate Account" : "Activate Account"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {/* Customer Tracking Modal */}
      <CustomerTrackingModal customer={selectedCustomer} open={trackingModalOpen} onOpenChange={setTrackingModalOpen} />
    </div>
  )
}
