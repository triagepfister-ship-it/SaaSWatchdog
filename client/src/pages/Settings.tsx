import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your renewal tracking preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure when and how you receive renewal reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email alerts for upcoming renewals</p>
            </div>
            <Switch defaultChecked data-testid="switch-email-notifications" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Escalation Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when customers are at risk</p>
            </div>
            <Switch defaultChecked data-testid="switch-escalation-alerts" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Summary</Label>
              <p className="text-sm text-muted-foreground">Receive a daily summary of renewal activities</p>
            </div>
            <Switch data-testid="switch-daily-summary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Schedule</CardTitle>
          <CardDescription>Set how far in advance to send renewal reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reminder-90">First Reminder (days)</Label>
              <Input id="reminder-90" type="number" defaultValue="90" data-testid="input-reminder-90" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-60">Second Reminder (days)</Label>
              <Input id="reminder-60" type="number" defaultValue="60" data-testid="input-reminder-60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-30">Third Reminder (days)</Label>
              <Input id="reminder-30" type="number" defaultValue="30" data-testid="input-reminder-30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-14">Final Reminder (days)</Label>
              <Input id="reminder-14" type="number" defaultValue="14" data-testid="input-reminder-14" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" defaultValue="ViewPoint Watchdog" data-testid="input-company-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input id="admin-email" type="email" defaultValue="admin@viewpointwatchdog.com" data-testid="input-admin-email" />
          </div>
          <Button data-testid="button-save-settings">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
