import { RenewalTable } from "../RenewalTable";

const mockRenewals = [
  { id: "1", customer: "Acme Corp", product: "Enterprise Plan", renewalDate: "2025-11-15", value: "$50,000", status: "healthy" as const, daysUntilRenewal: 37 },
  { id: "2", customer: "TechStart Inc", product: "Pro Plan", renewalDate: "2025-10-22", value: "$25,000", status: "at-risk" as const, daysUntilRenewal: 13 },
];

export default function RenewalTableExample() {
  return (
    <div className="p-8">
      <RenewalTable renewals={mockRenewals} />
    </div>
  );
}
