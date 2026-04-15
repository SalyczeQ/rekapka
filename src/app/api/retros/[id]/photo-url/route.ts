import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPhotoUrl } from "@/lib/s3/upload";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await params; // validate route param exists

  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const url = await getPhotoUrl(key);
  return NextResponse.json({ url });
}
