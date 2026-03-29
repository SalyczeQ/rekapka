import Link from "next/link";
import { db } from "@/lib/db";
import { teams as teamsTable, retros, teamMembers } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { DeleteRetroButton } from "@/components/retro/delete-retro-button";

export default async function RetroListPage({
  params,
}: {
  params: Promise<{ "team-slug": string }>;
}) {
  const { "team-slug": teamSlug } = await params;
  const session = await auth();

  const [team] = await db
    .select({ id: teamsTable.id })
    .from(teamsTable)
    .where(eq(teamsTable.slug, teamSlug))
    .limit(1);

  if (!team) return null;

  const [membership] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, session!.user!.id!)))
    .limit(1);

  const isOwnerOrAdmin = membership?.role === "owner" || membership?.role === "admin";

  const retroList = await db
    .select({
      id: retros.id,
      title: retros.title,
      status: retros.status,
      date: retros.date,
      template: retros.template,
      createdAt: retros.createdAt,
      createdBy: retros.createdBy,
    })
    .from(retros)
    .where(eq(retros.teamId, team.id))
    .orderBy(desc(retros.createdAt));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Retros</h1>
        <Button size="sm" render={<Link href={`/app/${teamSlug}/retros/new`} />}>
          <Plus className="h-4 w-4 mr-1" />
          New retro
        </Button>
      </div>

      {!retroList.length ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-3">No retros yet.</p>
          <Button render={<Link href={`/app/${teamSlug}/retros/new`} />}>
            Create your first retro
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {retroList.map((retro) => {
            const canDelete = retro.status === "draft" &&
              (isOwnerOrAdmin || retro.createdBy === session!.user!.id);
            return (
              <div key={retro.id} className="relative group">
                <Link href={`/app/${teamSlug}/retros/${retro.id}`}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{retro.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              retro.status === "completed"
                                ? "bg-muted text-muted-foreground"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {retro.status}
                          </span>
                        </div>
                      </div>
                      <CardDescription className="text-xs">
                        {retro.date} &middot; {retro.template.replace(/_/g, " ")}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                {canDelete && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteRetroButton retroId={retro.id} teamSlug={teamSlug} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
