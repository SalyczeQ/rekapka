"use client";

import { cn } from "@/lib/utils";

interface CardColorBorderProps {
  authorColor: string;
  className?: string;
  children: React.ReactNode;
}

export function CardColorBorder({
  authorColor,
  className,
  children,
}: CardColorBorderProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
        style={{ backgroundColor: authorColor }}
      />
      <div className="pl-2">{children}</div>
    </div>
  );
}
