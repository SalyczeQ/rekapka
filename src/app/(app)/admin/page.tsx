import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { appSettings, inviteTokens, users, cards } from "@/lib/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "@/components/shared/action-form";
import { updateAppSettings } from "@/lib/actions/settings";
import { createInviteToken, deleteInviteToken } from "@/lib/actions/invite";
import { Link2, Trash2, Plus, Calendar, Bot } from "lucide-react";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { RecalculateGuessesButton } from "@/components/admin/recalculate-guesses-button";
import { ANONYMOUS_ID } from "@/lib/anonymous";

export default async function AdminPage() {
  await requireAuth();
  const t = await getTranslations("settings");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const settings = await db.select().from(appSettings).limit(1);
  const config = settings[0];

  const tokens = await db
    .select({
      id: inviteTokens.id,
      token: inviteTokens.token,
      isReusable: inviteTokens.isReusable,
      expiresAt: inviteTokens.expiresAt,
      createdAt: inviteTokens.createdAt,
      creatorName: users.name,
    })
    .from(inviteTokens)
    .leftJoin(users, eq(inviteTokens.createdBy, users.id))
    .orderBy(inviteTokens.createdAt);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // AI guessing stats
  const [anonStats] = await db
    .select({
      total: count(),
      withGuesses: sql<number>`count(*) filter (where ${cards.guessedAuthor} is not null)`,
    })
    .from(cards)
    .where(eq(cards.authorId, ANONYMOUS_ID));

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-balance">{tNav("admin")}</h1>

      {/* Group Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("groupSettings")}</CardTitle>
          <CardDescription>{t("manageGroup")}</CardDescription>
        </CardHeader>
        <CardContent>
          {config ? (
            <ActionForm action={updateAppSettings} className="space-y-4" successMessage={t("groupNameSaved")}>
              <div className="space-y-1.5">
                <Label htmlFor="admin-group-name">{t("groupName")}</Label>
                <input
                  key={config.groupName}
                  id="admin-group-name"
                  name="groupName"
                  defaultValue={config.groupName}
                  autoComplete="off"
                  required
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                />
              </div>
              <Button type="submit">{tCommon("save")}</Button>
            </ActionForm>
          ) : (
            <p className="text-muted-foreground">
              {t("runSeed")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ICS Calendar Feed */}
      {config && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {t("icsUrl")}
            </CardTitle>
            <CardDescription>
              {t("icsDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 min-w-0 break-all">
                {appUrl}/api/ics/{config.icsToken}
              </code>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-4 w-4" aria-hidden="true" />
            {t("inviteLinks")}
          </CardTitle>
          <CardDescription>
            {t("inviteDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tokens.length > 0 ? (
            <div className="space-y-3">
              {tokens.map((tk) => (
                <div
                  key={tk.id}
                  className="flex items-center gap-2 text-sm border rounded-md p-2"
                >
                  <code className="flex-1 min-w-0 text-xs break-all truncate">
                    {appUrl}/invite/{tk.token}
                  </code>
                  <div className="flex items-center gap-1 shrink-0">
                    {tk.isReusable && (
                      <Badge variant="secondary" className="text-xs">
                        {t("reusable")}
                      </Badge>
                    )}
                    <form
                      action={async () => {
                        "use server";
                        await deleteInviteToken(tk.id);
                        revalidatePath("/admin");
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        type="submit"
                        aria-label="Delete invite link"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("noInvites")}
            </p>
          )}

          <form
            action={async () => {
              "use server";
              await createInviteToken();
            }}
          >
            <Button variant="outline" type="submit">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              {t("createInvite")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* AI Author Guessing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4" aria-hidden="true" />
            {t("aiGuessing")}
          </CardTitle>
          <CardDescription>{t("aiGuessingDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              {t("anonymousCards", { count: anonStats?.total ?? 0 })}
            </span>
            <span className="text-muted-foreground">
              {t("withGuesses", { count: anonStats?.withGuesses ?? 0 })}
            </span>
          </div>
          <RecalculateGuessesButton />
        </CardContent>
      </Card>
    </div>
  );
}
