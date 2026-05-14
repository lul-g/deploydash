/**
 * @module ratelimit
 * @provider upstash (default) | null (when unconfigured)
 * @requires none — ratelimit is a foundation module
 * @install npx deploydash add ratelimit
 * @env UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 *
 * Ratelimit adapter public export.
 * The rest of the app imports from here — never from providers directly.
 *
 * If Upstash is configured → upstashRatelimitAdapter
 * If Upstash is missing → nullRatelimitAdapter (no limiting applied)
 */

import { isConfigured } from "@/lib/setup"

import { upstashRatelimitAdapter } from "./providers/upstash"
import { nullRatelimitAdapter } from "./providers/null"
import type { RatelimitAdapter, RatelimitResponse } from "./types"

export const ratelimit: RatelimitAdapter = isConfigured.ratelimit()
  ? upstashRatelimitAdapter
  : nullRatelimitAdapter

export { RATE_LIMIT_TIERS } from "./providers/upstash"
export type { RatelimitAdapter, RatelimitResponse, RatelimitTier } from "./types"