import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Bell,
  Settings,
  AlertCircle,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Churn", url: "/churn", icon: AlertCircle },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Lessons Learned", url: "/lessons-learned", icon: Lightbulb },
  { title: "Feedback", url: "/feedback", icon: MessageSquare },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings, adminOnly: true },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  // Check if current user has admin access
  const isUserAdmin = user?.username === "Stephen" || user?.username === "Anvesh";

  // Filter menu items based on user permissions
  const visibleMenuItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return isUserAdmin;
    }
    return true;
  });

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-xl font-semibold">ELSE SaaS Watchdog</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
