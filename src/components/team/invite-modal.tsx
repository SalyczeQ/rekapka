"use client";

import { useState } from "react";
import { inviteMemberAction } from "@/lib/actions/settings";
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
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export function InviteModal({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await inviteMemberAction(teamId, email);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Member added!");
      setOpen(false);
      setEmail("");
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add member"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
