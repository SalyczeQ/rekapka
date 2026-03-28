"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TEMPLATES = [
  {
    value: "went_well_improve",
    label: "Went Well / Improve",
    categories: [
      { name: "Went Well", icon: "✅", color: "#22C55E" },
      { name: "Needs Improvement", icon: "❌", color: "#EF4444" },
    ],
  },
  {
    value: "mad_sad_glad",
    label: "Mad / Sad / Glad",
    categories: [
      { name: "Mad", icon: "😡", color: "#EF4444" },
      { name: "Sad", icon: "😢", color: "#3B82F6" },
      { name: "Glad", icon: "😊", color: "#22C55E" },
    ],
  },
  {
    value: "start_stop_continue",
    label: "Start / Stop / Continue",
    categories: [
      { name: "Start", icon: "🟢", color: "#22C55E" },
      { name: "Stop", icon: "🔴", color: "#EF4444" },
      { name: "Continue", icon: "🔵", color: "#3B82F6" },
    ],
  },
  {
    value: "four_ls",
    label: "4Ls",
    categories: [
      { name: "Liked", icon: "💚", color: "#22C55E" },
      { name: "Learned", icon: "📚", color: "#3B82F6" },
      { name: "Lacked", icon: "🔧", color: "#F97316" },
      { name: "Longed For", icon: "🙏", color: "#8B5CF6" },
    ],
  },
];

export default function NewRetroPage() {
  const router = useRouter();
  const routeParams = useParams();
  const teamSlug = routeParams["team-slug"] as string;
  const [title, setTitle] = useState(
    `Retro ${new Date().toLocaleDateString()}`
  );
  const [template, setTemplate] = useState<"went_well_improve" | "mad_sad_glad" | "start_stop_continue" | "four_ls" | "custom">("went_well_improve");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

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

    const { data: team } = await supabase
      .from("teams")
      .select("id")
      .eq("slug", teamSlug)
      .single();

    if (!team) {
      setError("Team not found");
      setLoading(false);
      return;
    }

    const { data: retro, error: retroError } = await supabase
      .from("retros")
      .insert({
        team_id: team.id,
        title: title.trim(),
        template,
        created_by: user.id,
      })
      .select()
      .single();

    if (retroError) {
      setError(retroError.message);
      setLoading(false);
      return;
    }

    const tmpl = TEMPLATES.find((t) => t.value === template);
    if (tmpl) {
      const categories = tmpl.categories.map((cat, i) => ({
        retro_id: retro.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        sort_order: i,
      }));
      await supabase.from("categories").insert(categories);
    }

    router.push(`/app/${teamSlug}/retros/${retro.id}`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">New retro</h1>

      <Card>
        <CardContent className="pt-4">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Template</Label>
              <Select value={template} onValueChange={(v) => v && setTemplate(v as typeof template)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.find((t) => t.value === template)?.categories.map(
                  (cat) => (
                    <span
                      key={cat.name}
                      className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-md border"
                      style={{ borderColor: cat.color }}
                    >
                      {cat.icon} {cat.name}
                    </span>
                  )
                )}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create retro"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
