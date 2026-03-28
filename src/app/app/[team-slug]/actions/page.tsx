import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { teams as teamsTable, retros, actionItems } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ActionsClient } from "./actions-client";

export default async function ActionsPage({
  params,
}: {
  params: Promise<{ "team-slug": string }>;
}) {
  const { "team-slug": teamSlug } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [team] = await db
    .select({ id: teamsTable.id })
    .from(teamsTable)
    .where(eq(teamsTable.slug, teamSlug))
    .limit(1);

  if (!team) notFound();

  const teamRetros = await db
    .select({ id: retros.id })
    .from(retros)
    .where(eq(retros.teamId, team.id));

  const retroIds = teamRetros.map((r) => r.id);

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
          .where(inArray(actionItems.retroId, retroIds))
          .orderBy(desc(actionItems.createdAt))
      : [];

  return <ActionsClient actions={actions} />;
}
