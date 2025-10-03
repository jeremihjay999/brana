import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { SalesByCategory } from "@/components/admin/sales-by-category"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { TopProducts } from "@/components/admin/top-products"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <DashboardStats />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart className="md:col-span-2 lg:col-span-4" />
        <SalesByCategory className="md:col-span-2 lg:col-span-3" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <RecentOrders className="md:col-span-2 xl:col-span-2" />
        <TopProducts className="xl:col-span-1" />
      </div>
    </div>
  )
}
