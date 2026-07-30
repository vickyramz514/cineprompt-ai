import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MAINTENANCE_PAGE_PATH } from "@/lib/maintenance";

function maintenanceEnabled() {
  const flag =
    process.env.MAINTENANCE_MODE ?? process.env.NEXT_PUBLIC_MAINTENANCE_MODE ?? "";
  return ["1", "true", "yes", "on"].includes(flag.trim().toLowerCase());
}

/** Paths that stay reachable during maintenance (page itself + health/status assets). */
const ALLOWED_PREFIXES = [
  MAINTENANCE_PAGE_PATH,
  "/status",
  "/favicon",
  "/icons",
  "/logo",
  "/donation",
  "/_next",
  "/icon",
  "/apple-icon",
];

export function middleware(request: NextRequest) {
  if (!maintenanceEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // Allow static files with extensions (images, robots, etc.)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = MAINTENANCE_PAGE_PATH;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
