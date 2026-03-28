import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Calendar, ListChecks } from "lucide-react";

export default async function TeamDashboard({
  params,
}: {
  params: Promise<{ "team-slug": string }>;
}) {
  const { "team-slug": teamSlug } = await params;
  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("slug", teamSlug)
    .single();

  if (!team) return null;

  const { data: retros } = await supabase
    .from("retros")
    .select("id, title, status, date, created_at")
    .eq("team_id", team.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: actions } = await supabase
    .from("action_items")
    .select("id, text, status, assignee_id, due_date, retro_id")
    .in(
      "retro_id",
      (retros ?? []).map((r) => r.id)
    )
    .in("status", ["open", "in_progress"])
    .limit(5);

  const activeRetro = retros?.find((r) => r.status !== "completed");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <Button size="sm" render={<Link href={`/app/${teamSlug}/retros/new`} />}>
          <Plus className="h-4 w-4 mr-1" />
          New retro
        </Button>
      </div>

      {activeRetro && (
        <Link href={`/app/${teamSlug}/retros/${activeRetro.id}`}>
          <Card className="border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="py-3 px-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <CardTitle className="text-sm">Active retro</CardTitle>
              </div>
              <CardDescription>
                {activeRetro.title} &mdash;{" "}
                <span className="capitalize">{activeRetro.status}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      )}

      <Card>
        <CardHeader className="py-3 px-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Recent retros</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          {!retros?.length ? (
            <p className="text-sm text-muted-foreground">No retros yet.</p>
          ) : (
            <div className="space-y-2">
              {retros.map((retro) => (
                <Link
                  key={retro.id}
                  href={`/app/${teamSlug}/retros/${retro.id}`}
                  className="flex items-center justify-between py-1 text-sm hover:text-primary transition-colors"
                >
                  <span>{retro.title}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {retro.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Open action items</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          {!actions?.length ? (
            <p className="text-sm text-muted-foreground">
              No open action items.
            </p>
          ) : (
            <div className="space-y-2">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between py-1 text-sm"
                >
                  <span>{action.text}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {action.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
