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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export function AddSubscriptionDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    renewalDate: "",
    value: "",
    billingCycle: "monthly",
    status: "healthy",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscription added:", formData);
    setOpen(false);
    setFormData({ productName: "", renewalDate: "", value: "", billingCycle: "monthly", status: "healthy" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-subscription">
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-add-subscription">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="Enterprise Plan"
              required
              data-testid="input-product-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renewalDate">Renewal Date</Label>
            <Input
              id="renewalDate"
              type="date"
              value={formData.renewalDate}
              onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
              required
              data-testid="input-renewal-date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Contract Value</Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="50000"
              required
              data-testid="input-contract-value"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingCycle">Billing Cycle</Label>
            <Select
              value={formData.billingCycle}
              onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}
            >
              <SelectTrigger data-testid="select-billing-cycle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit-subscription">Add Subscription</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
