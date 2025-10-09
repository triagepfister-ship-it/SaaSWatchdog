import { StatCard } from "@/components/StatCard";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { TrendingUp, Users, DollarSign, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@shared/schema";

export default function Dashboard() {
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const activeCustomers = customers.filter(c => c.status === "active").length;
  const totalCustomers = customers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track renewals and manage customer relationships</p>
        </div>
        <AddCustomerDialog />
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
          value="$0"
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
              {customers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No customers yet. Add your first customer to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {customers.slice(0, 5).map((customer) => (
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
