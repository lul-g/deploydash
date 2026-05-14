import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("when all services are not configured", () => {
    it("returns healthy status", async () => {
      // Arrange
      vi.doMock("@/lib/setup", () => ({
        isConfigured: {
          db: () => false,
          auth: () => false,
          ratelimit: () => false,
          email: () => false,
          billing: () => false,
          analytics: () => false,
        },
        getMissingFeatures: () => [],
      }))

      // Act
      const { GET } = await import("@/app/api/health/route")
      const response = await GET()
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.status).toBe("healthy")
      expect(body.timestamp).toBeDefined()
    })

    it("returns not_configured for all services", async () => {
      // Arrange
      vi.doMock("@/lib/setup", () => ({
        isConfigured: {
          db: () => false,
          auth: () => false,
          ratelimit: () => false,
          email: () => false,
          billing: () => false,
          analytics: () => false,
        },
        getMissingFeatures: () => [],
      }))

      // Act
      const { GET } = await import("@/app/api/health/route")
      const response = await GET()
      const body = await response.json()

      // Assert
      expect(body.services.auth).toBe("not_configured")
      expect(body.services.ratelimit).toBe("not_configured")
      expect(body.services.email).toBe("not_configured")
      expect(body.services.billing).toBe("not_configured")
      expect(body.services.analytics).toBe("not_configured")
    })
  })

  describe("when database is unhealthy", () => {
    it("returns degraded status with 503", async () => {
      // Arrange
      vi.doMock("@/lib/setup", () => ({
        isConfigured: {
          db: () => true,
          auth: () => false,
          ratelimit: () => false,
          email: () => false,
          billing: () => false,
          analytics: () => false,
        },
        getMissingFeatures: () => [],
      }))
      vi.doMock("@/core/db", () => ({
        db: {
          user: {
            count: vi.fn().mockRejectedValue(new Error("DB connection failed")),
          },
        },
      }))

      // Act
      const { GET } = await import("@/app/api/health/route")
      const response = await GET()
      const body = await response.json()

      // Assert
      expect(response.status).toBe(503)
      expect(body.status).toBe("degraded")
      expect(body.services.database).toBe("unhealthy")
    })
  })

  describe("response shape", () => {
    it("always includes timestamp", async () => {
      // Arrange
      vi.doMock("@/lib/setup", () => ({
        isConfigured: {
          db: () => false,
          auth: () => false,
          ratelimit: () => false,
          email: () => false,
          billing: () => false,
          analytics: () => false,
        },
        getMissingFeatures: () => [],
      }))

      // Act
      const { GET } = await import("@/app/api/health/route")
      const response = await GET()
      const body = await response.json()

      // Assert
      expect(body.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      )
    })

    it("always includes all service keys", async () => {
      // Arrange
      vi.doMock("@/lib/setup", () => ({
        isConfigured: {
          db: () => false,
          auth: () => false,
          ratelimit: () => false,
          email: () => false,
          billing: () => false,
          analytics: () => false,
        },
        getMissingFeatures: () => [],
      }))

      // Act
      const { GET } = await import("@/app/api/health/route")
      const response = await GET()
      const body = await response.json()

      // Assert
      expect(body.services).toHaveProperty("database")
      expect(body.services).toHaveProperty("auth")
      expect(body.services).toHaveProperty("ratelimit")
      expect(body.services).toHaveProperty("email")
      expect(body.services).toHaveProperty("billing")
      expect(body.services).toHaveProperty("analytics")
    })
  })
})