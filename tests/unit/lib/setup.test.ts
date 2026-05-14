import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("isConfigured", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("auth", () => {
    describe("when both Clerk keys are present", () => {
      it("returns true", async () => {
        vi.doMock("@/core/env", () => ({
          env: {
            CLERK_SECRET_KEY: "sk_test_123",
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
          },
        }))
        const { isConfigured } = await import("@/lib/setup")
        expect(isConfigured.auth()).toBe(true)
      })
    })

    describe("when CLERK_SECRET_KEY is missing", () => {
      it("returns false", async () => {
        vi.doMock("@/core/env", () => ({
          env: {
            CLERK_SECRET_KEY: undefined,
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
          },
        }))
        const { isConfigured } = await import("@/lib/setup")
        expect(isConfigured.auth()).toBe(false)
      })
    })

    describe("when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing", () => {
      it("returns false", async () => {
        vi.doMock("@/core/env", () => ({
          env: {
            CLERK_SECRET_KEY: "sk_test_123",
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: undefined,
          },
        }))
        const { isConfigured } = await import("@/lib/setup")
        expect(isConfigured.auth()).toBe(false)
      })
    })

    describe("when both Clerk keys are missing", () => {
      it("returns false", async () => {
        vi.doMock("@/core/env", () => ({
          env: {
            CLERK_SECRET_KEY: undefined,
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: undefined,
          },
        }))
        const { isConfigured } = await import("@/lib/setup")
        expect(isConfigured.auth()).toBe(false)
      })
    })
  })

  describe("billing", () => {
    describe("when STRIPE_SECRET_KEY is present", () => {
      it("returns true", async () => {
        vi.doMock("@/core/env", () => ({
          env: { STRIPE_SECRET_KEY: "sk_test_123" },
        }))
        const { isConfigured } = await import("@/lib/setup")
        expect(isConfigured.billing()).toBe(true)
      })
    })

    describe("when STRIPE_SECRET_KEY is missing", () => {
      it("returns false", async () => {
        vi.doMock("@/core/env", () => ({
          env: { STRIPE_SECRET_KEY: undefined },
        }))
        const { isConfigured } = await import("@/lib/setup")
        expect(isConfigured.billing()).toBe(false)
      })
    })
  })

  describe("email", () => {
    describe("when RESEND_API_KEY is present", () => {
      it("returns true", async () => {
        vi.doMock("@/core/env", () => ({
          env: { RESEND_API_KEY: "re_test_123" },
        }))
        const { isConfigured } = await import("@/lib/setup")
        expect(isConfigured.email()).toBe(true)
      })
    })

    describe("when RESEND_API_KEY is missing", () => {
      it("returns false", async () => {
        vi.doMock("@/core/env", () => ({
          env: { RESEND_API_KEY: undefined },
        }))
        const { isConfigured } = await import("@/lib/setup")
        expect(isConfigured.email()).toBe(false)
      })
    })
  })

  describe("db", () => {
    describe("when DATABASE_URL is present", () => {
      it("returns true", async () => {
        vi.doMock("@/core/env", () => ({
          env: { DATABASE_URL: "postgresql://localhost:5432/test" },
        }))
        const { isConfigured } = await import("@/lib/setup")
        expect(isConfigured.db()).toBe(true)
      })
    })

    describe("when DATABASE_URL is missing", () => {
      it("returns false", async () => {
        vi.doMock("@/core/env", () => ({
          env: { DATABASE_URL: undefined },
        }))
        const { isConfigured } = await import("@/lib/setup")
        expect(isConfigured.db()).toBe(false)
      })
    })
  })
})

describe("getMissingFeatures", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("when nothing is configured", () => {
    it("returns all feature names", async () => {
      vi.doMock("@/core/env", () => ({
        env: {},
      }))
      const { getMissingFeatures } = await import("@/lib/setup")
      const missing = getMissingFeatures()
      expect(missing).toContain("auth")
      expect(missing).toContain("database")
      expect(missing).toContain("billing")
      expect(missing).toContain("email")
      expect(missing).toContain("analytics")
    })
  })

  describe("when everything is configured", () => {
    it("returns empty array", async () => {
      vi.doMock("@/core/env", () => ({
        env: {
          CLERK_SECRET_KEY: "sk_test_123",
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
          DATABASE_URL: "postgresql://localhost:5432/test",
          STRIPE_SECRET_KEY: "sk_test_123",
          RESEND_API_KEY: "re_test_123",
          NEXT_PUBLIC_POSTHOG_KEY: "phc_test_123",
        },
      }))
      const { getMissingFeatures } = await import("@/lib/setup")
      expect(getMissingFeatures()).toHaveLength(0)
    })
  })

  describe("when only auth is missing", () => {
    it("returns only auth in missing list", async () => {
      vi.doMock("@/core/env", () => ({
        env: {
          CLERK_SECRET_KEY: undefined,
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: undefined,
          DATABASE_URL: "postgresql://localhost:5432/test",
          STRIPE_SECRET_KEY: "sk_test_123",
          RESEND_API_KEY: "re_test_123",
          NEXT_PUBLIC_POSTHOG_KEY: "phc_test_123",
        },
      }))
      const { getMissingFeatures } = await import("@/lib/setup")
      const missing = getMissingFeatures()
      expect(missing).toContain("auth")
      expect(missing).not.toContain("database")
      expect(missing).not.toContain("billing")
    })
  })
})

describe("getMissingEnvVars", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("when nothing is configured", () => {
    it("returns all env var names", async () => {
      vi.doMock("@/core/env", () => ({ env: {} }))
      const { getMissingEnvVars } = await import("@/lib/setup")
      const missing = getMissingEnvVars()
      expect(missing).toContain("CLERK_SECRET_KEY")
      expect(missing).toContain("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
      expect(missing).toContain("DATABASE_URL")
      expect(missing).toContain("STRIPE_SECRET_KEY")
      expect(missing).toContain("RESEND_API_KEY")
      expect(missing).toContain("NEXT_PUBLIC_POSTHOG_KEY")
    })
  })

  describe("when everything is configured", () => {
    it("returns empty array", async () => {
      vi.doMock("@/core/env", () => ({
        env: {
          CLERK_SECRET_KEY: "sk_test_123",
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
          DATABASE_URL: "postgresql://localhost:5432/test",
          STRIPE_SECRET_KEY: "sk_test_123",
          RESEND_API_KEY: "re_test_123",
          NEXT_PUBLIC_POSTHOG_KEY: "phc_test_123",
        },
      }))
      const { getMissingEnvVars } = await import("@/lib/setup")
      expect(getMissingEnvVars()).toHaveLength(0)
    })
  })
})