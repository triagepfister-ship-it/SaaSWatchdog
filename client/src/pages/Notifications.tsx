import { Card, CardContent } from "@/components/ui/card";
import { Bell, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

//todo: remove mock functionality
const mockNotifications = [
  { id: "1", type: "reminder", title: "Renewal Reminder Sent", message: "Acme Corp - 30 day renewal reminder sent", time: "2 hours ago", read: false },
  { id: "2", type: "alert", title: "Escalation Required", message: "TechStart Inc has not responded to renewal emails", time: "5 hours ago", read: false },
  { id: "3", type: "success", title: "Renewal Confirmed", message: "Global Solutions renewed Enterprise Plan for $75,000", time: "1 day ago", read: true },
  { id: "4", type: "reminder", title: "Renewal Reminder Sent", message: "StartupXYZ - 14 day renewal reminder sent", time: "2 days ago", read: true },
  { id: "5", type: "alert", title: "At-Risk Customer", message: "Innovation Labs exploring competitor options", time: "3 days ago", read: true },
];

const getIcon = (type: string) => {
  switch (type) {
    case "reminder":
      return <Bell className="h-5 w-5 text-blue-500" />;
    case "alert":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Mail className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on renewal activities</p>
        </div>
        <Button variant="outline" data-testid="button-mark-all-read">
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-2">
        {mockNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`hover-elevate ${!notification.read ? "border-primary/30" : ""}`}
            data-testid={`notification-${notification.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
