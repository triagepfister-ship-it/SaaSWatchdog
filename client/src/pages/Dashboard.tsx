import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { TrendingUp, Users, DollarSign, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Customer, SOFTWARE_TYPES } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const [selectedSoftware, setSelectedSoftware] = useState<string>("all");
  
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Filter customers by selected software
  const filteredCustomers = selectedSoftware === "all" 
    ? customers 
    : customers.filter(c => c.software === selectedSoftware);

  const activeCustomers = filteredCustomers.filter(c => c.status === "active").length;
  const totalCustomers = filteredCustomers.length;
  
  const totalRevenue = filteredCustomers.reduce((sum, customer) => {
    const amount = customer.renewalAmount ? parseFloat(customer.renewalAmount) : 0;
    return sum + amount;
  }, 0);
  
  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalRevenue);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track renewals and manage customer relationships</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="software-filter" className="text-sm">Filter by Software:</Label>
            <Select value={selectedSoftware} onValueChange={setSelectedSoftware}>
              <SelectTrigger id="software-filter" className="w-[280px]" data-testid="select-software-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Software</SelectItem>
                {SOFTWARE_TYPES.map((software) => (
                  <SelectItem key={software} value={software}>
                    {software}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AddCustomerDialog selectedSoftware={selectedSoftware} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={totalCustomers.toString()}
          change={`${activeCustomers} active`}
          icon={Users}
        />
        <StatCard
          title="Active Customers"
          value={activeCustomers.toString()}
          change={`${Math.round((activeCustomers / totalCustomers) * 100) || 0}% of total`}
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="Upcoming Renewals"
          value="0"
          change="Next 30 days"
          icon={RefreshCw}
        />
        <StatCard
          title="Total Revenue"
          value={formattedRevenue}
          change="All subscriptions"
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {selectedSoftware === "all" 
                    ? "No customers yet. Add your first customer to get started."
                    : `No customers found for ${selectedSoftware}.`
                  }
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCustomers.slice(0, 5).map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 rounded-md border">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.company}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Get started by adding customers and their subscription information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
