import { describe, it, expect, beforeEach } from "vitest"
import { logger } from "@/core/logging"

describe("logger", () => {
  beforeEach(() => {
    // logger is a singleton — no reset needed, but
    // keeping beforeEach for consistency and future setup
  })

  describe("when imported", () => {
    it("is defined", () => {
      expect(logger).toBeDefined()
    })

    it("is not null", () => {
      expect(logger).not.toBeNull()
    })
  })

  describe("log level methods", () => {
    it("exposes info method", () => {
      expect(typeof logger.info).toBe("function")
    })

    it("exposes error method", () => {
      expect(typeof logger.error).toBe("function")
    })

    it("exposes warn method", () => {
      expect(typeof logger.warn).toBe("function")
    })

    it("exposes debug method", () => {
      expect(typeof logger.debug).toBe("function")
    })

    it("exposes fatal method", () => {
      expect(typeof logger.fatal).toBe("function")
    })
  })

  describe("interface contract", () => {
    it("does not expose console.log — logger is not console", () => {
      expect(
        (logger as unknown as Record<string, unknown>).log
      ).toBeUndefined()
    })

    it("exposes child method for request-scoped logging", () => {
      expect(typeof logger.child).toBe("function")
    })

    it("child logger inherits parent methods", () => {
      // Arrange
      const childLogger = logger.child({ requestId: "req_123" })

      // Assert
      expect(typeof childLogger.info).toBe("function")
      expect(typeof childLogger.error).toBe("function")
      expect(typeof childLogger.warn).toBe("function")
    })

    it("exposes level property", () => {
      expect(logger.level).toBeDefined()
      expect(typeof logger.level).toBe("string")
    })

    it("level is valid pino log level", () => {
      const validLevels = ["trace", "debug", "info", "warn", "error", "fatal"]
      expect(validLevels).toContain(logger.level)
    })
  })

  describe("in test environment", () => {
    it("level is info — not debug", () => {
      // debug level is only for development (NODE_ENV=development)
      // test environment should use info level
      expect(logger.level).toBe("info")
    })
  })
})