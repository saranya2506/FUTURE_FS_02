import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLead, useLeadNotes, useUpdateLead, useDeleteLead, useCreateNote, useDeleteNote } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LeadStatusBadge from "@/components/LeadStatusBadge";
import { ArrowLeft, Mail, Phone, Building2, Globe, Trash2, Calendar, DollarSign, FolderOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";

const statusOptions = ["new", "contacted", "converted"];

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading } = useLead(id);
  const { data: notes = [] } = useLeadNotes(id);
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const { toast } = useToast();

  const [noteContent, setNoteContent] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  if (isLoading || !lead) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleStatusChange = async (status: string) => {
    try {
      await updateLead.mutateAsync({ id: lead.id, status });
      toast({ title: "Status updated" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    try {
      await deleteLead.mutateAsync(lead.id);
      toast({ title: "Lead deleted" });
      navigate("/leads");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    try {
      await createNote.mutateAsync({
        lead_id: lead.id,
        content: noteContent.trim(),
        follow_up_date: followUpDate || null,
      });
      setNoteContent("");
      setFollowUpDate("");
      toast({ title: "Note added" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote.mutateAsync({ id: noteId, leadId: lead.id });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const sourceLabels: Record<string, string> = {
    website: "Website",
    referral: "Referral",
    social_media: "Social Media",
    email_campaign: "Email Campaign",
    other: "Other",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">
            Added {format(new Date(lead.created_at), "MMMM d, yyyy")}
          </p>
        </div>
        <Button variant="destructive" size="icon" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Lead info */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg">Lead Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {lead.email}
            </div>
            {lead.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {lead.phone}
              </div>
            )}
            {lead.company && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {lead.company}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {sourceLabels[lead.source]}
            </div>
            {lead.budget && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {lead.budget}
              </div>
            )}
            {lead.project_type && (
              <div className="flex items-center gap-2 text-sm">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                {lead.project_type}
              </div>
            )}

            <div className="pt-2 space-y-2">
              <Label className="text-sm">Status</Label>
              <Select value={lead.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg">Notes & Follow-ups</h2>
          <form onSubmit={handleAddNote} className="space-y-3">
            <Textarea
              placeholder="Add a note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={3}
              className="glass-input"
            />
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Follow-up date (optional)</Label>
                <Input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="glass-input"
                />
              </div>
              <Button type="submit" disabled={createNote.isPending}>
                {createNote.isPending ? "Adding..." : "Add Note"}
              </Button>
            </div>
          </form>

          <div className="space-y-3 pt-2">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No notes yet</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="p-3 rounded-lg bg-muted/30 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm">{note.content}</p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {format(new Date(note.created_at), "MMM d, yyyy 'at' h:mm a")}
                    {note.follow_up_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Follow up: {format(new Date(note.follow_up_date), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
