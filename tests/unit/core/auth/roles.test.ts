import { describe, it, expect } from "vitest"

describe("roles", () => {
  it("ROLES is defined", async () => {
    const { ROLES } = await import("@/core/auth/roles")
    expect(ROLES).toBeDefined()
  })

  it("ROLES has admin and user", async () => {
    const { ROLES } = await import("@/core/auth/roles")
    expect(ROLES.ADMIN).toBe("admin")
    expect(ROLES.USER).toBe("user")
  })

  it("hasRole returns true when user has role", async () => {
    const { hasRole } = await import("@/core/auth/roles")
    expect(hasRole("admin", "admin")).toBe(true)
    expect(hasRole("user", "user")).toBe(true)
  })

  it("hasRole returns false when user does not have role", async () => {
    const { hasRole } = await import("@/core/auth/roles")
    expect(hasRole("user", "admin")).toBe(false)
  })

  it("hasRole returns false for undefined role", async () => {
    const { hasRole } = await import("@/core/auth/roles")
    expect(hasRole(undefined, "admin")).toBe(false)
  })
})