/**
 * Setup detection utilities.
 *
 * Checks whether provider env vars are configured at runtime.
 * Used by SetupBanner (dev) and adapters (prod) to handle missing config gracefully.
 *
 * Reads from @/core/env — never from process.env directly.
 * Never throws — returns boolean only.
 * Never imports from modules — this is a foundation utility.
 */

import { env } from "@/core/env"

export const isConfigured = {
  /**
   * Returns true if Clerk auth keys are present.
   * Required for: sign-in, sign-up, dashboard, admin, billing, onboarding.
   */
  auth: (): boolean =>
    !!env.CLERK_SECRET_KEY && !!env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

  /**
   * Returns true if Stripe keys are present.
   * Required for: billing module, subscription gating.
   */
  billing: (): boolean => !!env.STRIPE_SECRET_KEY,

  /**
   * Returns true if Resend API key is present.
   * Required for: email flows, waitlist notifications, onboarding emails.
   */
  email: (): boolean => !!env.RESEND_API_KEY,

  /**
   * Returns true if database URL is present.
   * Required for: all data persistence, every feature module.
   */
  db: (): boolean => !!env.DATABASE_URL,

  /**
   * Returns true if PostHog key is present.
   * Required for: analytics, user tracking.
   */
  analytics: (): boolean => !!env.NEXT_PUBLIC_POSTHOG_KEY,

  /**
   * Returns true if Upstash Redis URL and token are present.
   * Required for: rate limiting.
   */
  ratelimit: (): boolean =>
    !!env.UPSTASH_REDIS_REST_URL && !!env.UPSTASH_REDIS_REST_TOKEN,
}

/**
 * Returns a list of feature names that are not yet configured.
 * Used by SetupBanner to show missing config in development.
 */
export function getMissingFeatures(): string[] {
  const missing: string[] = []
  if (!isConfigured.auth()) missing.push("auth")
  if (!isConfigured.db()) missing.push("database")
  if (!isConfigured.billing()) missing.push("billing")
  if (!isConfigured.email()) missing.push("email")
  if (!isConfigured.analytics()) missing.push("analytics")
  return missing
}

/**
 * Returns a list of missing env var names.
 * Used by SetupBanner to show exactly what to add to .env.local.
 */
export function getMissingEnvVars(): string[] {
  const missing: string[] = []
  if (!env.CLERK_SECRET_KEY) missing.push("CLERK_SECRET_KEY")
  if (!env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
    missing.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
  if (!env.DATABASE_URL) missing.push("DATABASE_URL")
  if (!env.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY")
  if (!env.RESEND_API_KEY) missing.push("RESEND_API_KEY")
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) missing.push("NEXT_PUBLIC_POSTHOG_KEY")
  return missing
}