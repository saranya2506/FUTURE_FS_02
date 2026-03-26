import type { Lead } from "@/hooks/useLeads";

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-primary/15 text-primary border-primary/20" },
  contacted: { label: "Contacted", className: "bg-warning/15 text-warning border-warning/20" },
  converted: { label: "Converted", className: "bg-success/15 text-success border-success/20" },
};

export default function LeadStatusBadge({ status }: { status: Lead["status"] }) {
  const config = statusConfig[status] ?? statusConfig.new;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
