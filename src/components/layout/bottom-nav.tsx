"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, RotateCcw, ListChecks, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  teamSlug: string;
}

const items = [
  { label: "Dashboard", icon: LayoutDashboard, path: "" },
  { label: "Retros", icon: RotateCcw, path: "/retros" },
  { label: "Actions", icon: ListChecks, path: "/actions" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function BottomNav({ teamSlug }: BottomNavProps) {
  const pathname = usePathname();
  const base = `/app/${teamSlug}`;

  return (
    <nav className={cn(
      // Mobile: fixed bottom bar
      "fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-bottom",
      // Desktop: fixed left sidebar
      "md:bottom-auto md:right-auto md:top-0 md:left-0 md:h-screen md:w-16 md:border-t-0 md:border-r md:flex md:flex-col md:justify-start md:pt-16"
    )}>
      {/* Mobile layout */}
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto md:hidden">
        {items.map((item) => {
          const href = `${base}${item.path}`;
          const isActive = item.path === "" ? pathname === base : pathname.startsWith(href);
          return (
            <Link
              key={item.path}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop sidebar layout */}
      <div className="hidden md:flex md:flex-col md:gap-1 md:px-2 md:py-4">
        {items.map((item) => {
          const href = `${base}${item.path}`;
          const isActive = item.path === "" ? pathname === base : pathname.startsWith(href);
          return (
            <Link
              key={item.path}
              href={href}
              title={item.label}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg p-2 text-[10px] transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
