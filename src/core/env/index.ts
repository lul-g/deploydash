/**
 * Environment variable schema and validation for DeployDash.
 *
 * Single source of truth for all environment variables.
 * Every variable must be declared here before use anywhere in the app.
 *
 * Rules:
 * - Never use process.env directly outside this file
 * - Server vars are never exposed to the client
 * - Client vars must be prefixed with NEXT_PUBLIC_
 * - Provider vars are optional here — the CLI makes them required in generated projects
 *
 * Adding a new variable:
 * 1. Add to server{} or client{}
 * 2. Add to runtimeEnv{}
 * 3. Add to .env.example with a fake value
 * 4. Add real value to .env.local
 */

import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),

    // Auth — Clerk (optional here, required in generated projects that use auth)
    CLERK_SECRET_KEY: z.string().min(1).optional(),

    // Database (optional here, required in generated projects that use db)
    DATABASE_URL: z.string().url().optional(),

    // Billing — Stripe (optional here, required in generated projects that use billing)
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

    // Email — Resend (optional here, required in generated projects that use email)
    RESEND_API_KEY: z.string().min(1).optional(),
  },
  client: {
    // Auth — Clerk public key
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),

    // Analytics — PostHog
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  },
  runtimeEnv: {
    // process.env is used directly here — this is the ONE legitimate exception
    // in the entire codebase. t3-env reads process.env to validate and expose
    // typed values. Every other file imports from @/core/env instead.
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.NODE_ENV === "test" ||
    typeof window !== "undefined",
})