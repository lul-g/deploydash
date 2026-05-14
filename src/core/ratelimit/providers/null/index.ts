/**
 * @module ratelimit/providers/null
 * @provider null — no-op adapter for projects without rate limiting
 * @install automatic — used when ratelimit is not configured
 * @env none
 *
 * Null ratelimit adapter.
 * Always returns success:true — no limiting applied.
 * Used when Upstash is not configured or in test environments.
 */

import type { RatelimitAdapter, RatelimitResponse } from "../../types"

export const nullRatelimitAdapter: RatelimitAdapter = {
  limit: async (_identifier: string): Promise<RatelimitResponse> => ({
    success: true,
    limit: Infinity,
    remaining: Infinity,
    reset: 0,
  }),
}