import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <StatusBadge status="healthy" />
      <StatusBadge status="at-risk" />
      <StatusBadge status="churned" />
      <StatusBadge status="active" />
      <StatusBadge status="inactive" />
    </div>
  );
}
