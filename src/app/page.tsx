import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { db } from "@/lib/db";
import { retros } from "@/lib/db/schema";
import { inArray, desc } from "drizzle-orm";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    const [activeRetro] = await db
      .select({ id: retros.id })
      .from(retros)
      .where(inArray(retros.status, ["writing", "discussing"]))
      .orderBy(desc(retros.updatedAt))
      .limit(1);

    redirect(activeRetro ? `/retros/${activeRetro.id}` : "/retros");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center gap-4">
        <Logo size="lg" />
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: "#1A6B5A" }}>
          Rekapka
        </h1>
      </div>
      <p className="text-muted-foreground text-center max-w-md text-lg leading-relaxed">
        Retrospektiva pro ty, co to myslej se zlepshovanim vazne.
      </p>
      <Link href="/login">
        <Button
          size="lg"
          className="px-8 text-base"
          style={{ backgroundColor: "#1A6B5A" }}
        >
          Get Started
        </Button>
      </Link>
    </main>
  );
}
