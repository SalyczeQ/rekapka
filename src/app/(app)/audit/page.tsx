import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { auditLogs, users, retros } from "@/lib/db/schema";
import { and, desc, eq, gte, lte, sql, count } from "drizzle-orm";
import { getTranslations, getFormatter } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AUDIT_ACTIONS } from "@/lib/audit";

const ADMIN_EMAIL = "salay14@gmail.com";
const PAGE_SIZE = 50;

interface AuditPageProps {
  searchParams: Promise<{
    userId?: string;
    action?: string;
    entityType?: string;
    retroId?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}

export default async function AuditPage({ searchParams }: AuditPageProps) {
  const user = await requireAuth();
  const t = await getTranslations("audit");
  const format = await getFormatter();

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t("unauthorized")}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const conditions = [];
  if (sp.userId) conditions.push(eq(auditLogs.userId, sp.userId));
  if (sp.action) conditions.push(eq(auditLogs.action, sp.action));
  if (sp.entityType) conditions.push(eq(auditLogs.entityType, sp.entityType));
  if (sp.retroId) conditions.push(eq(auditLogs.retroId, sp.retroId));
  if (sp.from) {
    const fromDate = new Date(sp.from);
    if (!Number.isNaN(fromDate.getTime())) conditions.push(gte(auditLogs.createdAt, fromDate));
  }
  if (sp.to) {
    const toDate = new Date(sp.to);
    if (!Number.isNaN(toDate.getTime())) {
      toDate.setHours(23, 59, 59, 999);
      conditions.push(lte(auditLogs.createdAt, toDate));
    }
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, totalResult, userOptions, retroOptions, distinctEntityTypes] = await Promise.all([
    db
      .select({
        id: auditLogs.id,
        userId: auditLogs.userId,
        userEmail: auditLogs.userEmail,
        userName: auditLogs.userName,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        entityId: auditLogs.entityId,
        retroId: auditLogs.retroId,
        metadata: auditLogs.metadata,
        ipAddress: auditLogs.ipAddress,
        createdAt: auditLogs.createdAt,
        currentUserName: users.name,
        retroTitle: retros.title,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .leftJoin(retros, eq(auditLogs.retroId, retros.id))
      .where(whereClause)
      .orderBy(desc(auditLogs.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ count: count() })
      .from(auditLogs)
      .where(whereClause),
    db.select({ id: users.id, name: users.name }).from(users).orderBy(users.name),
    db.select({ id: retros.id, title: retros.title }).from(retros).orderBy(desc(retros.date)).limit(50),
    db
      .select({ entityType: auditLogs.entityType })
      .from(auditLogs)
      .where(sql`${auditLogs.entityType} is not null`)
      .groupBy(auditLogs.entityType),
  ]);

  const total = totalResult[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const actionList = Object.values(AUDIT_ACTIONS).sort();

  function pageHref(nextPage: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (v && k !== "page") params.set(k, String(v));
    }
    params.set("page", String(nextPage));
    return `/audit?${params.toString()}`;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-balance">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("filters")}</CardTitle>
          <CardDescription>{t("total", { count: total })}</CardDescription>
        </CardHeader>
        <CardContent>
          <form method="get" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">{t("user")}</span>
              <select
                name="userId"
                defaultValue={sp.userId ?? ""}
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="">{t("anyUser")}</option>
                {userOptions.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">{t("action")}</span>
              <select
                name="action"
                defaultValue={sp.action ?? ""}
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="">{t("anyAction")}</option>
                {actionList.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">{t("entityType")}</span>
              <select
                name="entityType"
                defaultValue={sp.entityType ?? ""}
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="">{t("anyEntity")}</option>
                {distinctEntityTypes.map((e) =>
                  e.entityType ? (
                    <option key={e.entityType} value={e.entityType}>
                      {e.entityType}
                    </option>
                  ) : null,
                )}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">{t("retro")}</span>
              <select
                name="retroId"
                defaultValue={sp.retroId ?? ""}
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="">{t("anyEntity")}</option>
                {retroOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">{t("from")}</span>
              <input
                type="date"
                name="from"
                defaultValue={sp.from ?? ""}
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground">{t("to")}</span>
              <input
                type="date"
                name="to"
                defaultValue={sp.to ?? ""}
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
              />
            </label>
            <div className="flex items-end gap-2 col-span-full">
              <Button type="submit" size="sm">
                {t("apply")}
              </Button>
              <Link href="/audit" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                {t("clear")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {rows.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">{t("noResults")}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-3 py-2">{t("timestamp")}</th>
                  <th className="text-left font-medium px-3 py-2">{t("user")}</th>
                  <th className="text-left font-medium px-3 py-2">{t("action")}</th>
                  <th className="text-left font-medium px-3 py-2">{t("entityType")}</th>
                  <th className="text-left font-medium px-3 py-2">{t("retro")}</th>
                  <th className="text-left font-medium px-3 py-2">{t("ip")}</th>
                  <th className="text-left font-medium px-3 py-2">{t("details")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t align-top">
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                      {format.dateTime(r.createdAt, { dateStyle: "short", timeStyle: "medium" })}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {r.currentUserName ?? r.userName ?? r.userEmail ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {r.action}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {r.entityType ?? "—"}
                      {r.entityId ? (
                        <span className="font-mono text-xs block opacity-60 truncate max-w-[140px]">
                          {r.entityId}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{r.retroTitle ?? "—"}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {r.ipAddress ?? "—"}
                    </td>
                    <td className="px-3 py-2 max-w-xs">
                      {r.metadata ? (
                        <code className="text-xs break-all">
                          {JSON.stringify(r.metadata)}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                {t("prev")}
              </Link>
            )}
            {page < totalPages && (
              <Link href={pageHref(page + 1)} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                {t("next")}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
