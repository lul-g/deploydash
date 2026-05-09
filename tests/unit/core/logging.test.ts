import { describe, it, expect } from "vitest"

describe("logger", () => {
  it("is defined", async () => {
    const { logger } = await import("@/core/logging")
    expect(logger).toBeDefined()
  })

  it("exposes info, error, warn, debug, fatal methods", async () => {
    const { logger } = await import("@/core/logging")
    expect(typeof logger.info).toBe("function")
    expect(typeof logger.error).toBe("function")
    expect(typeof logger.warn).toBe("function")
    expect(typeof logger.debug).toBe("function")
    expect(typeof logger.fatal).toBe("function")
  })

  it("does not expose console.log", async () => {
    const { logger } = await import("@/core/logging")
    expect((logger as unknown as Record<string, unknown>).log).toBeUndefined()
  })
})