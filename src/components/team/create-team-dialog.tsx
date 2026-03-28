"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Plus } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function handleNameChange(value: string) {
    setName(value);
    setSlug(slugify(value));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({ name: name.trim(), slug: slug.trim(), created_by: user.id })
      .select()
      .single();

    if (teamError) {
      setError(
        teamError.code === "23505"
          ? "This slug is already taken"
          : teamError.message
      );
      setLoading(false);
      return;
    }

    await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "owner",
    });

    setOpen(false);
    setName("");
    setSlug("");
    router.push(`/app/${team.slug}`);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="h-4 w-4 mr-1" />
        New team
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create a team</DialogTitle>
          <DialogDescription>
            Set up a new team to start running retros.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="team-name">Team name</Label>
            <Input
              id="team-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Engineering"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="team-slug">URL slug</Label>
            <Input
              id="team-slug"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="engineering"
              required
            />
            <p className="text-xs text-muted-foreground">
              /app/{slug || "..."}
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create team"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
