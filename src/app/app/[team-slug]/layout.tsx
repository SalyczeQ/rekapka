import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { teams as teamsTable, teamMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SignOutButton } from "@/components/shared/sign-out-button";

export default async function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ "team-slug": string }>;
}) {
  const { "team-slug": teamSlug } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [team] = await db
    .select({ id: teamsTable.id, name: teamsTable.name, slug: teamsTable.slug })
    .from(teamsTable)
    .where(eq(teamsTable.slug, teamSlug))
    .limit(1);

  if (!team) notFound();

  const [membership] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.teamId, team.id),
        eq(teamMembers.userId, session.user.id)
      )
    )
    .limit(1);

  if (!membership) notFound();

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{team.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-4">{children}</main>
      <BottomNav teamSlug={teamSlug} />
    </div>
  );
}
