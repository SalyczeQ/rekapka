import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Users } from "lucide-react";
import { CreateTeamDialog } from "@/components/team/create-team-dialog";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { teamMembers, teams as teamsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function TeamSelectorPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const teams = await db
    .select({
      id: teamsTable.id,
      name: teamsTable.name,
      slug: teamsTable.slug,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .innerJoin(teamsTable, eq(teamMembers.teamId, teamsTable.id))
    .where(eq(teamMembers.userId, user.id));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <span className="text-lg font-bold">Rekapka</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Your teams</h1>
          <CreateTeamDialog />
        </div>

        {teams.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-3">
                You&apos;re not part of any team yet.
              </p>
              <CreateTeamDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {teams.map((team) => (
              <Link key={team.id} href={`/app/${team.slug}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{team.name}</CardTitle>
                      <span className="text-xs text-muted-foreground capitalize">
                        {team.role}
                      </span>
                    </div>
                    <CardDescription className="text-xs">
                      /{team.slug}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
