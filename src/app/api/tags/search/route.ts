import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { ilike, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") || "";

  const results = await db
    .select()
    .from(tags)
    .where(q ? ilike(tags.name, `%${q}%`) : undefined)
    .orderBy(desc(tags.usageCount))
    .limit(20);

  return NextResponse.json(results);
}
