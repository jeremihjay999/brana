"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SalesByCategoryProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SalesByCategory({ className, ...props }: SalesByCategoryProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch("/api/orders").then(res => res.json()),
      fetch("/api/products").then(res => res.json()),
    ]).then(([orders, products]) => {
      const now = new Date()
      const month = now.getMonth()
      const year = now.getFullYear()
      const categoryMap: Record<string, number> = {}
      ;(Array.isArray(orders) ? orders : []).forEach((order: any) => {
        (order.products || []).forEach((p: any) => {
          const createdAt = new Date(p.createdAt || order.createdAt || now)
          if (createdAt.getMonth() === month && createdAt.getFullYear() === year) {
            const prod = (Array.isArray(products) ? products : []).find((pr: any) => pr.name === p.name)
            const category = prod?.category || "Other"
            if (!categoryMap[category]) categoryMap[category] = 0
            categoryMap[category] += parseInt(p.quantity) || 1
          }
        })
      })
      // Assign colors
      const colors = [
        "hsl(var(--primary))",
        "hsl(217, 91%, 60%)",
        "hsl(276, 91%, 60%)",
        "hsl(346, 91%, 60%)",
        "hsl(var(--muted-foreground))",
      ]
      const categoryArr = Object.entries(categoryMap)
        .map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }))
        .sort((a, b) => b.value - a.value)
      setData(categoryArr)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Calculate total for percentages
  const total = data.reduce((acc, item) => acc + item.value, 0)

  return (
    <Card className={cn("col-span-3", className)} {...props}>
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
        <CardDescription>Distribution of sales across product categories</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex h-[200px] items-center justify-center">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <g transform="translate(100, 100)">
                  {data.map((item, i) => {
                    // Calculate each slice
                    const startAngle = data.slice(0, i).reduce((acc, curr) => acc + (curr.value / total) * 360, 0)
                    const endAngle = startAngle + (item.value / total) * 360

                    // Convert to radians
                    const startRad = (startAngle * Math.PI) / 180
                    const endRad = (endAngle * Math.PI) / 180

                    // Calculate path
                    const x1 = Math.sin(startRad) * 80
                    const y1 = -Math.cos(startRad) * 80
                    const x2 = Math.sin(endRad) * 80
                    const y2 = -Math.cos(endRad) * 80

                    // Determine if the slice is more than 180 degrees
                    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

                    // Create path
                    const pathData = `M 0 0 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

                    return <path key={i} d={pathData} fill={item.color} />
                  })}
                  <circle cx="0" cy="0" r="60" fill="hsl(var(--card))" />
                </g>
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div className="flex flex-1 items-center justify-between">
                    <p className="text-sm">{item.name}</p>
                    <p className="text-sm font-medium">{Math.round((item.value / total) * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
