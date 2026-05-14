import { isConfigured } from "@/lib/setup"
import { authMiddleware } from "@/core/auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest, NextFetchEvent } from "next/server"

/**
 * Next.js middleware entry point.
 * If auth is configured — runs full auth middleware.
 * If auth is not configured — passes all requests through.
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