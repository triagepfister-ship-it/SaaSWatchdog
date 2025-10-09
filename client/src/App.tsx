import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import Churn from "@/pages/Churn";
import CalendarView from "@/pages/CalendarView";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import LessonsLearned from "@/pages/LessonsLearned";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

function AuthenticatedApp() {
  const { user, logoutMutation } = useAuth();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              {user && <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => logoutMutation.mutate()}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Switch>
              <ProtectedRoute path="/" component={Dashboard} />
              <ProtectedRoute path="/customers" component={Customers} />
              <ProtectedRoute path="/churn" component={Churn} />
              <ProtectedRoute path="/calendar" component={CalendarView} />
              <ProtectedRoute path="/lessons-learned" component={LessonsLearned} />
              <ProtectedRoute path="/notifications" component={Notifications} />
              <ProtectedRoute path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Switch>
            <Route path="/auth" component={AuthPage} />
            <Route>
              <AuthenticatedApp />
            </Route>
          </Switch>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
