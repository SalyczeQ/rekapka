"use client";

import { useUITheme, type UITheme } from "@/components/shared/theme-provider";
import { cn } from "@/lib/utils";

const themes: { id: UITheme; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "cli", label: "CLI" },
  { id: "msdos", label: "MS-DOS" },
  { id: "material3", label: "Material" },
  { id: "windows", label: "Windows" },
];

function MiniCard({ theme }: { theme: UITheme }) {
  return (
    <div
      data-ui-theme={theme}
      className="w-full h-8 rounded border bg-card text-card-foreground flex items-center px-1.5 gap-1"
    >
      <div className="w-0.5 h-4 rounded-full bg-primary shrink-0" />
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="h-1 w-3/4 rounded-full bg-foreground/30" />
        <div className="h-1 w-1/2 rounded-full bg-foreground/15" />
      </div>
    </div>
  );
}

export function ThemePreview() {
  const { uiTheme, setUITheme } = useUITheme();

  return (
    <div className="flex gap-2 overflow-x-auto py-1">
      {themes.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setUITheme(id)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-md border p-2 min-w-[72px] transition-all",
            uiTheme === id
              ? "border-primary ring-2 ring-primary/20 bg-accent"
              : "border-border hover:border-foreground/20"
          )}
        >
          <MiniCard theme={id} />
          <span className="text-[10px] font-medium text-muted-foreground">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
