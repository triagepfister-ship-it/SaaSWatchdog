import { StatCard } from "@/components/StatCard";
import { RenewalTable } from "@/components/RenewalTable";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { AddSubscriptionDialog } from "@/components/AddSubscriptionDialog";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";

//todo: remove mock functionality
const mockRenewals = [
  { id: "1", customer: "Acme Corp", product: "Enterprise Plan", renewalDate: "2025-11-15", value: "$50,000", status: "healthy" as const, daysUntilRenewal: 37 },
  { id: "2", customer: "TechStart Inc", product: "Pro Plan", renewalDate: "2025-10-22", value: "$25,000", status: "at-risk" as const, daysUntilRenewal: 13 },
  { id: "3", customer: "Global Solutions", product: "Enterprise Plan", renewalDate: "2025-10-18", value: "$75,000", status: "at-risk" as const, daysUntilRenewal: 9 },
  { id: "4", customer: "StartupXYZ", product: "Basic Plan", renewalDate: "2025-11-01", value: "$12,000", status: "healthy" as const, daysUntilRenewal: 23 },
  { id: "5", customer: "MegaCorp Ltd", product: "Enterprise Plan", renewalDate: "2025-09-30", value: "$100,000", status: "churned" as const, daysUntilRenewal: -9 },
];

//todo: remove mock functionality
const escalationQueue = [
  { id: "1", customer: "TechStart Inc", reason: "No response to renewal emails", priority: "high" },
  { id: "2", customer: "Global Solutions", reason: "Exploring competitor options", priority: "critical" },
  { id: "3", customer: "Innovation Labs", reason: "Budget concerns raised", priority: "medium" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track renewals and manage customer relationships</p>
        </div>
        <div className="flex gap-2">
          <AddCustomerDialog />
          <AddSubscriptionDialog />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Renewal Rate"
          value="94.2%"
          change="+2.1% from last month"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="At-Risk Revenue"
          value="$150K"
          change="+$25K from last week"
          icon={AlertTriangle}
          trend="down"
        />
        <StatCard
          title="Upcoming Renewals"
          value="12"
          change="Next 30 days"
          icon={RefreshCw}
        />
        <StatCard
          title="Churn Rate"
          value="5.8%"
          change="-1.2% from last month"
          icon={TrendingDown}
          trend="up"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Renewals</h2>
          </div>
          <RenewalTable renewals={mockRenewals} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Escalation Queue</h2>
          <Card data-testid="card-escalation-queue">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Priority Actions Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {escalationQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-md border hover-elevate"
                  data-testid={`escalation-${item.id}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-medium text-sm">{item.customer}</span>
                    <StatusBadge
                      status={item.priority === "critical" ? "churned" : item.priority === "high" ? "at-risk" : "healthy"}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
