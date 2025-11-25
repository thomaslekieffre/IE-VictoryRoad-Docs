import { NextResponse } from "next/server";

const ALLOWED_HOSTNAMES = new Set([
  "lh3.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh7-us.googleusercontent.com",
]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const src = url.searchParams.get("src");

  if (!src) {
    return NextResponse.json({ ok: false, error: "Missing src" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid URL" }, { status: 400 });
  }

  if (!ALLOWED_HOSTNAMES.has(parsed.hostname)) {
    return NextResponse.json({ ok: false, error: "Host not allowed" }, { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), {
    headers: {
      "User-Agent": "VictoryRoadBot/1.0",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      Referer: "https://victory-road.fr",
    },
    next: { revalidate: 60 * 60, tags: ["token-images"] },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { ok: false, status: upstream.status, error: "Upstream error" },
      { status: upstream.status || 502 },
    );
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("Content-Type") ?? "image/jpeg");
  headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=86400");
  headers.set("Access-Control-Allow-Origin", "*");

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  });
}

export const runtime = "edge";

