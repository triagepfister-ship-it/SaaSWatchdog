import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Customer } from "@shared/schema";
import { format, isSameMonth, isSameDay, startOfMonth, endOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const customersInMonth = useMemo(() => {
    return customers
      .filter(customer => {
        if (!customer.renewalExpirationDate) return false;
        const renewalDate = new Date(customer.renewalExpirationDate);
        return isSameMonth(renewalDate, currentDate);
      })
      .sort((a, b) => {
        const dateA = new Date(a.renewalExpirationDate!).getTime();
        const dateB = new Date(b.renewalExpirationDate!).getTime();
        return dateA - dateB;
      });
  }, [customers, currentDate]);

  const datesWithRenewals = useMemo(() => {
    return customersInMonth.map(c => new Date(c.renewalExpirationDate!));
  }, [customersInMonth]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const modifiers = {
    hasRenewal: datesWithRenewals,
  };

  const modifiersStyles = {
    hasRenewal: {
      fontWeight: 'bold',
      color: 'hsl(var(--primary))',
      backgroundColor: 'hsl(var(--primary) / 0.1)',
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Renewal Calendar</h1>
        <p className="text-muted-foreground mt-1">View upcoming renewals by date</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePrevMonth}
                  data-testid="button-prev-month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleNextMonth}
                  data-testid="button-next-month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              month={currentDate}
              onMonthChange={setCurrentDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              data-testid="calendar-display"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Renewals in {format(currentDate, 'MMMM yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            {customersInMonth.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground" data-testid="text-no-renewals">
                No renewals scheduled for this month
              </div>
            ) : (
              <div className="space-y-3" data-testid="list-renewals">
                {customersInMonth.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-start justify-between p-4 rounded-lg border hover-elevate"
                    data-testid={`renewal-item-${customer.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium" data-testid={`text-company-${customer.id}`}>
                          {customer.company}
                        </h4>
                        {customer.pilotCustomer && (
                          <Badge variant="secondary" className="text-xs">
                            Pilot
                          </Badge>
                        )}
                        {customer.churn && (
                          <Badge variant="destructive" className="text-xs">
                            Churned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {customer.opportunityName}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span data-testid={`text-renewal-date-${customer.id}`}>
                          {format(new Date(customer.renewalExpirationDate!), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg" data-testid={`text-amount-${customer.id}`}>
                        ${customer.renewalAmount?.toLocaleString()}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {customer.software}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
