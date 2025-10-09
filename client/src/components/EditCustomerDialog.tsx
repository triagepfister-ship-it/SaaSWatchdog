import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Customer, SOFTWARE_TYPES } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditCustomerDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCustomerDialog({ customer, open, onOpenChange }: EditCustomerDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    company: customer.company,
    software: customer.software,
    site: customer.site || "",
    opportunityName: customer.opportunityName || "",
    renewalAmount: customer.renewalAmount || "",
    renewalExpirationDate: customer.renewalExpirationDate ? new Date(customer.renewalExpirationDate).toISOString().split('T')[0] : "",
    responsibleSalesperson: customer.responsibleSalesperson || "",
    churn: customer.churn,
    churnReason: customer.churnReason || "",
  });

  useEffect(() => {
    setFormData({
      name: customer.name,
      email: customer.email,
      company: customer.company,
      software: customer.software,
      site: customer.site || "",
      opportunityName: customer.opportunityName || "",
      renewalAmount: customer.renewalAmount || "",
      renewalExpirationDate: customer.renewalExpirationDate ? new Date(customer.renewalExpirationDate).toISOString().split('T')[0] : "",
      responsibleSalesperson: customer.responsibleSalesperson || "",
      churn: customer.churn,
      churnReason: customer.churnReason || "",
    });
  }, [customer]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PATCH", `/api/customers/${customer.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
      onOpenChange(false);
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
    updateMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" data-testid="dialog-edit-customer">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Customer Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                data-testid="input-edit-customer-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Customer Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="input-edit-customer-email"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                data-testid="input-edit-customer-company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-software">Software</Label>
              <Input
                id="edit-software"
                value={formData.software}
                readOnly
                className="bg-muted"
                data-testid="input-edit-software"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-site">Site</Label>
              <Input
                id="edit-site"
                value={formData.site}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                placeholder="Enter site location"
                data-testid="input-edit-site"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-opportunityName">Opportunity Name</Label>
              <Input
                id="edit-opportunityName"
                value={formData.opportunityName}
                onChange={(e) => setFormData({ ...formData, opportunityName: e.target.value })}
                data-testid="input-edit-opportunity-name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-renewalAmount">Renewal Amount ($)</Label>
              <Input
                id="edit-renewalAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.renewalAmount}
                onChange={(e) => setFormData({ ...formData, renewalAmount: e.target.value })}
                data-testid="input-edit-renewal-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-renewalExpirationDate">Renewal Expiration Date</Label>
              <Input
                id="edit-renewalExpirationDate"
                type="date"
                value={formData.renewalExpirationDate}
                onChange={(e) => setFormData({ ...formData, renewalExpirationDate: e.target.value })}
                data-testid="input-edit-renewal-expiration-date"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-responsibleSalesperson">Responsible Salesperson</Label>
            <Input
              id="edit-responsibleSalesperson"
              type="email"
              value={formData.responsibleSalesperson}
              onChange={(e) => setFormData({ ...formData, responsibleSalesperson: e.target.value })}
              data-testid="input-edit-responsible-salesperson"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-churn"
              checked={formData.churn}
              onCheckedChange={(checked) => setFormData({ ...formData, churn: checked as boolean, churnReason: checked ? formData.churnReason : "" })}
              data-testid="checkbox-edit-churn"
            />
            <Label htmlFor="edit-churn" className="cursor-pointer">
              Churn
            </Label>
          </div>
          {formData.churn && (
            <div className="space-y-2">
              <Label htmlFor="edit-churnReason">Churn Reason</Label>
              <Input
                id="edit-churnReason"
                value={formData.churnReason}
                onChange={(e) => setFormData({ ...formData, churnReason: e.target.value })}
                placeholder="Enter reason for churn"
                required
                data-testid="input-edit-churn-reason"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-edit">
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} data-testid="button-submit-edit-customer">
              {updateMutation.isPending ? "Updating..." : "Update Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
