import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: team } = await supabase
    .from("teams")
    .select("id, name, slug")
    .eq("slug", teamSlug)
    .single();

  if (!team) notFound();

  const { data: membership } = await supabase
    .from("team_members")
    .select("role")
    .eq("team_id", team.id)
    .eq("user_id", user.id)
    .single();

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
