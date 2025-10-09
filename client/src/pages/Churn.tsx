import { Input } from "@/components/ui/input";
import { Search, DollarSign, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Customer, SOFTWARE_TYPES } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Churn() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState<string>("all");

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Filter by software first, then by churn status
  const softwareFilteredCustomers = selectedSoftware === "all" 
    ? customers 
    : customers.filter(c => c.software === selectedSoftware);

  const churnedCustomers = softwareFilteredCustomers.filter((customer) => customer.churn);

  const filteredCustomers = churnedCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.churnReason && customer.churnReason.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Churned Customers</h1>
          <p className="text-muted-foreground mt-1">Track and analyze customer churn</p>
        </div>
        <Badge variant="destructive" className="text-base px-4 py-2" data-testid="badge-churn-count">
          {churnedCustomers.length} Churned
        </Badge>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="churn-software-filter" className="text-sm whitespace-nowrap">Filter by Software:</Label>
          <Select value={selectedSoftware} onValueChange={setSelectedSoftware}>
            <SelectTrigger id="churn-software-filter" className="w-[280px]" data-testid="select-churn-software-filter">
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search churned customers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-churn"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading customers...</div>
      ) : filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "No churned customers found matching your search." : churnedCustomers.length === 0 ? "No churned customers yet." : "No results found."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} data-testid={`card-churn-customer-${customer.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl" data-testid={`text-churn-customer-name-${customer.id}`}>
                      {customer.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground" data-testid={`text-churn-customer-company-${customer.id}`}>
                      {customer.company}
                    </p>
                  </div>
                  {customer.renewalAmount && (
                    <div className="flex items-center gap-1.5 text-lg font-semibold">
                      <DollarSign className="h-5 w-5" />
                      <span data-testid={`text-churn-renewal-amount-${customer.id}`}>
                        {parseFloat(customer.renewalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Churn Reason</p>
                      <p className="mt-1" data-testid={`text-churn-reason-${customer.id}`}>
                        {customer.churnReason || "No reason provided"}
                      </p>
                    </div>
                  </div>
                  {customer.email && (
                    <div className="text-sm text-muted-foreground" data-testid={`text-churn-customer-email-${customer.id}`}>
                      {customer.email}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
