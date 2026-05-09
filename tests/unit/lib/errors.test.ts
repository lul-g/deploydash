import { describe, it, expect } from "vitest"

describe("errors", () => {
  it("AppError is defined", async () => {
    const { AppError } = await import("@/lib/errors")
    expect(AppError).toBeDefined()
  })

  it("AppError extends Error", async () => {
    const { AppError } = await import("@/lib/errors")
    const error = new AppError("NOT_FOUND", "Resource not found")
    expect(error).toBeInstanceOf(Error)
  })

  it("AppError has correct code and message", async () => {
    const { AppError } = await import("@/lib/errors")
    const error = new AppError("UNAUTHORIZED", "Not allowed")
    expect(error.code).toBe("UNAUTHORIZED")
    expect(error.message).toBe("Not allowed")
  })

  it("AppError accepts optional context", async () => {
    const { AppError } = await import("@/lib/errors")
    const error = new AppError("PAYMENT_FAILED", "Stripe failed", { stripeCode: "card_declined" })
    expect(error.context).toEqual({ stripeCode: "card_declined" })
  })

  it("AppError has correct name", async () => {
    const { AppError } = await import("@/lib/errors")
    const error = new AppError("NOT_FOUND", "Resource not found")
    expect(error.name).toBe("AppError")
  })
})