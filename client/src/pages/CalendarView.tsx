import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

//todo: remove mock functionality
const mockRenewals = [
  { id: "1", customer: "Acme Corp", product: "Enterprise Plan", date: "2025-10-15", value: "$50,000", status: "healthy" as const },
  { id: "2", customer: "TechStart Inc", product: "Pro Plan", date: "2025-10-22", value: "$25,000", status: "at-risk" as const },
  { id: "3", customer: "Global Solutions", product: "Enterprise Plan", date: "2025-10-18", value: "$75,000", status: "at-risk" as const },
  { id: "4", customer: "StartupXYZ", product: "Basic Plan", date: "2025-11-01", value: "$12,000", status: "healthy" as const },
];

export default function CalendarView() {
  const [currentMonth] = useState("October 2025");

  const getDaysInMonth = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };

  const getRenewalForDay = (day: number) => {
    const dateStr = `2025-10-${day.toString().padStart(2, "0")}`;
    return mockRenewals.filter((r) => r.date === dateStr);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Renewal Calendar</h1>
        <p className="text-muted-foreground mt-1">View upcoming renewals by date</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{currentMonth}</CardTitle>
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
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day) => {
              const renewals = getRenewalForDay(day);
              const hasRenewals = renewals.length > 0;

              return (
                <div
                  key={day}
                  className={`min-h-24 p-2 border rounded-md ${hasRenewals ? "bg-primary/5 border-primary/20" : "bg-muted/20"}`}
                  data-testid={`calendar-day-${day}`}
                >
                  <div className="text-sm font-medium mb-1">{day}</div>
                  {renewals.map((renewal) => (
                    <div
                      key={renewal.id}
                      className="text-xs p-1 rounded bg-card mb-1 hover-elevate cursor-pointer"
                      data-testid={`renewal-${renewal.id}`}
                    >
                      <div className="font-medium truncate">{renewal.customer}</div>
                      <div className="text-muted-foreground truncate">{renewal.value}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Renewals</h2>
        <div className="space-y-2">
          {mockRenewals.map((renewal) => (
            <Card key={renewal.id} className="hover-elevate" data-testid={`renewal-card-${renewal.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{renewal.customer}</h3>
                    <p className="text-sm text-muted-foreground">{renewal.product}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Renewal Date</p>
                      <p className="font-medium">{renewal.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Value</p>
                      <p className="font-mono font-semibold">{renewal.value}</p>
                    </div>
                    <StatusBadge status={renewal.status} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
