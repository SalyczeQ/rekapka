import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, retros } from "@/lib/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { AppShell } from "@/components/layout/app-shell";
import { UIThemeSetter } from "@/components/shared/ui-theme-setter";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user's UI theme preference
  let uiTheme = "default";
  if (session.user.id) {
    const [user] = await db
      .select({ uiTheme: users.uiTheme })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);
    if (user) {
      uiTheme = user.uiTheme;
    }
  }

  // Fetch the active retro (only one can be active at a time)
  const [activeRetro] = await db
    .select({ id: retros.id, title: retros.title, status: retros.status })
    .from(retros)
    .where(inArray(retros.status, ["writing", "discussing"]))
    .orderBy(desc(retros.updatedAt))
    .limit(1);

  return (
    <>
      <UIThemeSetter theme={uiTheme} />
      <AppShell activeRetro={activeRetro ? { id: activeRetro.id, title: activeRetro.title, status: activeRetro.status } : null}>
        {children}
      </AppShell>
    </>
  );
}
