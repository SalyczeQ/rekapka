"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export function SignOutButton() {
  const t = useTranslations("common");

  return (
    <form action="/api/auth/signout" method="POST">
      <Button variant="ghost" size="sm" type="submit">
        <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
        {t("signOut")}
      </Button>
    </form>
  );
}
