import { describe, it, expect, vi, beforeEach } from "vitest"

describe("isConfigured", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("auth returns false when clerk keys are missing", async () => {
    vi.stubEnv("CLERK_SECRET_KEY", "")
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "")
    const { isConfigured } = await import("@/lib/setup")
    expect(isConfigured.auth()).toBe(false)
  })

  it("auth returns true when clerk keys are present", async () => {
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_123")
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_123")
    const { isConfigured } = await import("@/lib/setup")
    expect(isConfigured.auth()).toBe(true)
  })

  it("billing returns false when stripe key is missing", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "")
    const { isConfigured } = await import("@/lib/setup")
    expect(isConfigured.billing()).toBe(false)
  })

  it("billing returns true when stripe key is present", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_123")
    const { isConfigured } = await import("@/lib/setup")
    expect(isConfigured.billing()).toBe(true)
  })

  it("email returns false when resend key is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "")
    const { isConfigured } = await import("@/lib/setup")
    expect(isConfigured.email()).toBe(false)
  })

  it("db returns false when database url is missing", async () => {
    vi.stubEnv("DATABASE_URL", "")
    const { isConfigured } = await import("@/lib/setup")
    expect(isConfigured.db()).toBe(false)
  })
})