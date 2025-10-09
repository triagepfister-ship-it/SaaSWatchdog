import { CustomerCard } from "../CustomerCard";

export default function CustomerCardExample() {
  return (
    <div className="p-8">
      <CustomerCard
        id="1"
        name="John Doe"
        email="john@acmecorp.com"
        company="Acme Corp"
        status="active"
        totalValue="$50,000"
        subscriptions={3}
      />
    </div>
  );
}
