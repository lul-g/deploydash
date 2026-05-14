import { describe, it, expect } from "vitest"
import { ROLES, hasRole, isAdmin } from "@/core/auth/roles"

describe("ROLES", () => {
  describe("constants", () => {
    it("defines admin role as 'admin'", () => {
      expect(ROLES.ADMIN).toBe("admin")
    })

    it("defines user role as 'user'", () => {
      expect(ROLES.USER).toBe("user")
    })

    it("is defined and not null", () => {
      expect(ROLES).toBeDefined()
      expect(ROLES).not.toBeNull()
    })
  })
})

describe("hasRole", () => {
  describe("when user has the required role", () => {
    it("returns true for admin role", () => {
      expect(hasRole("admin", ROLES.ADMIN)).toBe(true)
    })

    it("returns true for user role", () => {
      expect(hasRole("user", ROLES.USER)).toBe(true)
    })
  })

  describe("when user does not have the required role", () => {
    it("returns false when user role does not match required role", () => {
      expect(hasRole("user", ROLES.ADMIN)).toBe(false)
    })

    it("returns false when admin tries to match user role", () => {
      expect(hasRole("admin", ROLES.USER)).toBe(false)
    })
  })

  describe("when user role is missing or invalid", () => {
    it("returns false for undefined — unauthenticated user", () => {
      expect(hasRole(undefined, ROLES.ADMIN)).toBe(false)
    })

    it("returns false for empty string", () => {
      expect(hasRole("", ROLES.ADMIN)).toBe(false)
    })

    it("is case sensitive — Admin does not match admin", () => {
      expect(hasRole("Admin", ROLES.ADMIN)).toBe(false)
    })

    it("is case sensitive — ADMIN does not match admin", () => {
      expect(hasRole("ADMIN", ROLES.ADMIN)).toBe(false)
    })
  })

  describe("error safety", () => {
    it("never throws for undefined input", () => {
      expect(() => hasRole(undefined, ROLES.ADMIN)).not.toThrow()
    })

    it("never throws for empty string input", () => {
      expect(() => hasRole("", ROLES.ADMIN)).not.toThrow()
    })

    it("never throws for any string input", () => {
      expect(() => hasRole("random_value", ROLES.ADMIN)).not.toThrow()
    })
  })
})

describe("isAdmin", () => {
  describe("when user has admin role", () => {
    it("returns true", () => {
      expect(isAdmin("admin")).toBe(true)
    })
  })

  describe("when user does not have admin role", () => {
    it("returns false for user role", () => {
      expect(isAdmin("user")).toBe(false)
    })

    it("returns false for undefined — unauthenticated user", () => {
      expect(isAdmin(undefined)).toBe(false)
    })

    it("returns false for empty string", () => {
      expect(isAdmin("")).toBe(false)
    })

    it("is case sensitive — Admin does not match admin", () => {
      expect(isAdmin("Admin")).toBe(false)
    })
  })

  describe("error safety", () => {
    it("never throws for any input", () => {
      expect(() => isAdmin(undefined)).not.toThrow()
      expect(() => isAdmin("")).not.toThrow()
      expect(() => isAdmin("random")).not.toThrow()
    })
  })
})