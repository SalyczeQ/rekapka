import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <span className="text-xl font-bold">Rekapka</span>
        <div className="flex gap-2">
          <Button variant="ghost" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button render={<Link href="/signup" />}>
            Get started
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
          Retros that actually
          <br />
          <span className="text-primary">move teams forward</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          A mobile-first retrospective tool with real-time collaboration, smart
          card grouping, and actionable outcomes.
        </p>
        <div className="flex gap-3">
          <Button size="lg" render={<Link href="/signup" />}>
            Start your first retro
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full text-left">
          <div className="p-4">
            <h3 className="font-semibold mb-1">Real-time collaboration</h3>
            <p className="text-sm text-muted-foreground">
              See card counts live, vote together, and discuss in real-time with
              your whole team.
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-1">AI-powered grouping</h3>
            <p className="text-sm text-muted-foreground">
              Automatically cluster cards by theme so your team can focus on
              what matters most.
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-1">Action tracking</h3>
            <p className="text-sm text-muted-foreground">
              Turn discussions into action items with assignees and due dates
              that carry over.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        Rekapka &mdash; Making retrospectives engaging
      </footer>
    </div>
  );
}
