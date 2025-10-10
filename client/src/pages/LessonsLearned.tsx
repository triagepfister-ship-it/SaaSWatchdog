import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LessonsLearned, LESSONS_LEARNED_PHASES, SOFTWARE_TYPES, Customer } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

export default function LessonsLearnedPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: lessonsLearned = [] } = useQuery<LessonsLearned[]>({
    queryKey: ["/api/lessons-learned"],
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const selectedLessonData = lessonsLearned.find(l => l.id === selectedLesson);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    software: "none",
    customerId: "none",
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/lessons-learned", data);
      return await res.json();
    },
    onSuccess: async (newLesson) => {
      await queryClient.invalidateQueries({ queryKey: ["/api/lessons-learned"] });
      setIsCreateDialogOpen(false);
      setSelectedLesson(newLesson.id);
      setFormData({ title: "", description: "", software: "none", customerId: "none" });
      toast({
        title: "Success",
        description: "Lessons Learned workflow initiated successfully",
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
      title: formData.title,
      description: formData.description || null,
      phase: "Root Cause Analysis",
      software: formData.software === "none" ? null : formData.software,
      customerId: formData.customerId === "none" ? null : formData.customerId,
      initiatedBy: user?.username || "Unknown",
    });
  };

  if (selectedLesson) {
    if (!selectedLessonData) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading workflow...</p>
        </div>
      );
    }
    return <LessonDetailView 
      lesson={selectedLessonData} 
      onBack={() => setSelectedLesson(null)} 
    />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Lessons Learned</h1>
          <p className="text-muted-foreground mt-1">Manage and track lessons learned workflows</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-lesson">
              <Plus className="mr-2 h-4 w-4" />
              New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-create-lesson">
            <DialogHeader>
              <DialogTitle>Initiate Lessons Learned Workflow</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter workflow title"
                  required
                  data-testid="input-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the issue or situation"
                  data-testid="input-description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="software">Software (Optional)</Label>
                <Select value={formData.software} onValueChange={(value) => setFormData({ ...formData, software: value === "none" ? "" : value })}>
                  <SelectTrigger id="software" data-testid="select-software">
                    <SelectValue placeholder="Select software" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {SOFTWARE_TYPES.map((software) => (
                      <SelectItem key={software} value={software}>
                        {software}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Related Customer (Optional)</Label>
                <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value === "none" ? "" : value })}>
                  <SelectTrigger id="customer" data-testid="select-customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit">
                  {createMutation.isPending ? "Creating..." : "Create Workflow"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {lessonsLearned.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No lessons learned workflows yet. Create one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          lessonsLearned.map((lesson) => (
            <Card 
              key={lesson.id} 
              className="cursor-pointer hover-elevate" 
              onClick={() => setSelectedLesson(lesson.id)}
              data-testid={`card-lesson-${lesson.id}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-3 py-1 rounded-md bg-primary/10 text-primary font-medium">
                      {lesson.phase}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              {lesson.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function LessonDetailView({ lesson, onBack }: { lesson: LessonsLearned; onBack: () => void }) {
  const [currentPhase, setCurrentPhase] = useState(lesson.phase);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [phaseData, setPhaseData] = useState({
    rootCauseAnalysis: lesson.rootCauseAnalysis || "",
    implementationPlan: lesson.implementationPlan || "",
    implementationNotes: lesson.implementationNotes || "",
    outcome: lesson.outcome || "",
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/lessons-learned/${lesson.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons-learned"] });
      toast({
        title: "Success",
        description: "Workflow updated successfully",
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
    setCurrentPhase(newPhase);
    updateMutation.mutate({ phase: newPhase });
  };

  const handleSave = () => {
    const updates: any = { ...phaseData };
    
    if (currentPhase === "Closed") {
      updates.closedDate = new Date().toISOString();
      updates.closedBy = user?.username || "Unknown";
    }
    
    updateMutation.mutate(updates);
  };

  const currentPhaseIndex = LESSONS_LEARNED_PHASES.indexOf(currentPhase as any);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} data-testid="button-back">
          Back to List
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">{lesson.title}</h1>
          <p className="text-muted-foreground mt-1">Manage workflow phases</p>
        </div>
      </div>

      {/* Phase Navigation Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            {LESSONS_LEARNED_PHASES.map((phase, index) => (
              <div key={phase} className="flex items-center flex-1">
                <Button
                  variant={currentPhase === phase ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handlePhaseChange(phase)}
                  disabled={index > currentPhaseIndex + 1}
                  data-testid={`button-phase-${phase.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {phase}
                </Button>
                {index < LESSONS_LEARNED_PHASES.length - 1 && (
                  <ChevronRight className="h-5 w-5 mx-2 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phase-Specific Content */}
      <Card>
        <CardHeader>
          <CardTitle>{currentPhase} Phase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPhase === "Initiate" && (
            <>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={lesson.title} disabled />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={lesson.description || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Initiated By</Label>
                <Input value={lesson.initiatedBy} disabled />
              </div>
              <div className="space-y-2">
                <Label>Initiated Date</Label>
                <Input 
                  value={new Date(lesson.initiatedDate).toLocaleDateString()} 
                  disabled 
                />
              </div>
            </>
          )}

          {currentPhase === "Root Cause Analysis" && (
            <div className="space-y-2">
              <Label htmlFor="rootCauseAnalysis">Root Cause Analysis</Label>
              <Textarea
                id="rootCauseAnalysis"
                value={phaseData.rootCauseAnalysis}
                onChange={(e) => setPhaseData({ ...phaseData, rootCauseAnalysis: e.target.value })}
                placeholder="Document the root cause analysis findings..."
                rows={8}
                data-testid="input-root-cause-analysis"
              />
            </div>
          )}

          {currentPhase === "Implementation" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="implementationPlan">Implementation Plan</Label>
                <Textarea
                  id="implementationPlan"
                  value={phaseData.implementationPlan}
                  onChange={(e) => setPhaseData({ ...phaseData, implementationPlan: e.target.value })}
                  placeholder="Describe the implementation plan..."
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
                  placeholder="Track implementation progress and notes..."
                  rows={6}
                  data-testid="input-implementation-notes"
                />
              </div>
            </>
          )}

          {currentPhase === "Closed" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Textarea
                  id="outcome"
                  value={phaseData.outcome}
                  onChange={(e) => setPhaseData({ ...phaseData, outcome: e.target.value })}
                  placeholder="Document the final outcome and lessons learned..."
                  rows={8}
                  data-testid="input-outcome"
                />
              </div>
              {lesson.closedDate && (
                <>
                  <div className="space-y-2">
                    <Label>Closed Date</Label>
                    <Input 
                      value={new Date(lesson.closedDate).toLocaleDateString()} 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Closed By</Label>
                    <Input value={lesson.closedBy || ""} disabled />
                  </div>
                </>
              )}
            </>
          )}

          {currentPhase !== "Initiate" && (
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave} 
                disabled={updateMutation.isPending}
                data-testid="button-save-phase"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
