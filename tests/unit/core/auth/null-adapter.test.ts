import { describe, it, expect } from "vitest"
import { nullAuthAdapter } from "@/core/auth/providers/null"

describe("nullAuthAdapter", () => {
  describe("interface contract", () => {
    it("is defined", () => {
      expect(nullAuthAdapter).toBeDefined()
    })

    it("exposes getUser method", () => {
      expect(typeof nullAuthAdapter.getUser).toBe("function")
    })

    it("exposes requireAuth method", () => {
      expect(typeof nullAuthAdapter.requireAuth).toBe("function")
    })

    it("exposes getSession method", () => {
      expect(typeof nullAuthAdapter.getSession).toBe("function")
    })

    it("exposes getUserId method", () => {
      expect(typeof nullAuthAdapter.getUserId).toBe("function")
    })

    it("exposes hasRole method", () => {
      expect(typeof nullAuthAdapter.hasRole).toBe("function")
    })
  })

  describe("getUser", () => {
    describe("when auth is not configured", () => {
      it("returns null", async () => {
        const result = await nullAuthAdapter.getUser()
        expect(result).toBeNull()
      })

      it("never throws", async () => {
        await expect(nullAuthAdapter.getUser()).resolves.not.toThrow()
      })
    })
  })

  describe("requireAuth", () => {
    describe("when auth is not configured", () => {
      it("throws AppError with INTERNAL_ERROR code", async () => {
        await expect(nullAuthAdapter.requireAuth()).rejects.toMatchObject({
          code: "INTERNAL_ERROR",
        })
      })

      it("throws with a message containing setup instructions", async () => {
        await expect(nullAuthAdapter.requireAuth()).rejects.toMatchObject({
          message: expect.stringContaining("npx deploydash add auth"),
        })
      })

      it("throws an AppError not a plain Error", async () => {
        try {
          await nullAuthAdapter.requireAuth()
        } catch (error) {
          const { isAppError } = await import("@/lib/errors")
          expect(isAppError(error)).toBe(true)
        }
      })
    })
  })

  describe("getSession", () => {
    describe("when auth is not configured", () => {
      it("returns null", async () => {
        const result = await nullAuthAdapter.getSession()
        expect(result).toBeNull()
      })

      it("never throws", async () => {
        await expect(nullAuthAdapter.getSession()).resolves.not.toThrow()
      })
    })
  })

  describe("getUserId", () => {
    describe("when auth is not configured", () => {
      it("returns null", async () => {
        const result = await nullAuthAdapter.getUserId()
        expect(result).toBeNull()
      })

      it("never throws", async () => {
        await expect(nullAuthAdapter.getUserId()).resolves.not.toThrow()
      })
    })
  })

  describe("hasRole", () => {
    describe("when auth is not configured", () => {
      it("returns false for admin role", async () => {
        const result = await nullAuthAdapter.hasRole("admin")
        expect(result).toBe(false)
      })

      it("returns false for user role", async () => {
        const result = await nullAuthAdapter.hasRole("user")
        expect(result).toBe(false)
      })

      it("returns false for any role string", async () => {
        const result = await nullAuthAdapter.hasRole("any-role")
        expect(result).toBe(false)
      })

      it("returns false for empty string", async () => {
        const result = await nullAuthAdapter.hasRole("")
        expect(result).toBe(false)
      })

      it("never throws for any input", async () => {
        await expect(nullAuthAdapter.hasRole("admin")).resolves.not.toThrow()
        await expect(nullAuthAdapter.hasRole("")).resolves.not.toThrow()
        await expect(nullAuthAdapter.hasRole("random")).resolves.not.toThrow()
      })
    })
  })
})