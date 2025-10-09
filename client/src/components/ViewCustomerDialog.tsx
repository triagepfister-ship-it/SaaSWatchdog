import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Customer } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "./StatusBadge";
import { Mail, Building2, User, Briefcase } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ViewCustomerDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewCustomerDialog({ customer, open, onOpenChange }: ViewCustomerDialogProps) {
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-view-customer" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">{customer.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={customer.status as "active" | "inactive"} />
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="font-medium">Email</span>
              </div>
              <p className="text-base" data-testid="text-customer-email">{customer.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">Company</span>
              </div>
              <p className="text-base" data-testid="text-customer-company">{customer.company}</p>
            </div>

            {customer.accountManager && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Account Manager</span>
                </div>
                <p className="text-base" data-testid="text-account-manager">{customer.accountManager}</p>
              </div>
            )}

            {customer.opportunityName && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span className="font-medium">Opportunity Name</span>
                </div>
                <p className="text-base" data-testid="text-opportunity-name">{customer.opportunityName}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
