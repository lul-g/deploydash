import { describe, it, expect } from "vitest"
import { AppError, isAppError, toAppError } from "@/lib/errors"

describe("AppError", () => {
  describe("when constructed with code and message", () => {
    it("sets the correct error code", () => {
      const error = new AppError("NOT_FOUND", "Resource not found")
      expect(error.code).toBe("NOT_FOUND")
    })

    it("sets the correct message", () => {
      const error = new AppError("NOT_FOUND", "Resource not found")
      expect(error.message).toBe("Resource not found")
    })

    it("sets name to AppError", () => {
      const error = new AppError("NOT_FOUND", "Resource not found")
      expect(error.name).toBe("AppError")
    })

    it("extends Error", () => {
      const error = new AppError("NOT_FOUND", "Resource not found")
      expect(error).toBeInstanceOf(Error)
    })

    it("is instance of AppError — prototype chain is correct", () => {
      const error = new AppError("NOT_FOUND", "Resource not found")
      expect(error).toBeInstanceOf(AppError)
    })

    it("has undefined context when not provided", () => {
      const error = new AppError("NOT_FOUND", "Resource not found")
      expect(error.context).toBeUndefined()
    })
  })

  describe("when constructed with context", () => {
    it("stores context correctly", () => {
      // Arrange
      const context = { userId: "user_123", resourceId: "res_456" }

      // Act
      const error = new AppError("NOT_FOUND", "Resource not found", context)

      // Assert
      expect(error.context).toEqual(context)
    })
  })

  describe("error codes", () => {
    it.each([
      "NOT_FOUND",
      "UNAUTHORIZED",
      "FORBIDDEN",
      "BAD_REQUEST",
      "CONFLICT",
      "PAYMENT_FAILED",
      "RATE_LIMITED",
      "INTERNAL_ERROR",
      "VALIDATION_ERROR",
      "WEBHOOK_ERROR",
    ] as const)("accepts %s as a valid error code", (code) => {
      const error = new AppError(code, "test message")
      expect(error.code).toBe(code)
    })
  })
})

describe("isAppError", () => {
  describe("when value is an AppError", () => {
    it("returns true", () => {
      const error = new AppError("NOT_FOUND", "Resource not found")
      expect(isAppError(error)).toBe(true)
    })
  })

  describe("when value is a plain Error", () => {
    it("returns false", () => {
      const error = new Error("plain error")
      expect(isAppError(error)).toBe(false)
    })
  })

  describe("when value is not an error", () => {
    it("returns false for string", () => {
      expect(isAppError("error string")).toBe(false)
    })

    it("returns false for null", () => {
      expect(isAppError(null)).toBe(false)
    })

    it("returns false for undefined", () => {
      expect(isAppError(undefined)).toBe(false)
    })

    it("returns false for plain object", () => {
      expect(isAppError({ code: "NOT_FOUND", message: "not found" })).toBe(false)
    })

    it("returns false for number", () => {
      expect(isAppError(404)).toBe(false)
    })
  })
})

describe("toAppError", () => {
  describe("when given an AppError", () => {
    it("returns it unchanged", () => {
      // Arrange
      const original = new AppError("NOT_FOUND", "Resource not found", { id: "123" })

      // Act
      const result = toAppError(original)

      // Assert
      expect(result).toBe(original)
      expect(result.code).toBe("NOT_FOUND")
      expect(result.context).toEqual({ id: "123" })
    })
  })

  describe("when given a plain Error", () => {
    it("wraps it with INTERNAL_ERROR code", () => {
      const error = new Error("something went wrong")
      const result = toAppError(error)
      expect(result.code).toBe("INTERNAL_ERROR")
    })

    it("preserves the original error message", () => {
      const error = new Error("something went wrong")
      const result = toAppError(error)
      expect(result.message).toBe("something went wrong")
    })

    it("returns an AppError instance", () => {
      const error = new Error("something went wrong")
      expect(toAppError(error)).toBeInstanceOf(AppError)
    })
  })

  describe("when given an unknown value", () => {
    it("returns INTERNAL_ERROR for null", () => {
      const result = toAppError(null)
      expect(result.code).toBe("INTERNAL_ERROR")
      expect(result.message).toBe("An unknown error occurred")
    })

    it("returns INTERNAL_ERROR for undefined", () => {
      const result = toAppError(undefined)
      expect(result.code).toBe("INTERNAL_ERROR")
    })

    it("returns INTERNAL_ERROR for string", () => {
      const result = toAppError("something broke")
      expect(result.code).toBe("INTERNAL_ERROR")
    })

    it("returns INTERNAL_ERROR for plain object", () => {
      const result = toAppError({ message: "error" })
      expect(result.code).toBe("INTERNAL_ERROR")
    })

    it("always returns an AppError instance", () => {
      expect(toAppError(null)).toBeInstanceOf(AppError)
      expect(toAppError(undefined)).toBeInstanceOf(AppError)
      expect(toAppError("string")).toBeInstanceOf(AppError)
      expect(toAppError(42)).toBeInstanceOf(AppError)
    })
  })
})