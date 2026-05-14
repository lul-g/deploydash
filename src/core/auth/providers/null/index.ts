import type { AuthAdapter } from "../../types"

/**
 * Null auth adapter — used when auth is not configured.
 * Every method returns a safe no-op value.
 * Never throws. Never redirects.
 * Generated projects without auth get this adapter automatically.
 */
export const nullAuthAdapter: AuthAdapter = {
  getUser: async () => null,
  requireAuth: async () => {
    throw new Error(
      "Auth is not configured. Add an auth provider via npx deploydash add auth."
    )
  },
  getSession: async () => null,
  getUserId: async () => null,
  hasRole: async () => false,
}