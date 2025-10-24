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
import { Upload, Download, X } from "lucide-react";
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
    email: customer.email,
    company: customer.company,
    software: customer.software,
    site: customer.site || "",
    opportunityName: customer.opportunityName || "",
    renewalAmount: customer.renewalAmount || "",
    renewalExpirationDate: customer.renewalExpirationDate ? new Date(customer.renewalExpirationDate).toISOString().split('T')[0] : "",
    responsibleSalesperson: customer.responsibleSalesperson || "",
    pilotCustomer: customer.pilotCustomer,
    churn: customer.churn,
    churnReason: customer.churnReason || "",
    attachmentData: customer.attachmentData || undefined,
    attachmentFilename: customer.attachmentFilename || undefined,
    attachmentMimeType: customer.attachmentMimeType || undefined,
    attachmentSize: customer.attachmentSize || undefined,
  });

  useEffect(() => {
    setFormData({
      email: customer.email,
      company: customer.company,
      software: customer.software,
      site: customer.site || "",
      opportunityName: customer.opportunityName || "",
      renewalAmount: customer.renewalAmount || "",
      renewalExpirationDate: customer.renewalExpirationDate ? new Date(customer.renewalExpirationDate).toISOString().split('T')[0] : "",
      responsibleSalesperson: customer.responsibleSalesperson || "",
      pilotCustomer: customer.pilotCustomer,
      churn: customer.churn,
      churnReason: customer.churnReason || "",
      attachmentData: customer.attachmentData || undefined,
      attachmentFilename: customer.attachmentFilename || undefined,
      attachmentMimeType: customer.attachmentMimeType || undefined,
      attachmentSize: customer.attachmentSize || undefined,
    });
  }, [customer]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({
        ...formData,
        attachmentData: base64String,
        attachmentFilename: file.name,
        attachmentMimeType: file.type,
        attachmentSize: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setFormData({
      ...formData,
      attachmentData: undefined,
      attachmentFilename: undefined,
      attachmentMimeType: undefined,
      attachmentSize: undefined,
    });
  };

  const downloadAttachment = () => {
    if (!formData.attachmentData || !formData.attachmentFilename) return;

    const link = document.createElement('a');
    link.href = formData.attachmentData;
    link.download = formData.attachmentFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PATCH", `/api/customers/${customer.id}`, { ...data, name: data.company });
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-opportunityName">Opportunity Name</Label>
              <Input
                id="edit-opportunityName"
                value={formData.opportunityName}
                onChange={(e) => setFormData({ ...formData, opportunityName: e.target.value })}
                data-testid="input-edit-opportunity-name"
              />
            </div>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-pilotCustomer"
              checked={formData.pilotCustomer}
              onCheckedChange={(checked) => setFormData({ ...formData, pilotCustomer: checked as boolean })}
              data-testid="checkbox-edit-pilot-customer"
            />
            <Label htmlFor="edit-pilotCustomer" className="cursor-pointer">
              Pilot Customer
            </Label>
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
          <div className="space-y-2">
            <Label htmlFor="edit-attachment">Attachment (Optional)</Label>
            {formData.attachmentFilename ? (
              <div className="flex items-center gap-2 p-2 border rounded-md" data-testid="edit-attachment-preview">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">{formData.attachmentFilename}</span>
                <span className="text-xs text-muted-foreground">
                  {formData.attachmentSize ? `${(formData.attachmentSize / 1024).toFixed(2)} KB` : ""}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={downloadAttachment}
                  title="Download attachment"
                  data-testid="button-download-attachment"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeAttachment}
                  title="Remove attachment"
                  data-testid="button-remove-edit-attachment"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Input
                id="edit-attachment"
                type="file"
                onChange={handleFileChange}
                data-testid="input-edit-attachment"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
              />
            )}
          </div>
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
