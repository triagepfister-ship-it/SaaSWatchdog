import { CustomerCard } from "@/components/CustomerCard";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

//todo: remove mock functionality
const mockCustomers = [
  { id: "1", name: "John Doe", email: "john@acmecorp.com", company: "Acme Corp", status: "active" as const, totalValue: "$50,000", subscriptions: 3 },
  { id: "2", name: "Sarah Smith", email: "sarah@techstart.com", company: "TechStart Inc", status: "active" as const, totalValue: "$25,000", subscriptions: 2 },
  { id: "3", name: "Michael Brown", email: "michael@global.com", company: "Global Solutions", status: "active" as const, totalValue: "$75,000", subscriptions: 5 },
  { id: "4", name: "Emily Johnson", email: "emily@startupxyz.com", company: "StartupXYZ", status: "active" as const, totalValue: "$12,000", subscriptions: 1 },
  { id: "5", name: "David Wilson", email: "david@megacorp.com", company: "MegaCorp Ltd", status: "inactive" as const, totalValue: "$100,000", subscriptions: 4 },
  { id: "6", name: "Lisa Anderson", email: "lisa@innovate.com", company: "Innovation Labs", status: "active" as const, totalValue: "$35,000", subscriptions: 2 },
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer relationships</p>
        </div>
        <AddCustomerDialog />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-customers"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id} {...customer} />
        ))}
      </div>
    </div>
  );
}
