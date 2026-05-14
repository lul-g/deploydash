/**
 * @module ratelimit/types
 * @provider none — shared types, no external dependencies
 * @install npx deploydash add ratelimit
 * @env none
 *
 * RatelimitAdapter interface for DeployDash.
 * Provider-agnostic — never import from @upstash/ratelimit here.
 */

export interface RatelimitResponse {
  /** Whether the request is allowed */
  success: boolean
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Remaining requests in the current window */
  remaining: number
  /** Unix timestamp in milliseconds when the window resets */
  reset: number
}

export interface RatelimitAdapter {
  /**
   * Checks and increments the rate limit for the given identifier.
   * Never throws — returns success:false when limit is exceeded.
   *
   * @param identifier - unique key (userId, IP address, email, etc.)
   */
  limit(identifier: string): Promise<RatelimitResponse>
}

/** Valid rate limit tiers — each tier has different request limits */
export type RatelimitTier = "auth" | "mutation" | "api"