"use client"

import { useState, useEffect } from "react"
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
import { Edit, MoreHorizontal, ArrowUpDown, History, AlertTriangle, CheckCircle2 } from "lucide-react"

interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  inStock: number
  allocated: number
  reorderPoint: number
  reorderQty: number
  lastUpdated: string
  status: "in-stock" | "low-stock" | "out-of-stock" | "overstock"
}

interface InventoryTableProps {
  filterStatus?: "in-stock" | "low-stock" | "out-of-stock" | "overstock"
}

export function InventoryTable({ filterStatus }: InventoryTableProps) {
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([])

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      const data = [
        {
          id: "INV-1234",
          sku: "MON-UHD-27",
          name: "Ultra HD Gaming Monitor",
          category: "Monitors",
          inStock: 15,
          allocated: 2,
          reorderPoint: 5,
          reorderQty: 10,
          lastUpdated: "2023-04-24T12:28:00",
          status: "in-stock",
        },
        {
          id: "INV-2345",
          sku: "AUDIO-PRO-WL",
          name: "Pro Wireless Headphones",
          category: "Audio",
          inStock: 8,
          allocated: 3,
          reorderPoint: 10,
          reorderQty: 15,
          lastUpdated: "2023-04-23T10:14:00",
          status: "low-stock",
        },
        {
          id: "INV-3456",
          sku: "GAME-CON-X",
          name: "Next-Gen Gaming Console",
          category: "Gaming",
          inStock: 3,
          allocated: 1,
          reorderPoint: 5,
          reorderQty: 10,
          lastUpdated: "2023-04-22T16:48:00",
          status: "low-stock",
        },
        {
          id: "INV-4567",
          sku: "PHONE-PRO-12",
          name: "Premium Smartphone",
          category: "Smartphones",
          inStock: 12,
          allocated: 0,
          reorderPoint: 8,
          reorderQty: 12,
          lastUpdated: "2023-04-21T09:32:00",
          status: "in-stock",
        },
        {
          id: "INV-5678",
          sku: "ACC-CHRG-WL",
          name: "Wireless Charging Pad",
          category: "Accessories",
          inStock: 0,
          allocated: 0,
          reorderPoint: 15,
          reorderQty: 25,
          lastUpdated: "2023-04-20T14:20:00",
          status: "out-of-stock",
        },
        {
          id: "INV-6789",
          sku: "SMART-HUB-1",
          name: "Smart Home Hub",
          category: "Smart Home",
          inStock: 42,
          allocated: 5,
          reorderPoint: 10,
          reorderQty: 15,
          lastUpdated: "2023-04-19T11:05:00",
          status: "overstock",
        },
        {
          id: "INV-7890",
          sku: "KB-MECH-RGB",
          name: "Mechanical Gaming Keyboard",
          category: "Peripherals",
          inStock: 2,
          allocated: 0,
          reorderPoint: 5,
          reorderQty: 10,
          lastUpdated: "2023-04-18T15:40:00",
          status: "low-stock",
        },
        {
          id: "INV-8901",
          sku: "STREAM-4K-1",
          name: "4K Streaming Media Player",
          category: "TV & Home Theater",
          inStock: 0,
          allocated: 0,
          reorderPoint: 8,
          reorderQty: 12,
          lastUpdated: "2023-04-17T09:18:00",
          status: "out-of-stock",
        },
      ]
      setInventory(data)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (filterStatus) {
      setFilteredInventory(inventory.filter((item) => item.status === filterStatus))
    } else {
      setFilteredInventory(inventory)
    }
  }, [inventory, filterStatus])

  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in-stock":
        return (
          <div className="flex items-center gap-1">
            <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">In Stock</Badge>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
        )
      case "low-stock":
        return (
          <div className="flex items-center gap-1">
            <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">Low Stock</Badge>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </div>
        )
      case "out-of-stock":
        return (
          <div className="flex items-center gap-1">
            <Badge className="bg-red-500/20 text-red-600 dark:text-red-400">Out of Stock</Badge>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
        )
      case "overstock":
        return (
          <div className="flex items-center gap-1">
            <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400">Overstock</Badge>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </div>
        )
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

  return (
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
                <TableHead className="w-[100px]">SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">In Stock</TableHead>
                <TableHead className="text-right">Allocated</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Reorder Point</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No inventory items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.inStock}</TableCell>
                    <TableCell className="text-right">{item.allocated}</TableCell>
                    <TableCell className="text-right">{item.inStock - item.allocated}</TableCell>
                    <TableCell className="text-right">{item.reorderPoint}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{formatDate(item.lastUpdated)}</TableCell>
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
                          <DropdownMenuItem>
                            <ArrowUpDown className="mr-2 h-4 w-4" />
                            Adjust Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <History className="mr-2 h-4 w-4" />
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
