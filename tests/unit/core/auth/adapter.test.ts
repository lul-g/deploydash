import { describe, it, expect } from "vitest"

describe("clerkAuthAdapter", () => {
  it("is defined", async () => {
    const { clerkAuthAdapter } = await import(
      "@/core/auth/providers/clerk"
    )
    expect(clerkAuthAdapter).toBeDefined()
  })

  it("implements all AuthAdapter methods", async () => {
    const { clerkAuthAdapter } = await import(
      "@/core/auth/providers/clerk"
    )
    expect(typeof clerkAuthAdapter.getUser).toBe("function")
    expect(typeof clerkAuthAdapter.requireAuth).toBe("function")
    expect(typeof clerkAuthAdapter.getSession).toBe("function")
    expect(typeof clerkAuthAdapter.getUserId).toBe("function")
    expect(typeof clerkAuthAdapter.hasRole).toBe("function")
  })
})