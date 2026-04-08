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

const THEMES = [
  { value: "default", label: "Default" },
  { value: "cli", label: "CLI (Terminal)" },
  { value: "msdos", label: "MS-DOS" },
  { value: "material3", label: "Material 3" },
  { value: "windows", label: "Windows 95" },
  { value: "ios26", label: "iOS 26 Glass" },
];

const LOCALES = [
  { value: "cs", label: "Cestina" },
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

      <Card>
        <CardHeader>
          <CardTitle>{t("profile")}</CardTitle>
          <CardDescription>{t("yourSettings")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ActionForm action={updateUserSettings} className="space-y-4" successMessage={t("saved")}>
            <div className="space-y-1.5">
              <Label htmlFor="settings-name">{t("name")}</Label>
              <input
                key={user.name}
                id="settings-name"
                name="name"
                defaultValue={user.name}
                autoComplete="name"
                required
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="settings-email">{t("email")}</Label>
              <input
                id="settings-email"
                value={user.email}
                disabled
                autoComplete="email"
                spellCheck={false}
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
              />
              <p className="text-xs text-muted-foreground">
                {t("emailHint")}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="settings-theme">{t("theme")}</Label>
              <select
                key={user.uiTheme}
                id="settings-theme"
                name="uiTheme"
                defaultValue={user.uiTheme}
                className="h-8 w-full text-sm bg-transparent border border-input rounded-lg px-2.5 py-1 focus:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {THEMES.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="settings-locale">{t("language")}</Label>
              <select
                key={user.locale}
                id="settings-locale"
                name="locale"
                defaultValue={user.locale}
                className="h-8 w-full text-sm bg-transparent border border-input rounded-lg px-2.5 py-1 focus:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {LOCALES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit">{t("saveSettings")}</Button>
          </ActionForm>
        </CardContent>
      </Card>
    </div>
  );
}
