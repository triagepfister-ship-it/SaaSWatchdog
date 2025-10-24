import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { SOFTWARE_TYPES } from "@shared/schema";
import { MessageSquarePlus } from "lucide-react";

interface CreateFeedbackDialogProps {
  customerName?: string;
  software?: string;
  trigger?: React.ReactNode;
}

export function CreateFeedbackDialog({ customerName = "", software = "", trigger }: CreateFeedbackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    customerName: customerName,
    software: software,
    feedbackText: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/feedback", data);
      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      setIsOpen(false);
      setFormData({ customerName: customerName, software: software, feedbackText: "" });
      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.software) {
      toast({
        title: "Validation Error",
        description: "Please select a software type",
        variant: "destructive",
      });
      return;
    }
    
    createMutation.mutate({
      customerName: formData.customerName,
      software: formData.software,
      feedbackText: formData.feedbackText,
      phase: "Analyze",
      submittedBy: user?.username || "Unknown",
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setFormData({
        customerName: customerName,
        software: software,
        feedbackText: "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" data-testid="button-create-feedback">
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-testid="dialog-create-feedback">
        <DialogHeader>
          <DialogTitle>Submit Customer Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Enter customer name"
              required
              data-testid="input-customer-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="software">Software</Label>
            <Select
              value={formData.software}
              onValueChange={(value) => {
                setFormData({ ...formData, software: value });
              }}
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
            <Label htmlFor="feedbackText">Feedback</Label>
            <Textarea
              id="feedbackText"
              value={formData.feedbackText}
              onChange={(e) => setFormData({ ...formData, feedbackText: e.target.value })}
              placeholder="Describe the customer feedback or experience"
              rows={6}
              required
              data-testid="input-feedback-text"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={createMutation.isPending}
            data-testid="button-submit-feedback"
          >
            {createMutation.isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
