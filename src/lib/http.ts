import { NextResponse } from "next/server";

export function redirectTo(
  request: Request,
  path: string,
  params: Record<string, string> = {},
): NextResponse {
  const rawHost =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "127.0.0.1:43147";
  const host = rawHost.replace(/^0\.0\.0\.0/, "127.0.0.1");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const url = new URL(path, `${proto}://${host}/`);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return NextResponse.redirect(url, 303);
}
