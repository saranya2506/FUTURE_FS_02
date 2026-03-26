import { useLeads } from "@/hooks/useLeads";
import { Link } from "react-router-dom";
import LeadStatusBadge from "@/components/LeadStatusBadge";
import LeadFormDialog from "@/components/LeadFormDialog";
import { Loader2, Users, UserPlus, UserCheck, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

const COLORS = [
  "hsl(210, 100%, 56%)",
  "hsl(38, 90%, 55%)",
  "hsl(145, 60%, 45%)",
  "hsl(0, 72%, 55%)",
  "hsl(180, 80%, 45%)",
];

export default function DashboardPage() {
  const { data: leads = [], isLoading } = useLeads();

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
  };

  const statusChartData = useMemo(() => [
    { name: "New", value: stats.new },
    { name: "Contacted", value: stats.contacted },
    { name: "Converted", value: stats.converted },
  ], [stats.new, stats.contacted, stats.converted]);

  const sourceChartData = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => {
      const src = l.source || "direct";
      map[src] = (map[src] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [leads]);

  const timelineData = useMemo(() => {
    const days = 14;
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = startOfDay(subDays(new Date(), i));
      const dayStr = format(day, "MMM d");
      const count = leads.filter((l) => {
        const created = startOfDay(new Date(l.created_at));
        return created.getTime() === day.getTime();
      }).length;
      result.push({ date: dayStr, leads: count });
    }
    return result;
  }, [leads]);

  const recentLeads = leads.slice(0, 5);

  const statCards = [
    { label: "Total Leads", value: stats.total, icon: Users, color: "text-primary" },
    { label: "New", value: stats.new, icon: UserPlus, color: "text-primary" },
    { label: "Contacted", value: stats.contacted, icon: TrendingUp, color: "text-warning" },
    { label: "Converted", value: stats.converted, icon: UserCheck, color: "text-success" },
  ];

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
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your lead pipeline</p>
        </div>
        <LeadFormDialog />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lead timeline area chart */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Leads (Last 14 Days)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.15)" />
                <XAxis dataKey="date" tick={{ fill: "hsl(220,15%,40%)", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "hsl(220,15%,40%)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsla(0,0%,100%,0.85)",
                    border: "1px solid hsla(0,0%,100%,0.25)",
                    borderRadius: "0.75rem",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="hsl(210, 100%, 56%)"
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads by source bar chart */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Leads by Source</h2>
          <div className="h-56">
            {sourceChartData.length === 0 ? (
              <p className="text-muted-foreground text-center py-16">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.15)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(220,15%,40%)", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "hsl(220,15%,40%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsla(0,0%,100%,0.85)",
                      border: "1px solid hsla(0,0%,100%,0.25)",
                      borderRadius: "0.75rem",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(210, 100%, 56%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Status pie + recent leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Status Breakdown</h2>
          <div className="h-48">
            {stats.total === 0 ? (
              <p className="text-muted-foreground text-center py-16">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusChartData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold">Recent Leads</h2>
            <Link to="/leads" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No leads yet. Add your first lead!</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  to={`/leads/${lead.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {lead.project_type && (
                      <span className="text-xs text-muted-foreground hidden sm:inline">{lead.project_type}</span>
                    )}
                    <LeadStatusBadge status={lead.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
