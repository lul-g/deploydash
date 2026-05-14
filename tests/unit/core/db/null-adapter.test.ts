import { describe, it, expect } from "vitest"
import { nullDbAdapter } from "@/core/db/providers/null"

describe("nullDbAdapter", () => {
  describe("interface contract", () => {
    it("is defined", () => {
      expect(nullDbAdapter).toBeDefined()
    })

    it("exposes user repository", () => {
      expect(nullDbAdapter.user).toBeDefined()
    })
  })

  describe("user repository", () => {
    describe("interface contract", () => {
      it("exposes findById method", () => {
        expect(typeof nullDbAdapter.user.findById).toBe("function")
      })

      it("exposes findByEmail method", () => {
        expect(typeof nullDbAdapter.user.findByEmail).toBe("function")
      })

      it("exposes findMany method", () => {
        expect(typeof nullDbAdapter.user.findMany).toBe("function")
      })

      it("exposes create method", () => {
        expect(typeof nullDbAdapter.user.create).toBe("function")
      })

      it("exposes update method", () => {
        expect(typeof nullDbAdapter.user.update).toBe("function")
      })

      it("exposes delete method", () => {
        expect(typeof nullDbAdapter.user.delete).toBe("function")
      })

      it("exposes count method", () => {
        expect(typeof nullDbAdapter.user.count).toBe("function")
      })
    })

    describe("when db is not configured", () => {
      it("findById throws INTERNAL_ERROR", async () => {
        await expect(
          nullDbAdapter.user.findById("user_123")
        ).rejects.toMatchObject({ code: "INTERNAL_ERROR" })
      })

      it("findByEmail throws INTERNAL_ERROR", async () => {
        await expect(
          nullDbAdapter.user.findByEmail("test@example.com")
        ).rejects.toMatchObject({ code: "INTERNAL_ERROR" })
      })

      it("findMany throws INTERNAL_ERROR", async () => {
        await expect(
          nullDbAdapter.user.findMany()
        ).rejects.toMatchObject({ code: "INTERNAL_ERROR" })
      })

      it("create throws INTERNAL_ERROR", async () => {
        await expect(
          nullDbAdapter.user.create({
            id: "user_123",
            email: "test@example.com",
          })
        ).rejects.toMatchObject({ code: "INTERNAL_ERROR" })
      })

      it("update throws INTERNAL_ERROR", async () => {
        await expect(
          nullDbAdapter.user.update("user_123", { role: "admin" })
        ).rejects.toMatchObject({ code: "INTERNAL_ERROR" })
      })

      it("delete throws INTERNAL_ERROR", async () => {
        await expect(
          nullDbAdapter.user.delete("user_123")
        ).rejects.toMatchObject({ code: "INTERNAL_ERROR" })
      })

      it("count throws INTERNAL_ERROR", async () => {
        await expect(
          nullDbAdapter.user.count()
        ).rejects.toMatchObject({ code: "INTERNAL_ERROR" })
      })

      it("every method throws AppError not plain Error", async () => {
        const { isAppError } = await import("@/lib/errors")
        try {
          await nullDbAdapter.user.findById("user_123")
        } catch (error) {
          expect(isAppError(error)).toBe(true)
        }
      })

      it("error message contains setup instructions", async () => {
        await expect(
          nullDbAdapter.user.findById("user_123")
        ).rejects.toMatchObject({
          message: expect.stringContaining("DATABASE_URL"),
        })
      })
    })
  })
})