import { useState } from "react";
import { Link } from "react-router-dom";
import { useLeads } from "@/hooks/useLeads";
import LeadStatusBadge from "@/components/LeadStatusBadge";
import LeadFormDialog from "@/components/LeadFormDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Mail, Building2, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function LeadsPage() {
  const { data: leads = [], isLoading } = useLeads();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.company?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Leads</h1>
          <p className="text-muted-foreground">{leads.length} total leads</p>
        </div>
        <LeadFormDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 glass-input"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] glass-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">
            {search || statusFilter !== "all" ? "No leads match your filters" : "No leads yet. Add your first lead!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <Link key={lead.id} to={`/leads/${lead.id}`} className="block">
              <div className="glass-card p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{lead.name}</p>
                      <LeadStatusBadge status={lead.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {lead.email}
                      </span>
                      {lead.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" /> {lead.company}
                        </span>
                      )}
                      {lead.budget && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" /> {lead.budget}
                        </span>
                      )}
                      {lead.project_type && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{lead.project_type}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {format(new Date(lead.created_at), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
