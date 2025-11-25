import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const REQUIRED_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request: Request) {
  if (REQUIRED_SECRET) {
    const providedSecret = request.headers.get("x-revalidate-secret");
    if (providedSecret !== REQUIRED_SECRET) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  await revalidateTag("tokens", "manual");

  return NextResponse.json({ ok: true, revalidated: ["tokens"] });
}

export const dynamic = "force-dynamic";

