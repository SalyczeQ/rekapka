"use client";

import { useState } from "react";
import { createTeamAction } from "@/lib/actions/team";
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

  function handleNameChange(value: string) {
    setName(value);
    setSlug(slugify(value));
  }

  async function handleCreate(formData: FormData) {
    setError("");
    setLoading(true);
    formData.set("slug", slug);
    const result = await createTeamAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // On success, createTeamAction redirects — no cleanup needed
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
        <form action={handleCreate} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="team-name">Team name</Label>
            <Input
              id="team-name"
              name="name"
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
              name="slug"
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
