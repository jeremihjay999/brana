import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomersTable } from "@/components/admin/customers-table"
import { CustomerStats } from "@/components/admin/customer-stats"
import { Plus, FileDown, FileUp, Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="mt-1 text-muted-foreground">Manage your customer accounts and view purchase history</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2 bg-primary/90 hover:bg-primary">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
          <Button variant="outline" className="gap-2">
            <FileUp className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <CustomerStats />

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>View and manage your customer accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="all">All Customers</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search customers..." className="pl-9 sm:w-[250px]" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <CustomersTable />
            </TabsContent>
            <TabsContent value="active" className="m-0">
              <CustomersTable filterStatus="active" />
            </TabsContent>
            <TabsContent value="inactive" className="m-0">
              <CustomersTable filterStatus="inactive" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
