import { createClient } from "@/lib/supabase/server";
import { generateCsv } from "@/lib/csv/export";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: retroId } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: retro } = await supabase
      .from("retros")
      .select("id, title, team_id")
      .eq("id", retroId)
      .single();

    if (!retro) {
      return Response.json({ error: "Retro not found" }, { status: 404 });
    }

    // Verify team membership
    const { data: membership } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", retro.team_id)
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: cards } = await supabase
      .from("cards")
      .select("id, text, category_id, author_id, is_discussed, group_label")
      .eq("retro_id", retroId)
      .order("created_at");

    const { data: categories } = await supabase
      .from("categories")
      .select("id, name")
      .eq("retro_id", retroId);

    const { data: users } = await supabase
      .from("users")
      .select("id, name")
      .in("id", (cards ?? []).map((c) => c.author_id));

    const { data: votes } = await supabase
      .from("votes")
      .select("card_id")
      .in("card_id", (cards ?? []).map((c) => c.id));

    const { data: cardTags } = await supabase
      .from("card_tags")
      .select("card_id, tag_id")
      .in("card_id", (cards ?? []).map((c) => c.id));

    const { data: tags } = await supabase
      .from("tags")
      .select("id, name")
      .in("id", (cardTags ?? []).map((ct) => ct.tag_id));

    const categoryMap = new Map(
      (categories ?? []).map((c) => [c.id, c.name])
    );
    const userMap = new Map(
      (users ?? []).map((u) => [u.id, u.name])
    );
    const tagMap = new Map(
      (tags ?? []).map((t) => [t.id, t.name])
    );

    const voteCountMap = new Map<string, number>();
    for (const v of votes ?? []) {
      voteCountMap.set(v.card_id, (voteCountMap.get(v.card_id) ?? 0) + 1);
    }

    const cardTagsMap = new Map<string, string[]>();
    for (const ct of cardTags ?? []) {
      const existing = cardTagsMap.get(ct.card_id) ?? [];
      const tagName = tagMap.get(ct.tag_id);
      if (tagName) existing.push(tagName);
      cardTagsMap.set(ct.card_id, existing);
    }

    const csvCards = (cards ?? []).map((card) => ({
      category: categoryMap.get(card.category_id) ?? "",
      text: card.text,
      author: userMap.get(card.author_id) ?? "",
      votes: voteCountMap.get(card.id) ?? 0,
      tags: (cardTagsMap.get(card.id) ?? []).join(", "),
      discussed: card.is_discussed,
      group_label: card.group_label ?? "",
    }));

    const csv = generateCsv(csvCards);
    const filename = `${retro.title.replace(/[^a-z0-9]/gi, "_")}_export.csv`;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
