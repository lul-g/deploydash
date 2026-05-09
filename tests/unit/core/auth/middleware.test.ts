import { describe, it, expect } from "vitest"

describe("routeConfig", () => {
  it("is defined", async () => {
    const { routeConfig } = await import("@/config/routes")
    expect(routeConfig).toBeDefined()
  })

  it("has publicRoutes array", async () => {
    const { routeConfig } = await import("@/config/routes")
    expect(Array.isArray(routeConfig.publicRoutes)).toBe(true)
  })

  it("has adminRoutes array", async () => {
    const { routeConfig } = await import("@/config/routes")
    expect(Array.isArray(routeConfig.adminRoutes)).toBe(true)
  })

  it("sign-in is a public route", async () => {
    const { routeConfig } = await import("@/config/routes")
    expect(routeConfig.publicRoutes.some(r => r.includes("sign-in"))).toBe(true)
  })

  it("sign-up is a public route", async () => {
    const { routeConfig } = await import("@/config/routes")
    expect(routeConfig.publicRoutes.some(r => r.includes("sign-up"))).toBe(true)
  })

  it("admin routes require admin role", async () => {
    const { routeConfig } = await import("@/config/routes")
    expect(routeConfig.adminRoutes.some(r => r.includes("admin"))).toBe(true)
  })
})