import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { CreateFeedbackDialog } from "@/components/CreateFeedbackDialog";
import { AlertCircle, Users, DollarSign, RefreshCw, Flag, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Customer, SOFTWARE_TYPES } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Dashboard() {
  const [selectedSoftware, setSelectedSoftware] = useState<string>("all");
  
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Filter customers by selected software
  const filteredCustomers = selectedSoftware === "all" 
    ? customers 
    : customers.filter(c => c.software === selectedSoftware);

  const totalCustomers = filteredCustomers.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiredRenewals = filteredCustomers.filter(c => {
    if (!c.renewalExpirationDate) return false;
    const expirationDate = new Date(c.renewalExpirationDate);
    expirationDate.setHours(0, 0, 0, 0);
    return expirationDate < today;
  }).length;
  
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const sixtyDaysFromNow = new Date(today);
  sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
  
  const ninetyDaysFromNow = new Date(today);
  ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
  
  // Renewals in next 0-30 days
  const upcomingRenewals30 = filteredCustomers.filter(c => {
    if (!c.renewalExpirationDate) return false;
    const expirationDate = new Date(c.renewalExpirationDate);
    expirationDate.setHours(0, 0, 0, 0);
    return expirationDate >= today && expirationDate <= thirtyDaysFromNow;
  }).length;
  
  // Renewals in 31-60 days (not cumulative)
  const upcomingRenewals60 = filteredCustomers.filter(c => {
    if (!c.renewalExpirationDate) return false;
    const expirationDate = new Date(c.renewalExpirationDate);
    expirationDate.setHours(0, 0, 0, 0);
    const thirtyOneDaysFromNow = new Date(today);
    thirtyOneDaysFromNow.setDate(thirtyOneDaysFromNow.getDate() + 31);
    return expirationDate >= thirtyOneDaysFromNow && expirationDate <= sixtyDaysFromNow;
  }).length;
  
  // Renewals in 61-90 days (not cumulative)
  const upcomingRenewals90 = filteredCustomers.filter(c => {
    if (!c.renewalExpirationDate) return false;
    const expirationDate = new Date(c.renewalExpirationDate);
    expirationDate.setHours(0, 0, 0, 0);
    const sixtyOneDaysFromNow = new Date(today);
    sixtyOneDaysFromNow.setDate(sixtyOneDaysFromNow.getDate() + 61);
    return expirationDate >= sixtyOneDaysFromNow && expirationDate <= ninetyDaysFromNow;
  }).length;
  
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
          change={`${expiredRenewals} expired`}
          icon={Users}
        />
        <StatCard
          title="Expired Renewals"
          value={expiredRenewals.toString()}
          change={expiredRenewals > 0 ? "Requires attention" : "No expired renewals"}
          icon={AlertCircle}
          trend={expiredRenewals > 0 ? "down" : undefined}
        />
        <StatCard
          title="Upcoming Renewals"
          value={upcomingRenewals30.toString()}
          change={`${upcomingRenewals60} in 60 days • ${upcomingRenewals90} in 90 days`}
          icon={RefreshCw}
        />
        <StatCard
          title="Total Revenue"
          value={formattedRevenue}
          change="All subscriptions"
          icon={DollarSign}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Renewals</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            // Filter customers with future renewal dates and sort by expiration date
            const upcomingCustomers = filteredCustomers
              .filter(c => {
                if (!c.renewalExpirationDate) return false;
                const expirationDate = new Date(c.renewalExpirationDate);
                expirationDate.setHours(0, 0, 0, 0);
                return expirationDate >= today;
              })
              .sort((a, b) => {
                const dateA = new Date(a.renewalExpirationDate!).getTime();
                const dateB = new Date(b.renewalExpirationDate!).getTime();
                return dateA - dateB;
              });
            
            if (upcomingCustomers.length === 0) {
              return (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming renewals found.
                </div>
              );
            }
            
            return (
              <div className="space-y-1.5">
                {upcomingCustomers.map((customer) => {
                  const revenue = customer.renewalAmount ? parseFloat(customer.renewalAmount) : 0;
                  const formattedCustomerRevenue = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(revenue);
                  
                  return (
                    <div 
                      key={customer.id} 
                      className={`flex items-center justify-between gap-3 p-2 rounded-md border ${
                        customer.pilotCustomer ? 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800' : ''
                      }`}
                      data-testid={`recent-customer-${customer.id}`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-sm">{customer.name}</p>
                            {customer.pilotCustomer && (
                              <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs py-0" data-testid={`pilot-badge-${customer.id}`}>
                                <Flag className="w-2.5 h-2.5 mr-0.5" />
                                Pilot
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs py-0" data-testid={`software-badge-${customer.id}`}>
                              {customer.software}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{customer.company}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-medium text-sm" data-testid={`customer-revenue-${customer.id}`}>{formattedCustomerRevenue}</p>
                        <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <p data-testid={`customer-renewal-date-${customer.id}`}>
                            {customer.renewalExpirationDate 
                              ? format(new Date(customer.renewalExpirationDate), "MMM d, yyyy")
                              : "No date set"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <CreateFeedbackDialog 
                          customerName={customer.name}
                          software={customer.software}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
