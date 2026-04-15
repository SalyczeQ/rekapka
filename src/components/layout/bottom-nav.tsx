"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, BarChart3, Play, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ActiveRetro {
  id: string;
  title: string;
  status: string;
}

export function BottomNav({ activeRetro }: { activeRetro?: ActiveRetro | null }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const middleItem = activeRetro
    ? { href: `/retros/${activeRetro.id}`, icon: Play, label: t("activeRetro") }
    : { href: "/retros/new", icon: Plus, label: t("newRetro") };

  const navItems = [
    { href: "/retros", icon: Home, label: t("dashboard") },
    middleItem,
    { href: "/predictions", icon: Lightbulb, label: t("predictions") },
    { href: "/stats", icon: BarChart3, label: t("stats") },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = item.href.startsWith("/retros/") && item.href !== "/retros/new"
            ? pathname.startsWith(item.href)
            : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-xs",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
