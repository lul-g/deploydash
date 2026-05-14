import { describe, it, expect } from "vitest"
import { nullRatelimitAdapter } from "@/core/ratelimit/providers/null"

describe("nullRatelimitAdapter", () => {
  describe("interface contract", () => {
    it("is defined", () => {
      expect(nullRatelimitAdapter).toBeDefined()
    })

    it("exposes limit method", () => {
      expect(typeof nullRatelimitAdapter.limit).toBe("function")
    })
  })

  describe("limit", () => {
    describe("when ratelimit is not configured", () => {
      it("always returns success true", async () => {
        const result = await nullRatelimitAdapter.limit("user_123")
        expect(result.success).toBe(true)
      })

      it("never throws for any identifier", async () => {
        await expect(
          nullRatelimitAdapter.limit("user_123")
        ).resolves.not.toThrow()
        await expect(
          nullRatelimitAdapter.limit("")
        ).resolves.not.toThrow()
        await expect(
          nullRatelimitAdapter.limit("a".repeat(1000))
        ).resolves.not.toThrow()
      })

      it("returns correct response shape", async () => {
        const result = await nullRatelimitAdapter.limit("user_123")
        expect(result).toHaveProperty("success")
        expect(result).toHaveProperty("limit")
        expect(result).toHaveProperty("remaining")
        expect(result).toHaveProperty("reset")
      })

      it("success is always boolean", async () => {
        const result = await nullRatelimitAdapter.limit("user_123")
        expect(typeof result.success).toBe("boolean")
      })

      it("limit is Infinity — no cap applied", async () => {
        const result = await nullRatelimitAdapter.limit("user_123")
        expect(result.limit).toBe(Infinity)
      })

      it("remaining is Infinity — never runs out", async () => {
        const result = await nullRatelimitAdapter.limit("user_123")
        expect(result.remaining).toBe(Infinity)
      })

      it("reset is 0 — no window to reset", async () => {
        const result = await nullRatelimitAdapter.limit("user_123")
        expect(result.reset).toBe(0)
      })

      it("returns same result for different identifiers", async () => {
        const result1 = await nullRatelimitAdapter.limit("user_123")
        const result2 = await nullRatelimitAdapter.limit("user_456")
        expect(result1.success).toBe(result2.success)
      })

      it("never blocks any request regardless of call count", async () => {
        const results = await Promise.all(
          Array.from({ length: 100 }, (_, i) =>
            nullRatelimitAdapter.limit(`user_${i}`)
          )
        )
        expect(results.every((r) => r.success)).toBe(true)
      })
    })
  })
})