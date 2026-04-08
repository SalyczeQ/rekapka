import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/retros");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-4xl font-bold">Rekapka</h1>
      <p className="text-muted-foreground text-center max-w-md">
        A retrospective tool for your team. Reflect, discuss, and improve together.
      </p>
      <Link href="/login">
        <Button size="lg">Get Started</Button>
      </Link>
    </main>
  );
}
