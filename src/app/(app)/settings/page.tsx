import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { appSettings, inviteTokens, users, cards } from "@/lib/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "@/components/shared/action-form";
import { updateUserSettings, updateAppSettings } from "@/lib/actions/settings";
import { createInviteToken, deleteInviteToken } from "@/lib/actions/invite";
import { getTranslations } from "next-intl/server";
import { ColorPicker } from "@/components/shared/color-picker";
import { SettingsSelect } from "@/components/shared/settings-select";
import { RecalculateGuessesButton } from "@/components/admin/recalculate-guesses-button";
import { Link2, Trash2, Plus, Calendar, Bot } from "lucide-react";
import { revalidatePath } from "next/cache";
import { ANONYMOUS_ID } from "@/lib/anonymous";

const THEMES = [
  { value: "default", label: "Default" },
  { value: "cli", label: "CLI (Terminal)" },
  { value: "msdos", label: "MS-DOS" },
  { value: "material3", label: "Material 3" },
  { value: "windows", label: "Windows 95" },
  { value: "ios26", label: "iOS 26 Glass" },
];

const LOCALES = [
  { value: "cs", label: "Čeština" },
  { value: "en", label: "English" },
];

export default async function SettingsPage() {
  const sessionUser = await requireAuth();
  const t = await getTranslations("settings");
  const tNav = await getTranslations("nav");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionUser.id!))
    .limit(1);

  if (!user) return null;

  const [settingsRow] = await db.select().from(appSettings).limit(1);
  const config = settingsRow;

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

  const [anonStats] = await db
    .select({
      total: count(),
      withGuesses: sql<number>`count(*) filter (where ${cards.guessedAuthor} is not null)`,
    })
    .from(cards)
    .where(eq(cards.authorId, ANONYMOUS_ID));

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-balance">{tNav("settings")}</h1>

      <ActionForm action={updateUserSettings} successMessage={t("saved")} autoSubmit>
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile")}</CardTitle>
            <CardDescription>{t("yourSettings")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="space-y-2">
              <Label htmlFor="settings-name">{t("name")}</Label>
              <input
                id="settings-name"
                name="name"
                defaultValue={user.name}
                autoComplete="name"
                required
                className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-email">{t("email")}</Label>
              <input
                id="settings-email"
                value={user.email}
                disabled
                autoComplete="email"
                spellCheck={false}
                className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
              />
              <p className="text-xs text-muted-foreground">
                {t("emailHint")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{t("appearance")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="space-y-2">
              <Label htmlFor="settings-theme">{t("theme")}</Label>
              <SettingsSelect
                id="settings-theme"
                name="uiTheme"
                defaultValue={user.uiTheme}
                options={THEMES}
                className="h-10 w-full text-sm bg-transparent border border-input rounded-lg px-3 py-2 focus:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("cardColor")}</Label>
              <ColorPicker name="color" defaultValue={user.color} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-locale">{t("language")}</Label>
              <SettingsSelect
                id="settings-locale"
                name="locale"
                defaultValue={user.locale}
                options={LOCALES}
                className="h-10 w-full text-sm bg-transparent border border-input rounded-lg px-3 py-2 focus:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="settings-dictation"
                  name="dictationEnabled"
                  defaultChecked={user.dictationEnabled}
                  className="h-4 w-4 shrink-0 rounded border-input accent-primary"
                />
                <Label htmlFor="settings-dictation" className="leading-none">
                  {t("dictation")}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground pl-7">
                {t("dictationHint")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="settings-reaction-sounds"
                  name="reactionSoundsEnabled"
                  defaultChecked={user.reactionSoundsEnabled}
                  className="h-4 w-4 shrink-0 rounded border-input accent-primary"
                />
                <Label htmlFor="settings-reaction-sounds" className="leading-none">
                  {t("reactionSounds")}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground pl-7">
                {t("reactionSoundsHint")}
              </p>
            </div>
          </CardContent>
        </Card>

      </ActionForm>

      {/* Group settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("groupSettings")}</CardTitle>
          <CardDescription>{t("manageGroup")}</CardDescription>
        </CardHeader>
        <CardContent>
          {config ? (
            <ActionForm action={updateAppSettings} className="space-y-4" successMessage={t("groupNameSaved")} autoSubmit>
              <div className="space-y-1.5">
                <Label htmlFor="admin-group-name">{t("groupName")}</Label>
                <input
                  id="admin-group-name"
                  name="groupName"
                  defaultValue={config.groupName}
                  autoComplete="off"
                  required
                  className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
              </div>
            </ActionForm>
          ) : (
            <p className="text-muted-foreground">{t("runSeed")}</p>
          )}
        </CardContent>
      </Card>

      {/* ICS calendar feed */}
      {config && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {t("icsUrl")}
            </CardTitle>
            <CardDescription>{t("icsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
              {appUrl}/api/ics/{config.icsToken}
            </code>
          </CardContent>
        </Card>
      )}

      {/* Invite links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-4 w-4" aria-hidden="true" />
            {t("inviteLinks")}
          </CardTitle>
          <CardDescription>{t("inviteDesc")}</CardDescription>
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
                        revalidatePath("/settings");
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
            <p className="text-sm text-muted-foreground">{t("noInvites")}</p>
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

      {/* AI author guessing */}
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
