export type Locale = "cs" | "en";

interface Labels {
  justNow: string;
  minute: (n: number) => string;
  hour: (n: number) => string;
  day: (n: number) => string;
  week: (n: number) => string;
  month: (n: number) => string;
  year: (n: number) => string;
}

const EN: Labels = {
  justNow: "just now",
  minute: (n) => `${n}m ago`,
  hour: (n) => `${n}h ago`,
  day: (n) => `${n}d ago`,
  week: (n) => `${n}w ago`,
  month: (n) => `${n}mo ago`,
  year: (n) => `${n}y ago`,
};

const CS: Labels = {
  justNow: "právě teď",
  minute: (n) => `před ${n} min`,
  hour: (n) => `před ${n} h`,
  day: (n) => `před ${n} d`,
  week: (n) => `před ${n} t`,
  month: (n) => `před ${n} měs`,
  year: (n) => `před ${n} r`,
};

export function formatTimeAgo(
  input: Date | string | number | null | undefined,
  locale: Locale = "en",
  now: number = Date.now()
): string | null {
  if (input == null) return null;
  const ts = input instanceof Date ? input.getTime() : new Date(input).getTime();
  if (Number.isNaN(ts)) return null;

  const labels = locale === "cs" ? CS : EN;
  const diffSec = Math.max(0, Math.floor((now - ts) / 1000));

  if (diffSec < 60) return labels.justNow;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return labels.minute(diffMin);
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return labels.hour(diffHr);
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return labels.day(diffDay);
  const diffWk = Math.floor(diffDay / 7);
  if (diffDay < 30) return labels.week(diffWk);
  const diffMo = Math.floor(diffDay / 30);
  if (diffDay < 365) return labels.month(diffMo);
  const diffYr = Math.floor(diffDay / 365);
  return labels.year(diffYr);
}
