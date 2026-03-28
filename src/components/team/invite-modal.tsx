"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export function InviteModal({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "facilitator" | "member">("member");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Look up user by email
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (!user) {
      toast.error("User not found. They need to sign up first.");
      setLoading(false);
      return;
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      toast.error("User is already a team member.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("team_members").insert({
      team_id: teamId,
      user_id: user.id,
      role,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Member added!");
      setOpen(false);
      setEmail("");
      setRole("member");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <UserPlus className="h-3 w-3 mr-1" />
        Invite
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Add a team member by their email address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => v && setRole(v as typeof role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="facilitator">Facilitator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add member"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
