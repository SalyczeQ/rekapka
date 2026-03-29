import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getOrCreateDefaultTeam } from "@/lib/db/default-team";

export default async function TeamSelectorPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const team = await getOrCreateDefaultTeam(user.id);
  redirect(`/app/${team.slug}`);
}
