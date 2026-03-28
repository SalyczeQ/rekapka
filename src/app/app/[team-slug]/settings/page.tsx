"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MemberList } from "@/components/team/member-list";
import { InviteModal } from "@/components/team/invite-modal";
import { ThemePreview } from "@/components/layout/theme-preview";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface Team {
  id: string;
  name: string;
  slug: string;
  ics_token: string | null;
}

export default function TeamSettingsPage() {
  const routeParams = useParams();
  const teamSlug = routeParams["team-slug"] as string;
  const [team, setTeam] = useState<Team | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("teams")
        .select("id, name, slug, ics_token")
        .eq("slug", teamSlug)
        .single();
      if (data) {
        setTeam(data);
        setName(data.name);
      }
    }
    load();
  }, [teamSlug, supabase]);

  async function handleSave() {
    if (!team) return;
    setSaving(true);
    const { error } = await supabase
      .from("teams")
      .update({ name: name.trim() })
      .eq("id", team.id);
    if (error) toast.error(error.message);
    else toast.success("Team updated");
    setSaving(false);
  }

  function copyIcsUrl() {
    if (!team) return;
    const url = `${window.location.origin}/api/ics/${team.ics_token}`;
    navigator.clipboard.writeText(url);
    toast.success("ICS URL copied to clipboard");
  }

  if (!team) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Team Settings</h1>

      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">General</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="team-name">Team name</Label>
            <Input
              id="team-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Members</CardTitle>
            <InviteModal teamId={team.id} />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <MemberList teamId={team.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Visual Theme</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ThemePreview />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Calendar (ICS)</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          <p className="text-xs text-muted-foreground">
            Subscribe to this URL in your calendar app to see retro events.
          </p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/api/ics/${team.ics_token}`}
              className="text-xs"
            />
            <Button size="icon" variant="outline" onClick={copyIcsUrl}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
