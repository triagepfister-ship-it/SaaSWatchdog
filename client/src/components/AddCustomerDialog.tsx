import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCustomerSchema, SOFTWARE_TYPES } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddCustomerDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    software: "",
    accountManager: "",
    opportunityName: "",
    renewalAmount: "",
    responsibleSalesperson: "",
    churn: false,
    churnReason: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const validatedData = insertCustomerSchema.parse(data);
      const res = await apiRequest("POST", "/api/customers", validatedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Success",
        description: "Customer created successfully",
      });
      setOpen(false);
      setFormData({ name: "", email: "", company: "", software: "", accountManager: "", opportunityName: "", renewalAmount: "", responsibleSalesperson: "", churn: false, churnReason: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-customer">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-add-customer">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
              data-testid="input-customer-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
              data-testid="input-customer-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Acme Corp"
              required
              data-testid="input-customer-company"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="software">Software</Label>
            <Select
              value={formData.software}
              onValueChange={(value) => setFormData({ ...formData, software: value })}
              required
            >
              <SelectTrigger id="software" data-testid="select-software">
                <SelectValue placeholder="Select software" />
              </SelectTrigger>
              <SelectContent>
                {SOFTWARE_TYPES.map((software) => (
                  <SelectItem key={software} value={software}>
                    {software}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountManager">Account Manager</Label>
            <Input
              id="accountManager"
              value={formData.accountManager}
              onChange={(e) => setFormData({ ...formData, accountManager: e.target.value })}
              placeholder="Sarah Johnson"
              data-testid="input-account-manager"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="opportunityName">Opportunity Name</Label>
            <Input
              id="opportunityName"
              value={formData.opportunityName}
              onChange={(e) => setFormData({ ...formData, opportunityName: e.target.value })}
              placeholder="Q1 2024 Expansion"
              data-testid="input-opportunity-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renewalAmount">Renewal Amount ($)</Label>
            <Input
              id="renewalAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.renewalAmount}
              onChange={(e) => setFormData({ ...formData, renewalAmount: e.target.value })}
              placeholder="10000.00"
              data-testid="input-renewal-amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsibleSalesperson">Responsible Salesperson</Label>
            <Input
              id="responsibleSalesperson"
              type="email"
              value={formData.responsibleSalesperson}
              onChange={(e) => setFormData({ ...formData, responsibleSalesperson: e.target.value })}
              placeholder="salesperson@example.com"
              data-testid="input-responsible-salesperson"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="churn"
              checked={formData.churn}
              onCheckedChange={(checked) => setFormData({ ...formData, churn: checked as boolean, churnReason: checked ? formData.churnReason : "" })}
              data-testid="checkbox-churn"
            />
            <Label htmlFor="churn" className="cursor-pointer">
              Churn
            </Label>
          </div>
          {formData.churn && (
            <div className="space-y-2">
              <Label htmlFor="churnReason">Churn Reason</Label>
              <Input
                id="churnReason"
                value={formData.churnReason}
                onChange={(e) => setFormData({ ...formData, churnReason: e.target.value })}
                placeholder="Enter reason for churn"
                required
                data-testid="input-churn-reason"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-customer">
              {createMutation.isPending ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
