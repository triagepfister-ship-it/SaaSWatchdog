import { useState, useEffect } from "react";
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

interface AddCustomerDialogProps {
  selectedSoftware?: string;
}

export function AddCustomerDialog({ selectedSoftware = "" }: AddCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    software: selectedSoftware !== "all" ? selectedSoftware : "",
    site: "",
    opportunityName: "",
    renewalAmount: "",
    renewalExpirationDate: "",
    responsibleSalesperson: "",
    churn: false,
    churnReason: "",
  });

  // Update software when selectedSoftware prop changes and dialog opens
  useEffect(() => {
    if (open && selectedSoftware && selectedSoftware !== "all") {
      setFormData(prev => ({ ...prev, software: selectedSoftware }));
    }
  }, [open, selectedSoftware]);

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
      setFormData({ name: "", email: "", company: "", software: selectedSoftware !== "all" ? selectedSoftware : "", site: "", opportunityName: "", renewalAmount: "", renewalExpirationDate: "", responsibleSalesperson: "", churn: false, churnReason: "" });
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

  const isAllSoftwareSelected = selectedSoftware === "all" || !selectedSoftware;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          data-testid="button-add-customer"
          disabled={isAllSoftwareSelected}
          title={isAllSoftwareSelected ? "Please select a specific software type to add customers" : undefined}
        >
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
            <Label htmlFor="email">Customer Email</Label>
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
            <Input
              id="software"
              value={formData.software}
              readOnly
              className="bg-muted"
              data-testid="input-software"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Input
              id="site"
              value={formData.site}
              onChange={(e) => setFormData({ ...formData, site: e.target.value })}
              placeholder="Enter site location"
              data-testid="input-site"
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
            <Label htmlFor="renewalExpirationDate">Renewal Expiration Date</Label>
            <Input
              id="renewalExpirationDate"
              type="date"
              value={formData.renewalExpirationDate}
              onChange={(e) => setFormData({ ...formData, renewalExpirationDate: e.target.value })}
              data-testid="input-renewal-expiration-date"
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
