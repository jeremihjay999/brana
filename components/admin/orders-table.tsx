"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, MoreHorizontal, Printer, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"

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

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"]

export function OrdersTable() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [editForm, setEditForm] = useState({ customer: "", email: "", status: "pending" })
  const [saving, setSaving] = useState(false)
  const [editProducts, setEditProducts] = useState<any[]>([])
  const printRef = useRef<HTMLDivElement>(null)
  const [printOrder, setPrintOrder] = useState<any | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    setLoading(true)
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(
          data.map((order: any) => {
            const firstProduct = order.products && order.products.length > 0 ? order.products[0] : {};
            const total = order.products ? order.products.reduce((sum: number, p: any) => sum + (p.price * (p.quantity || 1)), 0) : 0;
            return {
              id: order._id,
              customer: order.name || "",
              email: order.phone || "",
              status: firstProduct.status || "pending",
              date: firstProduct.createdAt || order.createdAt || new Date().toISOString(),
              total: total,
              items: order.products ? order.products.length : 0,
              paymentMethod: order.paymentMethod || "",
              products: order.products || [],
            };
          }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400">Processing</Badge>
      case "shipped":
        return <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">Delivered</Badge>
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-600 dark:text-red-400">Cancelled</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setDeletingId(id)
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setOrders((prev) => prev.filter((order) => order.id !== id))
        toast.success("Order deleted successfully")
      } else {
        toast.error("Failed to delete order")
      }
    } catch {
      toast.error("Failed to delete order")
    } finally {
      setDeletingId(null)
    }
  }

  const openEdit = (order: any) => {
    setEditingOrder(order)
    setEditForm({ customer: order.customer, email: order.email, status: order.status })
    setEditProducts(order.products || [])
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleProductChange = (idx: number, field: string, value: string | number) => {
    setEditProducts((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p))
  }

  const handleRemoveProduct = (idx: number) => {
    setEditProducts((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddProduct = () => {
    setEditProducts((prev) => [
      ...prev,
      { name: "", price: 0, quantity: 1 }
    ])
  }

  const handleEditSave = async () => {
    if (!editingOrder) return
    setSaving(true)
    try {
      const res = await fetch(`/api/orders?id=${editingOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.customer,
          phone: editForm.email,
          products: editProducts,
        })
      })
      if (res.ok) {
        const updatedOrders = await fetch("/api/orders").then(r => r.json())
        // Sort orders by date in descending order (newest first)
        const sortedOrders = updatedOrders
          .map((order: any) => ({
            id: order._id,
            customer: order.name || "",
            email: order.phone || "",
            status: order.products && order.products[0] ? order.products[0].status : "pending",
            date: order.products && order.products[0] ? order.products[0].createdAt : order.createdAt || new Date().toISOString(),
            total: order.products ? order.products.reduce((sum: number, p: any) => sum + (p.price * (p.quantity || 1)), 0) : 0,
            items: order.products ? order.products.length : 0,
            paymentMethod: order.paymentMethod || "",
            products: order.products || [],
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setOrders(sortedOrders)
        toast.success("Order updated successfully")
        setEditingOrder(null)
      } else {
        toast.error("Failed to update order")
      }
    } catch {
      toast.error("Failed to update order")
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = (order: any) => {
    setPrintOrder(order)
    setTimeout(() => {
      if (printRef.current) {
        const printContents = printRef.current.innerHTML
        const printWindow = window.open('', '', 'height=600,width=800')
        if (printWindow) {
          printWindow.document.write('<html><head><title>Invoice</title>')
          printWindow.document.write('</head><body >')
          printWindow.document.write(printContents)
          printWindow.document.write('</body></html>')
          printWindow.document.close()
          printWindow.focus()
          printWindow.print()
          printWindow.close()
        }
      }
      setPrintOrder(null)
    }, 100)
  }

  // Determine if any order has a payment method
  const showPayment = orders.some(order => order.paymentMethod && order.paymentMethod !== "")

  // Helper to get summary status
  const getOrderStatus = (products: any[]) => {
    if (!products || products.length === 0) return "-"
    const uniqueStatuses = Array.from(new Set(products.map(p => p.status)))
    return uniqueStatuses.length === 1 ? uniqueStatuses[0] : "Mixed"
  }

  const getAllStatuses = (products: any[]) => {
    if (!products || products.length === 0) return []
    return Array.from(new Set(products.map(p => p.status)))
  }

  // Filtered orders based on search and status
  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        // Search by customer, product name, or phone
        const searchLower = search.toLowerCase()
        const matchesSearch =
          order.customer.toLowerCase().includes(searchLower) ||
          order.email.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower) ||
          (order.products && order.products.some((p: any) => p.name.toLowerCase().includes(searchLower)))
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "mixed" && getOrderStatus(order.products) === "Mixed") ||
          (statusFilter !== "mixed" && getOrderStatus(order.products).toLowerCase() === statusFilter)
        return matchesSearch && matchesStatus
      })
      // Maintain sort order by date descending
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [orders, search, statusFilter])

  // Export to CSV
  const handleExport = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Products",
      "Status",
      "Date",
      "Items",
      "Total",
      ...(showPayment ? ["Payment"] : [])
    ]
    const rows = filteredOrders.map(order => [
      order.id,
      order.customer,
      order.products.map((p: any) => `${p.name} x${p.quantity}`).join("; "),
      getOrderStatus(order.products),
      formatDate(order.date),
      order.items,
      order.total,
      ...(showPayment ? [order.paymentMethod] : [])
    ])
    const csvContent = [headers, ...rows]
      .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "orders.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 pb-0">
          <div className="flex flex-1 gap-2 items-center">
            <Input
              placeholder="Search orders..."
              className="sm:max-w-xs"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="border rounded px-2 py-1 text-sm bg-background"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div className="flex gap-2 sm:justify-end">
            <Button variant="outline" size="sm" onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                {showPayment && <TableHead>Payment</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const allStatuses = getAllStatuses(order.products)
                return (
                  <TableRow key={order.id} className="hover:bg-muted/30 text-base">
                    <TableCell className="font-medium py-4">{order.id}</TableCell>
                    <TableCell className="py-4">
                      <div className="font-semibold text-base">{order.customer}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-base">{order.email}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      {order.products && order.products.length > 0 ? (
                        <div className="rounded-lg bg-muted/60 p-3 flex flex-col gap-2">
                          {order.products.map((p: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between gap-2 border-b last:border-b-0 pb-1 last:pb-0">
                              <div className="flex-1">
                                <div className="font-bold text-sm">{p.name}</div>
                                <div className="text-xs text-muted-foreground">Qty: {p.quantity}</div>
                              </div>
                              <div className="text-right min-w-[60px] font-semibold text-sm">Ksh {parseFloat(p.price).toFixed(2)}</div>
                              <div className="ml-2">{getStatusBadge(p.status)}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No products</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      {allStatuses.length > 1 ? (
                        <Tooltip content={allStatuses.join(", ")}> 
                          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs font-semibold cursor-help">Mixed</span>
                        </Tooltip>
                      ) : (
                        getOrderStatus(order.products) !== "-" ? getStatusBadge(getOrderStatus(order.products)) : <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">{formatDate(order.date)}</TableCell>
                    <TableCell className="py-4">{order.items}</TableCell>
                    <TableCell className="py-4">Ksh {order.total.toFixed(2)}</TableCell>
                    {showPayment && <TableCell className="py-4">{order.paymentMethod}</TableCell>}
                    <TableCell className="text-right py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handlePrint(order)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(order.id)} disabled={deletingId === order.id}>
                            <XCircle className="mr-2 h-4 w-4" />
                            {deletingId === order.id ? "Deleting..." : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {editingOrder && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl min-w-[400px] max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Edit Order</h2>
                <div className="mb-4 grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm mb-1 font-medium">Customer Name</label>
                    <Input name="customer" value={editForm.customer} onChange={handleEditChange} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 font-medium">Phone</label>
                    <Input name="email" value={editForm.email} onChange={handleEditChange} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 font-medium">Status (per product)</label>
                    <span className="text-xs text-muted-foreground">Set status for each product below</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Products</span>
                    <Button size="sm" variant="secondary" onClick={handleAddProduct}>+ Add Product</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editProducts.map((p, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Input value={p.name} onChange={e => handleProductChange(idx, "name", e.target.value)} placeholder="Product name" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={p.price} onChange={e => handleProductChange(idx, "price", parseFloat(e.target.value))} min={0} />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={p.quantity} onChange={e => handleProductChange(idx, "quantity", parseInt(e.target.value))} min={1} />
                          </TableCell>
                          <TableCell>
                            <select className="border rounded px-2 py-1" value={p.status || "pending"} onChange={e => handleProductChange(idx, "status", e.target.value)}>
                              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="destructive" onClick={() => handleRemoveProduct(idx)}>-</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="text-right mt-2 font-semibold">
                    Total: Ksh {editProducts.reduce((sum, p) => sum + (parseFloat(p.price) * (parseInt(p.quantity) || 1)), 0).toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <Button variant="outline" onClick={() => setEditingOrder(null)} disabled={saving}>Cancel</Button>
                  <Button onClick={handleEditSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                </div>
              </div>
            </div>
          )}
          {printOrder && (
            <div style={{ display: 'none' }}>
              <div ref={printRef}>
                <h2>Invoice</h2>
                <div><b>Order ID:</b> {printOrder.id}</div>
                <div><b>Customer:</b> {printOrder.customer}</div>
                <div><b>Phone:</b> {printOrder.email}</div>
                <div><b>Date:</b> {formatDate(printOrder.date)}</div>
                <hr />
                <h3>Products</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printOrder.products && printOrder.products.map((p: any, idx: number) => (
                      <tr key={idx}>
                        <td>{p.name}</td>
                        <td>Ksh {parseFloat(p.price).toFixed(2)}</td>
                        <td>{p.quantity}</td>
                        <td>{p.status}</td>
                        <td>Ksh {(parseFloat(p.price) * (parseInt(p.quantity) || 1)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                  <b>Total: Ksh {printOrder.products ? printOrder.products.reduce((sum: number, p: any) => sum + (parseFloat(p.price) * (parseInt(p.quantity) || 1)), 0).toFixed(2) : '0.00'}</b>
                </div>
              </div>
            </div>
          )}
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
