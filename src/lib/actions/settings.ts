"use server";

import { db } from "@/lib/db";
import { users, appSettings } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateUserSettings(_prev: unknown, formData: FormData) {
  try {
    const user = await requireAuth();

    const name = formData.get("name") as string;
    const locale = formData.get("locale") as string;
    const uiTheme = formData.get("uiTheme") as string;
    const dictationEnabled = formData.get("dictationEnabled");

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (name) updates.name = name;
    if (locale) updates.locale = locale;
    if (uiTheme) updates.uiTheme = uiTheme;
    // Checkbox: present in form = "on", absent = null
    updates.dictationEnabled = dictationEnabled === "on";

    await db.update(users).set(updates).where(eq(users.id, user.id!));

    // Set locale cookie so next-intl picks it up
    if (locale) {
      const cookieStore = await cookies();
      cookieStore.set("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    }

    // Revalidate the app layout so UIThemeSetter picks up the new theme
    revalidatePath("/", "layout");
    return { success: true, message: "Settings saved" };
  } catch {
    return { success: false, message: "Failed to save settings" };
  }
}

export async function updateAppSettings(_prev: unknown, formData: FormData) {
  try {
    await requireAuth();

    const groupName = formData.get("groupName") as string;

    if (groupName) {
      const [settings] = await db.select().from(appSettings).limit(1);
      if (settings) {
        await db
          .update(appSettings)
          .set({ groupName, updatedAt: new Date() })
          .where(eq(appSettings.id, settings.id));
      }
    }

    revalidatePath("/admin");
    return { success: true, message: "Group name saved" };
  } catch {
    return { success: false, message: "Failed to save group name" };
  }
}
