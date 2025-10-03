"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface RevenueChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RevenueChart({ className, ...props }: RevenueChartProps) {
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/orders")
      .then(res => res.json())
      .then(orders => {
        const now = new Date()
        const year = now.getFullYear()
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]
        const monthlyTotals = Array(12).fill(0)
        ;(Array.isArray(orders) ? orders : []).forEach((order: any) => {
          (order.products || []).forEach((p: any) => {
            const createdAt = new Date(p.createdAt || order.createdAt || now)
            if (createdAt.getFullYear() === year) {
              const m = createdAt.getMonth()
              monthlyTotals[m] += parseFloat(p.price) * (parseInt(p.quantity) || 1)
            }
          })
        })
        setChartData(months.map((name, i) => ({ name, total: monthlyTotals[i] })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Find the maximum value for scaling
  const maxTotal = Math.max(...chartData.map((item) => item.total))

  return (
    <Card className={cn("col-span-4", className)} {...props}>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue for the current year</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="bar" className="space-y-4">
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="h-[300px]">
                <div className="flex h-full items-end gap-2">
                  {chartData.map((item) => (
                    <div key={item.name} className="relative flex h-full flex-1 flex-col justify-end">
                      <div
                        className="w-full bg-primary/90 transition-all hover:bg-primary"
                        style={{ height: `${(item.total / maxTotal) * 100}%` }}
                      ></div>
                      <span className="mt-2 text-center text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="line" className="space-y-4">
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="h-[300px]">
                <svg width="100%" height="100%" viewBox="0 0 1200 300" preserveAspectRatio="none">
                  <path
                    d={`M0,${300 - (chartData[0]?.total / maxTotal) * 300} ${chartData
                      .map(
                        (item, i) => `L${(i * 1200) / (chartData.length - 1)},${300 - (item.total / maxTotal) * 300}`,
                      )
                      .join(" ")}`}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                  />
                  {chartData.map((item, i) => (
                    <circle
                      key={i}
                      cx={(i * 1200) / (chartData.length - 1)}
                      cy={300 - (item.total / maxTotal) * 300}
                      r="4"
                      fill="hsl(var(--primary))"
                    />
                  ))}
                </svg>
                <div className="mt-2 flex justify-between">
                  {chartData.map((item) => (
                    <span key={item.name} className="text-xs text-muted-foreground">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
