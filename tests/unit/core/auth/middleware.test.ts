import { describe, it, expect } from "vitest"
import { routeConfig } from "@/config/routes"

describe("routeConfig", () => {
  describe("structure", () => {
    it("is defined", () => {
      expect(routeConfig).toBeDefined()
    })

    it("publicRoutes is an array", () => {
      expect(Array.isArray(routeConfig.publicRoutes)).toBe(true)
    })

    it("adminRoutes is an array", () => {
      expect(Array.isArray(routeConfig.adminRoutes)).toBe(true)
    })

    it("signInUrl is a string", () => {
      expect(typeof routeConfig.signInUrl).toBe("string")
    })

    it("afterSignInUrl is a string", () => {
      expect(typeof routeConfig.afterSignInUrl).toBe("string")
    })

    it("afterSignUpUrl is a string", () => {
      expect(typeof routeConfig.afterSignUpUrl).toBe("string")
    })
  })

  describe("publicRoutes", () => {
    it("includes the home route", () => {
      expect(routeConfig.publicRoutes).toContain("/")
    })

    it("includes sign-in", () => {
      expect(
        routeConfig.publicRoutes.some((r) => r.includes("sign-in"))
      ).toBe(true)
    })

    it("includes sign-up", () => {
      expect(
        routeConfig.publicRoutes.some((r) => r.includes("sign-up"))
      ).toBe(true)
    })

    it("includes health check endpoint", () => {
      expect(routeConfig.publicRoutes).toContain("/api/health")
    })

    it("includes webhook routes — verified by signature not session", () => {
      expect(
        routeConfig.publicRoutes.some((r) => r.includes("webhooks"))
      ).toBe(true)
    })

    it("includes blog routes", () => {
      expect(
        routeConfig.publicRoutes.some((r) => r.includes("blog"))
      ).toBe(true)
    })

    it("includes docs routes", () => {
      expect(
        routeConfig.publicRoutes.some((r) => r.includes("docs"))
      ).toBe(true)
    })

    it("includes pricing route", () => {
      expect(routeConfig.publicRoutes).toContain("/pricing")
    })

    it("does not include dashboard — dashboard requires auth", () => {
      expect(
        routeConfig.publicRoutes.some((r) => r.includes("dashboard"))
      ).toBe(false)
    })

    it("does not include admin — admin requires role", () => {
      expect(
        routeConfig.publicRoutes.some((r) => r.includes("admin"))
      ).toBe(false)
    })
  })

  describe("adminRoutes", () => {
    it("includes admin route pattern", () => {
      expect(
        routeConfig.adminRoutes.some((r) => r.includes("admin"))
      ).toBe(true)
    })

    it("is not empty — at least one admin route is defined", () => {
      expect(routeConfig.adminRoutes.length).toBeGreaterThan(0)
    })
  })

  describe("redirect urls", () => {
    it("signInUrl starts with /", () => {
      expect(routeConfig.signInUrl.startsWith("/")).toBe(true)
    })

    it("afterSignInUrl starts with /", () => {
      expect(routeConfig.afterSignInUrl.startsWith("/")).toBe(true)
    })

    it("afterSignUpUrl starts with /", () => {
      expect(routeConfig.afterSignUpUrl.startsWith("/")).toBe(true)
    })

    it("afterSignUpUrl points to onboarding — new users go through onboarding", () => {
      expect(routeConfig.afterSignUpUrl).toContain("onboarding")
    })

    it("afterSignInUrl points to dashboard — returning users go to dashboard", () => {
      expect(routeConfig.afterSignInUrl).toContain("dashboard")
    })
  })
})