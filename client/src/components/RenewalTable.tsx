import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { MoreVertical, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Renewal {
  id: string;
  customer: string;
  product: string;
  renewalDate: string;
  value: string;
  status: "healthy" | "at-risk" | "churned";
  daysUntilRenewal: number;
}

interface RenewalTableProps {
  renewals: Renewal[];
}

export function RenewalTable({ renewals }: RenewalTableProps) {
  return (
    <div className="rounded-md border" data-testid="table-renewals">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Renewal Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Days Left</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {renewals.map((renewal, index) => (
            <tr
              key={renewal.id}
              className={`border-b last:border-0 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
              data-testid={`row-renewal-${renewal.id}`}
            >
              <td className="px-4 py-3 text-sm font-medium">{renewal.customer}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{renewal.product}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{renewal.renewalDate}</td>
              <td className="px-4 py-3 text-sm font-mono font-medium">{renewal.value}</td>
              <td className="px-4 py-3">
                <StatusBadge status={renewal.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {renewal.daysUntilRenewal <= 14 && (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium">{renewal.daysUntilRenewal} days</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid={`button-actions-${renewal.id}`}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Escalate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Mark as Churned</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
