import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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

  return (
    <>
      <UIThemeSetter theme={uiTheme} />
      <AppShell>{children}</AppShell>
    </>
  );
}
