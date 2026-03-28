import Link from "next/link";
import { db } from "@/lib/db";
import { teams as teamsTable, retros, actionItems } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
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

  const [team] = await db
    .select({ id: teamsTable.id })
    .from(teamsTable)
    .where(eq(teamsTable.slug, teamSlug))
    .limit(1);

  if (!team) return null;

  const recentRetros = await db
    .select({
      id: retros.id,
      title: retros.title,
      status: retros.status,
      date: retros.date,
      createdAt: retros.createdAt,
    })
    .from(retros)
    .where(eq(retros.teamId, team.id))
    .orderBy(desc(retros.createdAt))
    .limit(5);

  const retroIds = recentRetros.map((r) => r.id);

  const actions =
    retroIds.length > 0
      ? await db
          .select({
            id: actionItems.id,
            text: actionItems.text,
            status: actionItems.status,
            assigneeId: actionItems.assigneeId,
            dueDate: actionItems.dueDate,
            retroId: actionItems.retroId,
          })
          .from(actionItems)
          .where(
            inArray(actionItems.retroId, retroIds)
          )
          .limit(5)
      : [];

  const openActions = actions.filter(
    (a) => a.status === "open" || a.status === "in_progress"
  );

  const activeRetro = recentRetros.find((r) => r.status !== "completed");

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
          {!recentRetros.length ? (
            <p className="text-sm text-muted-foreground">No retros yet.</p>
          ) : (
            <div className="space-y-2">
              {recentRetros.map((retro) => (
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
          {!openActions.length ? (
            <p className="text-sm text-muted-foreground">
              No open action items.
            </p>
          ) : (
            <div className="space-y-2">
              {openActions.map((action) => (
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
