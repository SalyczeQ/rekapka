import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/retros");
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
