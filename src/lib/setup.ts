/**
 * Setup detection utilities.
 * Checks whether provider env vars are configured at runtime.
 * Used by SetupBanner (dev) and adapters (prod) to handle missing config gracefully.
 * Never throws — returns boolean only.
 */

export const isConfigured = {
    /**
     * Returns true if Clerk auth keys are present.
     * Required for: sign-in, sign-up, dashboard, admin, billing, onboarding.
     */
    auth: (): boolean =>
      !!process.env.CLERK_SECRET_KEY &&
      !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  
    /**
     * Returns true if Stripe keys are present.
     * Required for: billing module, subscription gating.
     */
    billing: (): boolean => !!process.env.STRIPE_SECRET_KEY,
  
    /**
     * Returns true if Resend API key is present.
     * Required for: email flows, waitlist notifications, onboarding emails.
     */
    email: (): boolean => !!process.env.RESEND_API_KEY,
  
    /**
     * Returns true if database URL is present.
     * Required for: all data persistence, every feature module.
     */
    db: (): boolean => !!process.env.DATABASE_URL,
  
    /**
     * Returns true if PostHog key is present.
     * Required for: analytics, user tracking.
     */
    analytics: (): boolean => !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
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
   * Returns a list of missing env var names with instructions.
   * Used by SetupBanner to show exactly what to add to .env.local.
   */
  export function getMissingEnvVars(): string[] {
    const missing: string[] = []
    if (!process.env.CLERK_SECRET_KEY)
      missing.push("CLERK_SECRET_KEY")
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
      missing.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
    if (!process.env.DATABASE_URL)
      missing.push("DATABASE_URL")
    if (!process.env.STRIPE_SECRET_KEY)
      missing.push("STRIPE_SECRET_KEY")
    if (!process.env.RESEND_API_KEY)
      missing.push("RESEND_API_KEY")
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY)
      missing.push("NEXT_PUBLIC_POSTHOG_KEY")
    return missing
  }