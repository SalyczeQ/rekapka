"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Settings, BarChart3, Shield, Play, Lightbulb, History, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./theme-toggle";
import { LocaleToggle } from "./locale-toggle";
import { BottomNav } from "./bottom-nav";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useRetroHeaderTitle } from "./retro-header-context";

interface ActiveRetro {
  id: string;
  title: string;
  status: string;
}

function SidebarContent({ activeRetro, isAdmin }: { activeRetro?: ActiveRetro | null; isAdmin?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const homeItem = activeRetro
    ? { href: `/retros/${activeRetro.id}`, icon: Home, label: t("activeRetro") }
    : { href: "/retros/new", icon: Plus, label: t("newRetro") };

  const sidebarItems = [
    homeItem,
    { href: "/retros", icon: History, label: t("retros") },
    { href: "/stats", icon: BarChart3, label: t("stats") },
    { href: "/predictions", icon: Lightbulb, label: t("predictions") },
    { href: "/admin", icon: Shield, label: t("admin") },
    ...(isAdmin ? [{ href: "/audit", icon: ScrollText, label: t("audit") }] : []),
    { href: "/settings", icon: Settings, label: t("settings") },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/retros" className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="text-xl font-bold" style={{ color: "#1A6B5A" }}>Rekapka</span>
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = item.href.startsWith("/retros/") && item.href !== "/retros/new"
            ? pathname.startsWith(item.href)
            : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t space-y-2">
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LocaleToggle />
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  activeRetro?: ActiveRetro | null;
  isAdmin?: boolean;
}

export function AppShell({ children, activeRetro, isAdmin }: AppShellProps) {
  const retroHeaderTitle = useRetroHeaderTitle();
  const t = useTranslations("nav");
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:bg-sidebar">
        <Suspense>
          <SidebarContent activeRetro={activeRetro} isAdmin={isAdmin} />
        </Suspense>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Mobile header */}
        <header className="flex items-center justify-between px-4 h-14 border-b md:hidden">
          <Link
            href={activeRetro ? `/retros/${activeRetro.id}` : "/retros"}
            className="font-bold truncate min-w-0 flex-1 pr-2"
          >
            {retroHeaderTitle ?? "Rekapka"}
          </Link>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                render={<Link href="/audit" aria-label={t("audit")} />}
              >
                <ScrollText className="h-5 w-5" aria-hidden="true" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              render={<Link href="/admin" aria-label={t("admin")} />}
            >
              <Shield className="h-5 w-5" aria-hidden="true" />
            </Button>
            <LocaleToggle />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              render={<Link href="/settings" aria-label={t("settings")} />}
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav activeRetro={activeRetro} />
    </div>
  );
}
