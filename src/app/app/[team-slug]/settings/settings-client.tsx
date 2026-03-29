"use client";

import { useState } from "react";
import { updateTeamNameAction, generateInviteTokenAction } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberList } from "@/components/team/member-list";
import { InviteModal } from "@/components/team/invite-modal";
import { ThemePreview } from "@/components/layout/theme-preview";
import { toast } from "sonner";
import { Copy, Link } from "lucide-react";

interface Team {
  id: string;
  name: string;
  slug: string;
  icsToken: string;
  inviteToken: string | null;
}

export function SettingsClient({ team, role }: { team: Team; role: string }) {
  const [name, setName] = useState(team.name);
  const [saving, setSaving] = useState(false);
  const [inviteToken, setInviteToken] = useState(team.inviteToken);
  const [generating, setGenerating] = useState(false);

  const isOwner = role === "owner";

  async function handleSave() {
    setSaving(true);
    const result = await updateTeamNameAction(team.id, name);
    if (result?.error) toast.error(result.error);
    else toast.success("Team updated");
    setSaving(false);
  }

  async function handleGenerateInvite() {
    setGenerating(true);
    const result = await generateInviteTokenAction(team.id);
    if (result?.error) toast.error(result.error);
    else if (result?.token) {
      setInviteToken(result.token);
      toast.success("Invite link generated");
    }
    setGenerating(false);
  }

  function copyIcsUrl() {
    const url = `${window.location.origin}/api/ics/${team.icsToken}`;
    navigator.clipboard.writeText(url);
    toast.success("ICS URL copied to clipboard");
  }

  function copyInviteUrl() {
    if (!inviteToken) return;
    const url = `${window.location.origin}/invite/${inviteToken}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied to clipboard");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Settings</h1>

      {(isOwner) && (
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
      )}

      <Card>
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Members</CardTitle>
            {(isOwner) && <InviteModal teamId={team.id} />}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <MemberList teamId={team.id} />
        </CardContent>
      </Card>

      {isOwner && (
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm">Invite Link</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Share this link so others can join directly. Anyone with the link can join.
            </p>
            {inviteToken ? (
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inviteToken}`}
                  className="text-xs"
                />
                <Button size="icon" variant="outline" onClick={copyInviteUrl}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ) : null}
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateInvite}
              disabled={generating}
            >
              <Link className="h-3 w-3 mr-1" />
              {generating ? "Generating..." : inviteToken ? "Regenerate link" : "Generate invite link"}
            </Button>
          </CardContent>
        </Card>
      )}

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
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/api/ics/${team.icsToken}`}
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
