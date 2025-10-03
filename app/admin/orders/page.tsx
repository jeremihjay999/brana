import { OrdersTable } from "@/components/admin/orders-table"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </div>
      </div>
      <OrdersTable />
    </div>
  )
}
