import { Card, CardContent } from "@/components/ui/card";

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on renewal activities</p>
        </div>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No notifications yet. Notifications will appear here when renewal reminders are sent.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
