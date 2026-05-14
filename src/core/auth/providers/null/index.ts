/**
 * @module auth/providers/null
 * @provider null — no-op adapter for projects without auth
 * @install automatic — used when auth is not configured
 * @env none
 *
 * Null auth adapter — used when auth is not configured.
 *
 * Every method returns a safe default value — no throws, no redirects,
 * no side effects. This adapter is selected automatically by src/core/auth/index.ts
 * when Clerk keys are missing from the environment.
 *
 * Generated projects that do not include auth get this adapter by default,
 * allowing public pages to function without any auth configuration.
 */

import { AppError } from "@/lib/errors"

import type { AuthAdapter } from "../../types"

export const nullAuthAdapter: AuthAdapter = {
  /**
   * Always returns null — no user is ever authenticated without auth configured.
   */
  getUser: async () => null,

  /**
   * Always throws INTERNAL_ERROR — requireAuth must never be called
   * in a project without auth configured.
   *
   * @throws AppError INTERNAL_ERROR with instructions to add auth
   */
  requireAuth: async () => {
    throw new AppError(
      "INTERNAL_ERROR",
      "Auth is not configured. Add an auth provider via npx deploydash add auth."
    )
  },

  /**
   * Always returns null — no session exists without auth configured.
   */
  getSession: async () => null,

  /**
   * Always returns null — no user ID exists without auth configured.
   */
  getUserId: async () => null,

  /**
   * Always returns false — no roles exist without auth configured.
   */
  hasRole: async () => false,
}