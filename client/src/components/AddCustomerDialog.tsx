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
import { Plus, Upload, X } from "lucide-react";
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
    email: "",
    company: "",
    software: selectedSoftware !== "all" ? selectedSoftware : "",
    site: "",
    opportunityName: "",
    renewalAmount: "",
    renewalExpirationDate: "",
    responsibleSalesperson: "",
    pilotCustomer: false,
    churn: false,
    churnReason: "",
    attachmentData: undefined as string | undefined,
    attachmentFilename: undefined as string | undefined,
    attachmentMimeType: undefined as string | undefined,
    attachmentSize: undefined as number | undefined,
  });

  // Update software when selectedSoftware prop changes and dialog opens
  useEffect(() => {
    if (open && selectedSoftware && selectedSoftware !== "all") {
      setFormData(prev => ({ ...prev, software: selectedSoftware }));
    }
  }, [open, selectedSoftware]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData({
        ...formData,
        attachmentData: undefined,
        attachmentFilename: undefined,
        attachmentMimeType: undefined,
        attachmentSize: undefined,
      });
      return;
    }

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

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const validatedData = insertCustomerSchema.parse({ ...data, name: data.company });
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
      setFormData({ email: "", company: "", software: selectedSoftware !== "all" ? selectedSoftware : "", site: "", opportunityName: "", renewalAmount: "", renewalExpirationDate: "", responsibleSalesperson: "", pilotCustomer: false, churn: false, churnReason: "", attachmentData: undefined, attachmentFilename: undefined, attachmentMimeType: undefined, attachmentSize: undefined });
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
      <DialogContent className="max-w-3xl" data-testid="dialog-add-customer">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pilotCustomer"
              checked={formData.pilotCustomer}
              onCheckedChange={(checked) => setFormData({ ...formData, pilotCustomer: checked as boolean })}
              data-testid="checkbox-pilot-customer"
            />
            <Label htmlFor="pilotCustomer" className="cursor-pointer">
              Pilot Customer
            </Label>
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
          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (Optional)</Label>
            {formData.attachmentFilename ? (
              <div className="flex items-center gap-2 p-2 border rounded-md" data-testid="attachment-preview">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">{formData.attachmentFilename}</span>
                <span className="text-xs text-muted-foreground">
                  {formData.attachmentSize ? `${(formData.attachmentSize / 1024).toFixed(2)} KB` : ""}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeAttachment}
                  data-testid="button-remove-attachment"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Input
                id="attachment"
                type="file"
                onChange={handleFileChange}
                data-testid="input-attachment"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
              />
            )}
          </div>
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
