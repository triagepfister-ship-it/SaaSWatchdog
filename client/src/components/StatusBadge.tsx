import { Badge } from "@/components/ui/badge";

type Status = "healthy" | "at-risk" | "churned" | "active" | "inactive";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig = {
  healthy: { label: "Healthy", color: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/20" },
  "at-risk": { label: "At Risk", color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20" },
  churned: { label: "Churned", color: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20" },
  active: { label: "Active", color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20" },
  inactive: { label: "Inactive", color: "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400 border-gray-500/20" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.color} border px-3 py-1 text-xs font-medium`}
      data-testid={`badge-status-${status}`}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}
