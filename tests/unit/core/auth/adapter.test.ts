import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("clerkAuthAdapter", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("interface contract", () => {
    it("is defined", async () => {
      const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
      expect(clerkAuthAdapter).toBeDefined()
    })

    it("exposes getUser method", async () => {
      const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
      expect(typeof clerkAuthAdapter.getUser).toBe("function")
    })

    it("exposes requireAuth method", async () => {
      const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
      expect(typeof clerkAuthAdapter.requireAuth).toBe("function")
    })

    it("exposes getSession method", async () => {
      const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
      expect(typeof clerkAuthAdapter.getSession).toBe("function")
    })

    it("exposes getUserId method", async () => {
      const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
      expect(typeof clerkAuthAdapter.getUserId).toBe("function")
    })

    it("exposes hasRole method", async () => {
      const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
      expect(typeof clerkAuthAdapter.hasRole).toBe("function")
    })
  })

  describe("getUser", () => {
    describe("when auth is not configured", () => {
      it("returns null without throwing", async () => {
        // Arrange
        vi.doMock("@/lib/setup", () => ({
          isConfigured: { auth: () => false },
        }))

        // Act
        const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
        const user = await clerkAuthAdapter.getUser()

        // Assert
        expect(user).toBeNull()
      })
    })

    describe("when Clerk throws an error", () => {
      it("returns null instead of propagating the error", async () => {
        // Arrange
        vi.doMock("@/lib/setup", () => ({
          isConfigured: { auth: () => true },
        }))
        vi.doMock("@clerk/nextjs/server", () => ({
          auth: vi.fn(),
          currentUser: vi.fn().mockRejectedValue(new Error("Clerk error")),
        }))

        // Act
        const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
        const user = await clerkAuthAdapter.getUser()

        // Assert
        expect(user).toBeNull()
      })
    })

    describe("when user is not authenticated", () => {
      it("returns null", async () => {
        // Arrange
        vi.doMock("@/lib/setup", () => ({
          isConfigured: { auth: () => true },
        }))
        vi.doMock("@clerk/nextjs/server", () => ({
          auth: vi.fn(),
          currentUser: vi.fn().mockResolvedValue(null),
        }))

        // Act
        const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
        const user = await clerkAuthAdapter.getUser()

        // Assert
        expect(user).toBeNull()
      })
    })
  })

  describe("requireAuth", () => {
    describe("when auth is not configured", () => {
      it("throws INTERNAL_ERROR with setup instructions", async () => {
        // Arrange
        vi.doMock("@/lib/setup", () => ({
          isConfigured: { auth: () => false },
        }))

        // Act
        const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")

        // Assert
        await expect(clerkAuthAdapter.requireAuth()).rejects.toMatchObject({
          code: "INTERNAL_ERROR",
        })
      })
    })

    describe("when user is not authenticated", () => {
      it("throws UNAUTHORIZED", async () => {
        // Arrange
        vi.doMock("@/lib/setup", () => ({
          isConfigured: { auth: () => true },
        }))
        vi.doMock("@clerk/nextjs/server", () => ({
          auth: vi.fn(),
          currentUser: vi.fn().mockResolvedValue(null),
        }))

        // Act
        const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")

        // Assert
        await expect(clerkAuthAdapter.requireAuth()).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        })
      })
    })
  })

  describe("getUserId", () => {
    describe("when auth is not configured", () => {
      it("returns null without throwing", async () => {
        // Arrange
        vi.doMock("@/lib/setup", () => ({
          isConfigured: { auth: () => false },
        }))

        // Act
        const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
        const userId = await clerkAuthAdapter.getUserId()

        // Assert
        expect(userId).toBeNull()
      })
    })
  })

  describe("hasRole", () => {
    describe("when auth is not configured", () => {
      it("returns false without throwing", async () => {
        // Arrange
        vi.doMock("@/lib/setup", () => ({
          isConfigured: { auth: () => false },
        }))

        // Act
        const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
        const result = await clerkAuthAdapter.hasRole("admin")

        // Assert
        expect(result).toBe(false)
      })
    })

    describe("when user is not authenticated", () => {
      it("returns false", async () => {
        // Arrange
        vi.doMock("@/lib/setup", () => ({
          isConfigured: { auth: () => true },
        }))
        vi.doMock("@clerk/nextjs/server", () => ({
          auth: vi.fn(),
          currentUser: vi.fn().mockResolvedValue(null),
        }))

        // Act
        const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
        const result = await clerkAuthAdapter.hasRole("admin")

        // Assert
        expect(result).toBe(false)
      })
    })
  })

  describe("getSession", () => {
    describe("when auth is not configured", () => {
      it("returns null without throwing", async () => {
        // Arrange
        vi.doMock("@/lib/setup", () => ({
          isConfigured: { auth: () => false },
        }))

        // Act
        const { clerkAuthAdapter } = await import("@/core/auth/providers/clerk")
        const session = await clerkAuthAdapter.getSession()

        // Assert
        expect(session).toBeNull()
      })
    })
  })
})