"use client";

import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  async function handleSignOut() {
    if (!confirm("Sign out?")) return;
    await signOutAction();
  }

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSignOut}>
      <LogOut className="h-4 w-4" />
      <span className="sr-only">Sign out</span>
    </Button>
  );
}
