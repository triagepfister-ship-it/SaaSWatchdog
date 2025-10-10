import { CustomerCard } from "@/components/CustomerCard";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Customer, SOFTWARE_TYPES } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState<string>("all");

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Filter by software first, then by search query
  const softwareFilteredCustomers = selectedSoftware === "all" 
    ? customers 
    : customers.filter(c => c.software === selectedSoftware);

  const filteredCustomers = softwareFilteredCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold">Customers</h1>
          </div>
          <AddCustomerDialog selectedSoftware={selectedSoftware} />
        </div>
        <p className="text-muted-foreground mt-1">Manage your customer relationships</p>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="customers-software-filter" className="text-sm whitespace-nowrap">Filter by Software:</Label>
          <Select value={selectedSoftware} onValueChange={setSelectedSoftware}>
            <SelectTrigger id="customers-software-filter" className="w-[280px]" data-testid="select-customers-software-filter">
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
            placeholder="Search customers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-customers"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading customers...</div>
      ) : filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "No customers found matching your search." : "No customers yet. Add your first customer to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
}
