import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Mail, Building2 } from "lucide-react";

interface CustomerCardProps {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "active" | "inactive";
  totalValue: string;
  subscriptions: number;
}

export function CustomerCard({ id, name, email, company, status, totalValue, subscriptions }: CustomerCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="hover-elevate" data-testid={`card-customer-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Building2 className="h-3 w-3" />
                {company}
              </p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          {email}
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-lg font-semibold font-mono">{totalValue}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Subscriptions</p>
            <p className="text-lg font-semibold font-mono">{subscriptions}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" data-testid={`button-view-customer-${id}`}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
