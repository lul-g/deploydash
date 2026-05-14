/**
 * @module auth/providers/clerk
 * @provider clerk
 * @requires none — this IS the auth provider
 * @install npx deploydash add auth
 * @env CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
 *
 * Clerk implementation of the DeployDash AuthAdapter interface.
 *
 * Rules:
 * - This is the ONLY file in the codebase that imports from @clerk/nextjs/server
 * - Never let Clerk types leak outside this file — map everything to DeployDash types
 * - To swap auth providers, replace this file only — zero other changes needed
 * - Every method checks isConfigured.auth() first for graceful degradation
 */

import { auth, currentUser } from "@clerk/nextjs/server"

import { AppError } from "@/lib/errors"
import { isConfigured } from "@/lib/setup"

import type { AuthAdapter, Session, User } from "../../types"

/**
 * Maps a Clerk user object to DeployDash's provider-agnostic User type.
 *
 * This is the translation layer between Clerk and the rest of the app.
 * If Clerk changes their User API, update this function only.
 * Never import or use Clerk's User type outside this file.
 *
 * @param clerkUser - the raw Clerk user object from currentUser()
 * @throws AppError UNAUTHORIZED if clerkUser is null
 */
function mapClerkUser(
  clerkUser: Awaited<ReturnType<typeof currentUser>>
): User {
  if (!clerkUser) throw new AppError("UNAUTHORIZED", "No user found")

  return {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
    role: clerkUser.publicMetadata?.role as string | undefined,
    createdAt: new Date(clerkUser.createdAt),
  }
}

/**
 * Clerk implementation of the AuthAdapter interface.
 * Exported and consumed by src/core/auth/index.ts only.
 */
export const clerkAuthAdapter: AuthAdapter = {
  /**
   * Returns the current user or null.
   * Never throws — safe to call on public pages.
   * Returns null if auth is not configured or user is not authenticated.
   */
  getUser: async (): Promise<User | null> => {
    if (!isConfigured.auth()) return null

    try {
      const clerkUser = await currentUser()
      if (!clerkUser) return null
      return mapClerkUser(clerkUser)
    } catch {
      return null
    }
  },

  /**
   * Returns the current user or throws.
   * Use on protected routes and server actions — never on public pages.
   *
   * @throws AppError INTERNAL_ERROR if auth is not configured
   * @throws AppError UNAUTHORIZED if user is not authenticated
   */
  requireAuth: async (): Promise<User> => {
    if (!isConfigured.auth()) {
      throw new AppError(
        "INTERNAL_ERROR",
        "Auth is not configured. Add CLERK_SECRET_KEY to .env.local"
      )
    }

    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new AppError("UNAUTHORIZED", "Authentication required")
    }

    return mapClerkUser(clerkUser)
  },

  /**
   * Returns the current session or null.
   * Use when you need session metadata beyond the user object.
   * Returns null if auth is not configured or no active session exists.
   */
  getSession: async (): Promise<Session | null> => {
    if (!isConfigured.auth()) return null

    try {
      const { userId, sessionId } = await auth()
      if (!userId || !sessionId) return null

      return {
        userId,
        sessionId,
        expiresAt: null, // Clerk manages session expiry internally
      }
    } catch {
      return null
    }
  },

  /**
   * Returns just the user ID or null.
   * Lighter than getUser() — use when you only need the ID, not the full user.
   * Returns null if auth is not configured or no active session exists.
   */
  getUserId: async (): Promise<string | null> => {
    if (!isConfigured.auth()) return null

    try {
      const { userId } = await auth()
      return userId
    } catch {
      return null
    }
  },

  /**
   * Returns true if the current user has the specified role.
   * Never throws — returns false if not authenticated or not configured.
   * Role is read from Clerk's publicMetadata.role field.
   *
   * @param role - the role to check against (use ROLES constants)
   */
  hasRole: async (role: string): Promise<boolean> => {
    if (!isConfigured.auth()) return false

    try {
      const clerkUser = await currentUser()
      if (!clerkUser) return false
      const userRole = clerkUser.publicMetadata?.role as string | undefined
      return userRole === role
    } catch {
      return false
    }
  },
}