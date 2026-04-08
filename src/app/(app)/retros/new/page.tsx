import { createRetro } from "@/lib/actions/retro";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTranslations } from "next-intl/server";

export default async function NewRetroPage() {
  const t = await getTranslations("retro");

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("newRetro")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRetro} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("title") + " *"}</Label>
              <Input
                id="title"
                name="title"
                placeholder="Sprint 42 Retro…"
                required
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">{t("date") + " *"}</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t("location")}</Label>
              <Input
                id="location"
                name="location"
                placeholder="Office / Remote…"
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full">
              {t("createRetro")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
