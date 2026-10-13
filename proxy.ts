import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["it", "en"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
    return NextResponse.next();
  }

  const language = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const locale = language.startsWith("en") ? "en" : "it";
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
