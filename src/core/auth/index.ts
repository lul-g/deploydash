/**
 * Auth adapter public export.
 * The rest of the app imports from here — never from providers directly.
 * To swap providers: change the import below. Zero other changes needed.
 * If auth is not configured, a null adapter is exported — safe no-ops everywhere.
 */
import { isConfigured } from "@/lib/setup"
import { clerkAuthAdapter } from "./providers/clerk"
import { nullAuthAdapter } from "./providers/null"
import type { AuthAdapter, User, Session } from "./types"

export const auth: AuthAdapter = isConfigured.auth()
  ? clerkAuthAdapter
  : nullAuthAdapter

export type { AuthAdapter, User, Session }
export { ROLES, hasRole, isAdmin } from "./roles"
export type { Role } from "./roles"