import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { joinTeamByInviteAction } from "@/lib/actions/settings";
import Link from "next/link";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?redirectTo=/invite/${token}`);
  }

  const result = await joinTeamByInviteAction(token);

  if (result.error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">{result.error}</p>
          <Link href="/app" className="text-sm underline">Go to app</Link>
        </div>
      </div>
    );
  }

  redirect(`/app/${result.slug}`);
}
