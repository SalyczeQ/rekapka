import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ActionForm } from "@/components/shared/action-form";
import { updateUserSettings } from "@/lib/actions/settings";
import { getTranslations } from "next-intl/server";
import { ColorPicker } from "@/components/shared/color-picker";

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

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-balance">{tNav("settings")}</h1>

      <ActionForm action={updateUserSettings} successMessage={t("saved")}>
        {/* Account section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile")}</CardTitle>
            <CardDescription>{t("yourSettings")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="space-y-2">
              <Label htmlFor="settings-name">{t("name")}</Label>
              <input
                key={user.name}
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

        {/* Appearance section */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{t("appearance")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="space-y-2">
              <Label htmlFor="settings-theme">{t("theme")}</Label>
              <select
                key={user.uiTheme}
                id="settings-theme"
                name="uiTheme"
                defaultValue={user.uiTheme}
                className="h-10 w-full text-sm bg-transparent border border-input rounded-lg px-3 py-2 focus:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {THEMES.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>{t("cardColor")}</Label>
              <ColorPicker name="color" defaultValue={user.color} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-locale">{t("language")}</Label>
              <select
                key={user.locale}
                id="settings-locale"
                name="locale"
                defaultValue={user.locale}
                className="h-10 w-full text-sm bg-transparent border border-input rounded-lg px-3 py-2 focus:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {LOCALES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  key={String(user.dictationEnabled)}
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
          </CardContent>
        </Card>

        {/* Save */}
        <div className="mt-6">
          <Button type="submit" className="w-full sm:w-auto">{t("saveSettings")}</Button>
        </div>
      </ActionForm>
    </div>
  );
}
