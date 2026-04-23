"use client";

import { useTranslations, useLocale } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatTimeAgo, type Locale } from "@/lib/time-ago";

interface Participant {
  id: string;
  name: string;
  color: string;
  image: string | null;
  online?: boolean;
  lastSeenAt?: string | null;
}

interface ParticipantBarProps {
  participants: Participant[];
}

export function ParticipantBar({ participants }: ParticipantBarProps) {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;

  if (participants.length === 0) return null;

  return (
    <div className="flex items-center gap-0.5 md:gap-1">
      {participants.map((p) => {
        let status: string;
        if (p.online) {
          status = t("online");
        } else {
          const ago = formatTimeAgo(p.lastSeenAt, locale);
          status = ago ? t("lastSeen", { when: ago }) : t("neverSeen");
        }

        return (
          <Popover key={p.id}>
            <PopoverTrigger
              className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${p.name} — ${status}`}
              title={`${p.name} — ${status}`}
            >
              <Avatar className="h-6 w-6 md:h-7 md:w-7 border-2" style={{ borderColor: p.color }}>
                {p.image && <AvatarImage src={p.image} alt={p.name} />}
                <AvatarFallback
                  className="text-[10px] text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name?.charAt(0)?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              {p.online && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto max-w-56 p-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 shrink-0" style={{ borderColor: p.color }}>
                  {p.image && <AvatarImage src={p.image} alt="" />}
                  <AvatarFallback
                    className="text-xs text-white"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{p.name}</span>
                  <span
                    className={
                      p.online
                        ? "text-xs text-green-600 dark:text-green-400"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    {status}
                  </span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
}
