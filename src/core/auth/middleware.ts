import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

import { routeConfig } from "@/config/routes"
import { ROLES } from "@/core/auth/roles"
import { isConfigured } from "@/lib/setup"

const isPublicRoute = createRouteMatcher(routeConfig.publicRoutes)
const isAdminRoute = createRouteMatcher(routeConfig.adminRoutes)

/**
 * DeployDash auth middleware.
 * Runs on every request that matches the matcher in src/middleware.ts.
 * Reads route config from src/config/routes.ts — edit that file, not this one.
 *
 * Flow:
 * 1. If auth is not configured → allow all (graceful degradation)
 * 2. If public route → let through
 * 3. If admin route → require admin role
 * 4. Everything else → require authentication
 */
export const authMiddleware = clerkMiddleware(async (auth, req) => {
  // graceful degradation — if auth not configured, allow all requests
  if (!isConfigured.auth()) return

  // public routes — no auth needed
  if (isPublicRoute(req)) return

  // admin routes — require admin role
  if (isAdminRoute(req)) {
    await auth.protect((has) =>
      has({ role: ROLES.ADMIN })
    )
    return
  }

  // everything else — require authentication
  await auth.protect()
})