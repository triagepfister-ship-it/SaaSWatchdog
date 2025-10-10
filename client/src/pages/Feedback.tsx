import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Feedback, FEEDBACK_PHASES, SOFTWARE_TYPES } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export default function FeedbackPage() {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState<string>("all");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: feedbackList = [] } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback"],
  });

  const selectedFeedbackData = feedbackList.find(f => f.id === selectedFeedback);

  const [formData, setFormData] = useState({
    customerName: "",
    appName: "",
    software: "",
    feedbackText: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/feedback", data);
      return await res.json();
    },
    onSuccess: async (newFeedback) => {
      await queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      setIsCreateDialogOpen(false);
      setSelectedFeedback(newFeedback.id);
      setFormData({ customerName: "", appName: "", software: "", feedbackText: "" });
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
    createMutation.mutate({
      customerName: formData.customerName,
      appName: formData.appName,
      software: formData.software,
      feedbackText: formData.feedbackText,
      phase: "Analyze",
      submittedBy: user?.username || "Unknown",
    });
  };

  if (selectedFeedback) {
    if (!selectedFeedbackData) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading feedback...</p>
        </div>
      );
    }
    return <FeedbackDetailView 
      feedback={selectedFeedbackData} 
      onBack={() => setSelectedFeedback(null)} 
    />;
  }

  const filteredFeedback = selectedSoftware === "all" 
    ? feedbackList 
    : feedbackList.filter(f => f.software === selectedSoftware);

  const sortedFeedback = [...filteredFeedback].sort((a, b) => 
    new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Feedback</h1>
          <p className="text-muted-foreground mt-1">Submit and track customer feedback</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedSoftware} onValueChange={setSelectedSoftware}>
            <SelectTrigger className="w-[180px]" data-testid="select-software-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Software</SelectItem>
              {SOFTWARE_TYPES.map((software) => (
                <SelectItem key={software} value={software}>
                  {software}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-submit-feedback">
                <Plus className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </DialogTrigger>
          <DialogContent data-testid="dialog-submit-feedback">
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
                <Label htmlFor="appName">App Name</Label>
                <Input
                  id="appName"
                  value={formData.appName}
                  onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                  placeholder="Enter app name"
                  required
                  data-testid="input-app-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="software">Software</Label>
                <Select
                  value={formData.software}
                  onValueChange={(value) => setFormData({ ...formData, software: value })}
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
                data-testid="button-create-feedback"
              >
                {createMutation.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {sortedFeedback.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              No feedback submissions yet.
              <br />
              Click "Submit Feedback" to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {sortedFeedback.map((feedback) => (
            <Card 
              key={feedback.id} 
              className="hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedFeedback(feedback.id)}
              data-testid={`card-feedback-${feedback.id}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{feedback.customerName}</CardTitle>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(feedback.submittedDate), "MMM d, yyyy")}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">App</p>
                  <p className="text-sm" data-testid={`text-app-${feedback.id}`}>{feedback.appName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Feedback</p>
                  <p className="text-sm line-clamp-3" data-testid={`text-feedback-${feedback.id}`}>
                    {feedback.feedbackText}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phase</p>
                  <p className="text-sm font-medium" data-testid={`text-phase-${feedback.id}`}>
                    {feedback.phase}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackDetailView({ feedback, onBack }: { feedback: Feedback; onBack: () => void }) {
  const [activePhase, setActivePhase] = useState(feedback.phase);
  const { toast } = useToast();
  const { user } = useAuth();

  const [phaseData, setPhaseData] = useState({
    analysis: feedback.analysis || "",
    implementationPlan: feedback.implementationPlan || "",
    implementationNotes: feedback.implementationNotes || "",
    outcome: feedback.outcome || "",
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/feedback/${feedback.id}`, data);
      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({
        title: "Success",
        description: "Feedback updated successfully",
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

  const handlePhaseChange = (newPhase: string) => {
    const currentIndex = FEEDBACK_PHASES.indexOf(activePhase as any);
    const newIndex = FEEDBACK_PHASES.indexOf(newPhase as any);
    
    if (newIndex <= currentIndex) {
      setActivePhase(newPhase);
      return;
    }

    if (activePhase === "Analyze" && newPhase === "Implementation") {
      if (!phaseData.analysis.trim()) {
        toast({
          title: "Analysis Required",
          description: "Please complete the analysis before moving to implementation",
          variant: "destructive",
        });
        return;
      }
      updateMutation.mutate({
        phase: "Implementation",
        analysis: phaseData.analysis,
      });
      setActivePhase("Implementation");
    } else if (activePhase === "Implementation" && newPhase === "Closed") {
      if (!phaseData.implementationPlan.trim()) {
        toast({
          title: "Implementation Plan Required",
          description: "Please complete the implementation plan before closing",
          variant: "destructive",
        });
        return;
      }
      updateMutation.mutate({
        phase: "Closed",
        implementationPlan: phaseData.implementationPlan,
        implementationNotes: phaseData.implementationNotes,
        closedDate: new Date().toISOString(),
        closedBy: user?.username || "Unknown",
      });
      setActivePhase("Closed");
    }
  };

  const handleSavePhaseData = () => {
    const updates: any = {};
    
    if (activePhase === "Analyze") {
      updates.analysis = phaseData.analysis;
    } else if (activePhase === "Implementation") {
      updates.implementationPlan = phaseData.implementationPlan;
      updates.implementationNotes = phaseData.implementationNotes;
    } else if (activePhase === "Closed") {
      updates.outcome = phaseData.outcome;
    }

    updateMutation.mutate(updates);
  };

  const currentPhaseIndex = FEEDBACK_PHASES.indexOf(activePhase as any);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">{feedback.customerName}</h1>
          <p className="text-muted-foreground mt-1">
            Submitted on {format(new Date(feedback.submittedDate), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {FEEDBACK_PHASES.map((phase, index) => {
          const isActive = phase === activePhase;
          const isCompleted = index < currentPhaseIndex;
          const isClickable = index <= currentPhaseIndex + 1;

          return (
            <Button
              key={phase}
              variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
              onClick={() => isClickable && handlePhaseChange(phase)}
              disabled={!isClickable}
              className="whitespace-nowrap"
              data-testid={`button-phase-${phase.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {phase}
            </Button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Customer</Label>
            <p className="font-medium" data-testid="text-customer-name">{feedback.customerName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">App</Label>
            <p className="font-medium" data-testid="text-app-name">{feedback.appName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Feedback</Label>
            <p className="mt-1" data-testid="text-feedback-text">{feedback.feedbackText}</p>
          </div>
        </CardContent>
      </Card>

      {activePhase === "Initiate" && (
        <Card>
          <CardHeader>
            <CardTitle>Initiation Phase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Feedback has been submitted and is ready for analysis.
            </p>
          </CardContent>
        </Card>
      )}

      {activePhase === "Analyze" && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Phase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="analysis">Analysis</Label>
              <Textarea
                id="analysis"
                value={phaseData.analysis}
                onChange={(e) => setPhaseData({ ...phaseData, analysis: e.target.value })}
                placeholder="Document your analysis of the feedback"
                rows={8}
                data-testid="input-analysis"
              />
            </div>
            <Button 
              onClick={handleSavePhaseData}
              disabled={updateMutation.isPending}
              data-testid="button-save-analysis"
            >
              {updateMutation.isPending ? "Saving..." : "Save Analysis"}
            </Button>
          </CardContent>
        </Card>
      )}

      {activePhase === "Implementation" && (
        <Card>
          <CardHeader>
            <CardTitle>Implementation Phase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.analysis && (
              <div>
                <Label className="text-muted-foreground">Analysis</Label>
                <p className="mt-1 whitespace-pre-wrap" data-testid="text-saved-analysis">
                  {feedback.analysis}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="implementationPlan">Implementation Plan</Label>
              <Textarea
                id="implementationPlan"
                value={phaseData.implementationPlan}
                onChange={(e) => setPhaseData({ ...phaseData, implementationPlan: e.target.value })}
                placeholder="Document the implementation plan"
                rows={6}
                data-testid="input-implementation-plan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="implementationNotes">Implementation Notes</Label>
              <Textarea
                id="implementationNotes"
                value={phaseData.implementationNotes}
                onChange={(e) => setPhaseData({ ...phaseData, implementationNotes: e.target.value })}
                placeholder="Add implementation notes and progress updates"
                rows={6}
                data-testid="input-implementation-notes"
              />
            </div>
            <Button 
              onClick={handleSavePhaseData}
              disabled={updateMutation.isPending}
              data-testid="button-save-implementation"
            >
              {updateMutation.isPending ? "Saving..." : "Save Implementation Data"}
            </Button>
          </CardContent>
        </Card>
      )}

      {activePhase === "Closed" && (
        <Card>
          <CardHeader>
            <CardTitle>Closed Phase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.analysis && (
              <div>
                <Label className="text-muted-foreground">Analysis</Label>
                <p className="mt-1 whitespace-pre-wrap" data-testid="text-final-analysis">
                  {feedback.analysis}
                </p>
              </div>
            )}
            {feedback.implementationPlan && (
              <div>
                <Label className="text-muted-foreground">Implementation Plan</Label>
                <p className="mt-1 whitespace-pre-wrap" data-testid="text-final-implementation-plan">
                  {feedback.implementationPlan}
                </p>
              </div>
            )}
            {feedback.implementationNotes && (
              <div>
                <Label className="text-muted-foreground">Implementation Notes</Label>
                <p className="mt-1 whitespace-pre-wrap" data-testid="text-final-implementation-notes">
                  {feedback.implementationNotes}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Textarea
                id="outcome"
                value={phaseData.outcome}
                onChange={(e) => setPhaseData({ ...phaseData, outcome: e.target.value })}
                placeholder="Document the final outcome and resolution"
                rows={6}
                data-testid="input-outcome"
              />
            </div>
            {feedback.closedDate && (
              <div>
                <Label className="text-muted-foreground">Closed Date</Label>
                <p className="mt-1" data-testid="text-closed-date">
                  {format(new Date(feedback.closedDate), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            )}
            {feedback.closedBy && (
              <div>
                <Label className="text-muted-foreground">Closed By</Label>
                <p className="mt-1" data-testid="text-closed-by">{feedback.closedBy}</p>
              </div>
            )}
            <Button 
              onClick={handleSavePhaseData}
              disabled={updateMutation.isPending}
              data-testid="button-save-outcome"
            >
              {updateMutation.isPending ? "Saving..." : "Save Outcome"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
