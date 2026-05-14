/**
 * @module auth
 * @provider clerk (default) | null (when unconfigured)
 * @requires none — auth is a foundation module
 * @optional db — needed for user records and session persistence
 * @install npx deploydash add auth
 * @env CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 *
 * Auth adapter public export.
 * The rest of the app imports from here — never from providers directly.
 *
 * Active provider is selected at module load time based on isConfigured.auth().
 * If Clerk keys are present → clerkAuthAdapter (full auth)
 * If Clerk keys are missing → nullAuthAdapter (safe no-ops, graceful degradation)
 *
 * To swap providers: change the import and assignment below.
 * Zero other changes needed anywhere in the app.
 */

import { isConfigured } from "@/lib/setup"

import { clerkAuthAdapter } from "./providers/clerk"
import { nullAuthAdapter } from "./providers/null"
import type { AuthAdapter, Session, User } from "./types"

export const auth: AuthAdapter = isConfigured.auth()
  ? clerkAuthAdapter
  : nullAuthAdapter

export type { AuthAdapter, Session, User }
export { hasRole, isAdmin, ROLES } from "./roles"
export type { Role } from "./roles"