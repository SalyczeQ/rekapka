import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RetroSession } from "@/components/retro/retro-session";

export default async function RetroPage({
  params,
}: {
  params: Promise<{ "team-slug": string; id: string }>;
}) {
  const { "team-slug": teamSlug, id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("slug", teamSlug)
    .single();
  if (!team) notFound();

  const { data: retro } = await supabase
    .from("retros")
    .select("*")
    .eq("id", id)
    .eq("team_id", team.id)
    .single();
  if (!retro) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("retro_id", retro.id)
    .order("sort_order");

  const { data: cards } = await supabase
    .from("cards")
    .select("*")
    .eq("retro_id", retro.id)
    .order("created_at");

  const { data: votes } = await supabase
    .from("votes")
    .select("*")
    .in(
      "card_id",
      (cards ?? []).map((c) => c.id)
    );

  const { data: membership } = await supabase
    .from("team_members")
    .select("role")
    .eq("team_id", team.id)
    .eq("user_id", user.id)
    .single();

  return (
    <RetroSession
      retro={retro}
      categories={categories ?? []}
      initialCards={cards ?? []}
      initialVotes={votes ?? []}
      currentUserId={user.id}
      userRole={membership?.role ?? "member"}
      teamSlug={teamSlug}
    />
  );
}
