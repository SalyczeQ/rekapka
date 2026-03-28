import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { teams as teamsTable, teamMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SettingsClient } from "./settings-client";

export default async function TeamSettingsPage({
  params,
}: {
  params: Promise<{ "team-slug": string }>;
}) {
  const { "team-slug": teamSlug } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [team] = await db
    .select({
      id: teamsTable.id,
      name: teamsTable.name,
      slug: teamsTable.slug,
      icsToken: teamsTable.icsToken,
    })
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

  return <SettingsClient team={team} />;
}
