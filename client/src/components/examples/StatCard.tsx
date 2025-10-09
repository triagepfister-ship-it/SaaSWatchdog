import { StatCard } from "../StatCard";
import { TrendingUp } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-8">
      <StatCard
        title="Renewal Rate"
        value="94.2%"
        change="+2.1% from last month"
        icon={TrendingUp}
        trend="up"
      />
    </div>
  );
}
