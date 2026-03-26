import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bell, Palette, Shield, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [leadAlerts, setLeadAlerts] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email updates about your leads</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Lead Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when a new lead is added</p>
            </div>
            <Switch checked={leadAlerts} onCheckedChange={setLeadAlerts} />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">Appearance</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          The app uses a glassmorphism theme with gradient backgrounds. More themes coming soon!
        </p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-display font-semibold">Danger Zone</h2>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/30 bg-destructive/5">
          <div>
            <p className="font-medium">Sign out of all devices</p>
            <p className="text-sm text-muted-foreground">This will log you out everywhere</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => signOut()}>
            <Trash2 className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
