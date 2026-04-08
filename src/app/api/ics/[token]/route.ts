import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appSettings, retros } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { generateIcsCalendar } from "@/lib/ics/generate-ics";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // Validate ICS token
  const [settings] = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.icsToken, token))
    .limit(1);

  if (!settings) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  // Fetch all retros
  const retroList = await db
    .select()
    .from(retros)
    .orderBy(desc(retros.date))
    .limit(100);

  const events = retroList.map((retro) => ({
    uid: retro.id,
    title: retro.title,
    date: retro.date instanceof Date ? retro.date : new Date(retro.date),
    location: retro.location,
  }));

  const ics = generateIcsCalendar(settings.groupName, events);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${settings.groupName}.ics"`,
    },
  });
}
