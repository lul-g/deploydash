/**
 * @module auth/middleware
 * @provider clerk
 * @requires auth — Clerk must be configured for this middleware to run
 * @install npx deploydash add auth
 * @env CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 *
 * DeployDash auth middleware — Clerk implementation.
 * Runs on every request matched by the config in src/middleware.ts.
 *
 * Route protection is config-driven — edit src/config/routes.ts, never this file.
 *
 * Flow:
 * 1. Auth not configured → allow all requests (graceful degradation)
 * 2. Public route → let through, no auth check
 * 3. Admin route → require admin role, 403 if missing
 * 4. Everything else → require authentication, redirect to sign-in if missing
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

import { routeConfig } from "@/config/routes"
import { ROLES } from "@/core/auth/roles"
import { isConfigured } from "@/lib/setup"

// created at module load time, not inside the middleware function
// createRouteMatcher compiles regex patterns — doing this once at startup
// avoids recompiling on every request
const isPublicRoute = createRouteMatcher(routeConfig.publicRoutes)
const isAdminRoute = createRouteMatcher(routeConfig.adminRoutes)

export const authMiddleware = clerkMiddleware(async (auth, req) => {
  // graceful degradation — if Clerk is not configured, allow all requests through
  // public pages must work without auth configured
  if (!isConfigured.auth()) return

  // public routes — no auth needed
  if (isPublicRoute(req)) return

  // admin routes — require admin role
  // authenticated users without admin role get a 403
  if (isAdminRoute(req)) {
    await auth.protect((has) => has({ role: ROLES.ADMIN }))
    return
  }

  // everything else — require authentication
  // unauthenticated users are redirected to routeConfig.signInUrl
  await auth.protect()
})