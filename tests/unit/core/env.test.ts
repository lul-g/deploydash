import { describe, it, expect } from "vitest"

describe("env", () => {
  it("env module exists", async () => {
    const envModule = await import("@/core/env")
    expect(envModule).toBeDefined()
  })

  it("SKIP_ENV_VALIDATION is set in test environment", () => {
    expect(process.env.SKIP_ENV_VALIDATION).toBe("true")
  })

  it("NODE_ENV is test", () => {
    expect(process.env.NODE_ENV).toBe("test")
  })
})