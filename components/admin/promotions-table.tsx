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
import { Copy, Edit, MoreHorizontal, Trash, Eye, BarChart, Calendar } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Promotion {
  id: string
  name: string
  type: "percentage" | "fixed" | "bogo" | "free-shipping"
  value: number
  code: string
  startDate: string
  endDate: string
  usageLimit: number
  usageCount: number
  status: "active" | "scheduled" | "expired" | "draft"
}

interface PromotionsTableProps {
  filterStatus?: "active" | "scheduled" | "expired" | "draft"
}

export function PromotionsTable({ filterStatus }: PromotionsTableProps) {
  const [loading, setLoading] = useState(true)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([])

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      const data = [
        {
          id: "PROMO-1234",
          name: "Summer Sale",
          type: "percentage",
          value: 20,
          code: "SUMMER20",
          startDate: "2023-06-01T00:00:00",
          endDate: "2023-08-31T23:59:59",
          usageLimit: 1000,
          usageCount: 423,
          status: "active",
        },
        {
          id: "PROMO-2345",
          name: "New Customer Discount",
          type: "percentage",
          value: 15,
          code: "WELCOME15",
          startDate: "2023-01-01T00:00:00",
          endDate: "2023-12-31T23:59:59",
          usageLimit: 0,
          usageCount: 1245,
          status: "active",
        },
        {
          id: "PROMO-3456",
          name: "Black Friday",
          type: "percentage",
          value: 30,
          code: "BLACKFRI30",
          startDate: "2023-11-24T00:00:00",
          endDate: "2023-11-27T23:59:59",
          usageLimit: 0,
          usageCount: 0,
          status: "scheduled",
        },
        {
          id: "PROMO-4567",
          name: "Free Shipping",
          type: "free-shipping",
          value: 0,
          code: "FREESHIP",
          startDate: "2023-05-01T00:00:00",
          endDate: "2023-05-31T23:59:59",
          usageLimit: 500,
          usageCount: 500,
          status: "expired",
        },
        {
          id: "PROMO-5678",
          name: "Buy One Get One Free",
          type: "bogo",
          value: 100,
          code: "BOGOFREE",
          startDate: "2023-07-15T00:00:00",
          endDate: "2023-07-30T23:59:59",
          usageLimit: 200,
          usageCount: 87,
          status: "active",
        },
        {
          id: "PROMO-6789",
          name: "Holiday Special",
          type: "fixed",
          value: 25,
          code: "HOLIDAY25",
          startDate: "2023-12-15T00:00:00",
          endDate: "2023-12-25T23:59:59",
          usageLimit: 0,
          usageCount: 0,
          status: "scheduled",
        },
        {
          id: "PROMO-7890",
          name: "Flash Sale",
          type: "percentage",
          value: 40,
          code: "FLASH40",
          startDate: "2023-04-15T00:00:00",
          endDate: "2023-04-16T23:59:59",
          usageLimit: 300,
          usageCount: 278,
          status: "expired",
        },
        {
          id: "PROMO-8901",
          name: "Clearance Sale",
          type: "percentage",
          value: 50,
          code: "",
          startDate: "",
          endDate: "",
          usageLimit: 0,
          usageCount: 0,
          status: "draft",
        },
      ]
      setPromotions(data)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (filterStatus) {
      setFilteredPromotions(promotions.filter((promo) => promo.status === filterStatus))
    } else {
      setFilteredPromotions(promotions)
    }
  }, [promotions, filterStatus])

  const getStatusBadge = (status: Promotion["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">Active</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400">Scheduled</Badge>
      case "expired":
        return <Badge className="bg-gray-500/20 text-gray-600 dark:text-gray-400">Expired</Badge>
      case "draft":
        return <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">Draft</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const formatValue = (type: Promotion["type"], value: number) => {
    switch (type) {
      case "percentage":
        return `${value}%`
      case "fixed":
        return `Ksh ${value.toFixed(2)}`
      case "bogo":
        return `Buy One Get One ${value === 100 ? "Free" : `${value}% Off`}`
      case "free-shipping":
        return "Free Shipping"
      default:
        return value
    }
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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No promotions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id} className="group">
                    <TableCell className="font-medium">{promotion.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {formatValue(promotion.type, promotion.value)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {promotion.code ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <code className="rounded bg-muted px-1 py-0.5 text-xs">{promotion.code}</code>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <Copy className="h-3 w-3" />
                                  <span className="sr-only">Copy code</span>
                                </Button>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {promotion.startDate && promotion.endDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {promotion.usageCount}/{promotion.usageLimit || "∞"}
                    </TableCell>
                    <TableCell>{getStatusBadge(promotion.status)}</TableCell>
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
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart className="mr-2 h-4 w-4" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
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
