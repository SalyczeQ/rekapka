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
import { Plus, ChevronRight } from "lucide-react";

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

  const completedRetros = recentRetros.filter((r) => r.status === "completed");
  const inProgressRetros = recentRetros.filter((r) => r.status !== "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <Button size="sm" render={<Link href={`/app/${teamSlug}/retros/new`} />}>
          <Plus className="h-4 w-4 mr-1" />
          New retro
        </Button>
      </div>

      {/* Active / in-progress retros */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Active
        </h2>
        {inProgressRetros.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active retros.</p>
        ) : (
          <div className="space-y-2">
            {inProgressRetros.map((retro) => (
              <div key={retro.id}>
                <Link href={`/app/${teamSlug}/retros/${retro.id}`}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{retro.title}</CardTitle>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize shrink-0">
                          {retro.status}
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent completed retros */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Recent retros
        </h2>
        <Card>
          <CardContent className="px-0 py-0">
            {completedRetros.length === 0 ? (
              <p className="text-sm text-muted-foreground px-4 py-3">No completed retros yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {completedRetros.map((retro) => (
                  <Link
                    key={retro.id}
                    href={`/app/${teamSlug}/retros/${retro.id}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-accent/50 active:bg-accent transition-colors"
                  >
                    <span className="truncate">{retro.title}</span>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span className="text-xs text-muted-foreground capitalize">{retro.status}</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Open action items */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Open actions
        </h2>
        <Card>
          <CardContent className="px-0 py-0">
            {openActions.length === 0 ? (
              <p className="text-sm text-muted-foreground px-4 py-3">No open action items.</p>
            ) : (
              <div className="divide-y divide-border">
                {openActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between px-4 py-2.5 text-sm"
                  >
                    <span className="truncate">{action.text}</span>
                    <span className="text-xs text-muted-foreground capitalize ml-2 shrink-0">
                      {action.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
