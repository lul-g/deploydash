/**
 * @module ratelimit/providers/upstash
 * @provider upstash
 * @requires none — this IS the ratelimit provider
 * @install npx deploydash add ratelimit
 * @env UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 *
 * Upstash Redis implementation of the RatelimitAdapter interface.
 * Only file in the codebase that imports from @upstash/ratelimit.
 * To swap providers, replace this file only.
 */

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

import { env } from "@/core/env"
import { AppError } from "@/lib/errors"
import type { RatelimitAdapter, RatelimitResponse } from "../../types"

/**
 * Rate limit tiers — different limits for different route types.
 * Adjust these values based on your app's requirements.
 */
export const RATE_LIMIT_TIERS = {
  /** Auth routes — strictest: 5 requests per minute */
  auth: new Ratelimit({
    redis: new Redis({
      url: env.UPSTASH_REDIS_REST_URL ?? "",
      token: env.UPSTASH_REDIS_REST_TOKEN ?? "",
    }),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "deploydash:auth",
  }),
  /** Mutation routes — moderate: 30 per minute */
  mutation: new Ratelimit({
    redis: new Redis({
      url: env.UPSTASH_REDIS_REST_URL ?? "",
      token: env.UPSTASH_REDIS_REST_TOKEN ?? "",
    }),
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "deploydash:mutation",
  }),
  /** Public routes — lenient: 60 per minute */
  api: new Ratelimit({
    redis: new Redis({
      url: env.UPSTASH_REDIS_REST_URL ?? "",
      token: env.UPSTASH_REDIS_REST_TOKEN ?? "",
    }),
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    prefix: "deploydash:api",
  }),
} as const

export type RateLimitTier = keyof typeof RATE_LIMIT_TIERS

/**
 * Default ratelimit adapter — uses the api tier.
 * For specific tiers import RATE_LIMIT_TIERS directly.
 */
export const upstashRatelimitAdapter: RatelimitAdapter = {
  limit: async (identifier: string): Promise<RatelimitResponse> => {
    if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
      throw new AppError(
        "INTERNAL_ERROR",
        "Rate limiting is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local"
      )
    }

    const result = await RATE_LIMIT_TIERS.api.limit(identifier)
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }
  },
}