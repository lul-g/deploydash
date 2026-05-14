/**
 * @module auth/types
 * @provider none — shared types, no external dependencies
 * @install npx deploydash add auth
 * @env none
 *
 * AuthAdapter interface and related types for DeployDash auth system.
 *
 * IMPORTANT: This interface is a public contract.
 * Once shipped, never remove or rename methods.
 * Adding new optional methods is safe.
 *
 * All types here are provider-agnostic — never import from @clerk/nextjs
 * or any other provider in this file.
 */

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  role: string | undefined
  createdAt: Date
}

export interface Session {
  userId: string
  sessionId: string
  expiresAt: Date | null
}

export interface AuthAdapter {
  /**
   * Returns the current user or null if not authenticated.
   * Never throws — use requireAuth() when auth is mandatory.
   * Safe to call on public pages.
   */
  getUser(): Promise<User | null>

  /**
   * Returns the current user or throws AppError UNAUTHORIZED if not authenticated.
   * Use this on protected routes and server actions.
   */
  requireAuth(): Promise<User>

  /**
   * Returns the current session or null if not authenticated.
   * Use when you need session metadata beyond just the user.
   */
  getSession(): Promise<Session | null>

  /**
   * Returns just the current user's ID or null.
   * Lighter than getUser() — use when you only need the ID.
   */
  getUserId(): Promise<string | null>

  /**
   * Returns true if the current user has the specified role.
   * Never throws — returns false if not authenticated.
   */
  hasRole(role: string): Promise<boolean>
}