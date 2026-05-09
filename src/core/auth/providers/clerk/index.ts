import { auth, currentUser } from "@clerk/nextjs/server"

import { AppError } from "@/lib/errors"
import { isConfigured } from "@/lib/setup"

import type { AuthAdapter, User, Session } from "../../types"

/**
 * Maps a Clerk user object to DeployDash's provider-agnostic User type.
 * This is the translation layer — update here if Clerk changes their API.
 * Never let Clerk's User type leak outside this file.
 */
function mapClerkUser(clerkUser: Awaited<ReturnType<typeof currentUser>>): User {
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
 * Only file in the codebase that imports from @clerk/nextjs/server.
 * To swap auth providers, replace this file only.
 */
export const clerkAuthAdapter: AuthAdapter = {
  /**
   * Returns the current user or null.
   * Never throws — safe for public pages.
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
   * Returns the current user or throws UNAUTHORIZED.
   * Use on protected routes and server actions.
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
   */
  getSession: async (): Promise<Session | null> => {
    if (!isConfigured.auth()) return null

    try {
      const { userId, sessionId } = await auth()
      if (!userId || !sessionId) return null

      return {
        userId,
        sessionId,
        expiresAt: null, // Clerk manages expiry internally
      }
    } catch {
      return null
    }
  },

  /**
   * Returns just the user ID or null.
   * Lighter than getUser() — use when you only need the ID.
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