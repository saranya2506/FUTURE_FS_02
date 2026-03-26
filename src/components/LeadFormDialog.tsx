import { useState } from "react";
import { useCreateLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const sources = ["website", "referral", "social_media", "email_campaign", "other"] as const;
const sourceLabels: Record<string, string> = {
  website: "Website",
  referral: "Referral",
  social_media: "Social Media",
  email_campaign: "Email Campaign",
  other: "Other",
};

const projectTypes = ["Web Development", "Mobile App", "Consulting", "Design", "Marketing", "Other"];

export default function LeadFormDialog() {
  const [open, setOpen] = useState(false);
  const createLead = useCreateLead();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await createLead.mutateAsync({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        phone: (fd.get("phone") as string) || null,
        company: (fd.get("company") as string) || null,
        source: fd.get("source") as string,
        budget: (fd.get("budget") as string) || null,
        project_type: (fd.get("project_type") as string) || null,
      });
      toast({ title: "Lead created!" });
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input name="name" required className="glass-input" />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input name="email" type="email" required className="glass-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input name="phone" className="glass-input" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input name="company" className="glass-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Budget</Label>
              <Input name="budget" placeholder="e.g. $5,000 - $10,000" className="glass-input" />
            </div>
            <div className="space-y-2">
              <Label>Project Type</Label>
              <Select name="project_type">
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Source</Label>
            <Select name="source" defaultValue="other">
              <SelectTrigger className="glass-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>{sourceLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={createLead.isPending}>
            {createLead.isPending ? "Creating..." : "Create Lead"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
