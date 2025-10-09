import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Mail, Building2, Pencil, Trash2, Eye } from "lucide-react";
import { EditCustomerDialog } from "./EditCustomerDialog";
import { ViewCustomerDialog } from "./ViewCustomerDialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Customer } from "@shared/schema";

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const { toast } = useToast();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/customers/${customer.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
      setDeleteOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <Card className="hover-elevate" data-testid={`card-customer-${customer.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{customer.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Building2 className="h-3 w-3" />
                  {customer.company}
                </p>
              </div>
            </div>
            <StatusBadge status={customer.status as "active" | "inactive"} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {customer.email}
          </div>
          {customer.accountManager && (
            <div className="text-sm">
              <span className="text-muted-foreground">Manager: </span>
              <span className="font-medium">{customer.accountManager}</span>
            </div>
          )}
          <div className="flex gap-2 pt-2 border-t">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setViewOpen(true)}
              data-testid={`button-view-customer-${customer.id}`}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setEditOpen(true)}
              data-testid={`button-edit-customer-${customer.id}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="text-destructive hover:bg-destructive/10" 
              onClick={() => setDeleteOpen(true)}
              data-testid={`button-delete-customer-${customer.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <ViewCustomerDialog 
        customer={customer}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <EditCustomerDialog 
        customer={customer}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the customer "{customer.name}" and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
