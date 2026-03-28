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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {items.map((item) => {
          const href = `${base}${item.path}`;
          const isActive =
            item.path === ""
              ? pathname === base
              : pathname.startsWith(href);
          return (
            <Link
              key={item.path}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
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
