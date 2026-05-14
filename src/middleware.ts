import { NextResponse } from "next/server"
import type { NextRequest, NextFetchEvent } from "next/server"

import { authMiddleware } from "@/core/auth/middleware"
import { isConfigured } from "@/lib/setup"

/**
 * Next.js middleware entry point — runs on every matched request.
 *
 * If auth is configured → runs full auth middleware (Clerk).
 * If auth is not configured → passes all requests through (graceful degradation).
 *
 * Matcher excludes:
 * - _next/static — compiled JS/CSS assets
 * - _next/image — Next.js image optimization
 * - favicon.ico — browser favicon request
 * - public/ — static files in /public directory
 *
 * To protect or expose routes, edit src/config/routes.ts — never edit this file.
 */
export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!isConfigured.auth()) {
    return NextResponse.next()
  }

  return authMiddleware(req, event)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}