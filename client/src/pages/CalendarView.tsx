import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Renewal Calendar</h1>
        <p className="text-muted-foreground mt-1">View upcoming renewals by date</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>October 2025</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" data-testid="button-prev-month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" data-testid="button-next-month">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Calendar view will show renewal dates once subscriptions are added.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
