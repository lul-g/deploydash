/**
 * Auth adapter public export.
 * The rest of the app imports from here — never from providers directly.
 * To swap providers: change the import below. Zero other changes needed.
 */
export { clerkAuthAdapter as auth } from "./providers/clerk"
export type { AuthAdapter, User, Session } from "./types"
export { ROLES, hasRole, isAdmin } from "./roles"
export type { Role } from "./roles"