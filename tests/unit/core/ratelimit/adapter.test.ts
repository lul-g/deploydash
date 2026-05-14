import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("ratelimit", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("interface contract", () => {
    it("is defined", async () => {
      const { ratelimit } = await import("@/core/ratelimit")
      expect(ratelimit).toBeDefined()
    })

    it("exposes limit method", async () => {
      const { ratelimit } = await import("@/core/ratelimit")
      expect(typeof ratelimit.limit).toBe("function")
    })
  })
})

describe("upstashRatelimitAdapter", () => {
  describe("interface contract", () => {
    it("is defined", async () => {
      const { upstashRatelimitAdapter } = await import(
        "@/core/ratelimit/providers/upstash"
      )
      expect(upstashRatelimitAdapter).toBeDefined()
    })

    it("exposes limit method", async () => {
      const { upstashRatelimitAdapter } = await import(
        "@/core/ratelimit/providers/upstash"
      )
      expect(typeof upstashRatelimitAdapter.limit).toBe("function")
    })
  })
})

describe("nullRatelimitAdapter", () => {
  describe("when ratelimit is not configured", () => {
    it("limit always returns success true", async () => {
      const { nullRatelimitAdapter } = await import(
        "@/core/ratelimit/providers/null"
      )
      const result = await nullRatelimitAdapter.limit("test-identifier")
      expect(result.success).toBe(true)
    })

    it("limit never throws", async () => {
      const { nullRatelimitAdapter } = await import(
        "@/core/ratelimit/providers/null"
      )
      await expect(
        nullRatelimitAdapter.limit("test-identifier")
      ).resolves.not.toThrow()
    })

    it("returns expected response shape", async () => {
      const { nullRatelimitAdapter } = await import(
        "@/core/ratelimit/providers/null"
      )
      const result = await nullRatelimitAdapter.limit("test-identifier")
      expect(result).toHaveProperty("success")
      expect(result).toHaveProperty("limit")
      expect(result).toHaveProperty("remaining")
      expect(result).toHaveProperty("reset")
    })
  })
})