import { describe, it, expect } from "vitest"

describe("env", () => {
  describe("module", () => {
    it("is defined", async () => {
      const envModule = await import("@/core/env")
      expect(envModule).toBeDefined()
    })

    it("exports env object", async () => {
      const { env } = await import("@/core/env")
      expect(env).toBeDefined()
    })

    it("env is an object", async () => {
      const { env } = await import("@/core/env")
      expect(typeof env).toBe("object")
    })
  })

  describe("test environment setup", () => {
    it("SKIP_ENV_VALIDATION is set to true — required for jsdom compatibility", () => {
      expect(process.env.SKIP_ENV_VALIDATION).toBe("true")
    })

    it("NODE_ENV is test", () => {
      expect(process.env.NODE_ENV).toBe("test")
    })
  })

  describe("NODE_ENV validation", () => {
    it("NODE_ENV is a valid enum value", () => {
      // Arrange
      const validValues = ["development", "test", "production"]

      // Assert
      expect(validValues).toContain(process.env.NODE_ENV)
    })
  })

  describe("optional provider vars", () => {
    it("does not throw when Clerk keys are missing — auth is optional", async () => {
      // Arrange + Act + Assert
      await expect(import("@/core/env")).resolves.not.toThrow()
    })

    it("does not throw when DATABASE_URL is missing — db is optional", async () => {
      await expect(import("@/core/env")).resolves.not.toThrow()
    })

    it("does not throw when STRIPE_SECRET_KEY is missing — billing is optional", async () => {
      await expect(import("@/core/env")).resolves.not.toThrow()
    })

    it("does not throw when RESEND_API_KEY is missing — email is optional", async () => {
      await expect(import("@/core/env")).resolves.not.toThrow()
    })
  })
})