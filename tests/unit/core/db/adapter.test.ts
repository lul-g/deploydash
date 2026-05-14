import { describe, it, expect } from "vitest"

describe("DbAdapter", () => {
  describe("interface contract", () => {
    it("db is defined", async () => {
      const { db } = await import("@/core/db")
      expect(db).toBeDefined()
    })

    it("exposes user repository", async () => {
      const { db } = await import("@/core/db")
      expect(db.user).toBeDefined()
    })
  })

  describe("UserRepository interface", () => {
    it("exposes findById method", async () => {
      const { db } = await import("@/core/db")
      expect(typeof db.user.findById).toBe("function")
    })

    it("exposes findByEmail method", async () => {
      const { db } = await import("@/core/db")
      expect(typeof db.user.findByEmail).toBe("function")
    })

    it("exposes create method", async () => {
      const { db } = await import("@/core/db")
      expect(typeof db.user.create).toBe("function")
    })

    it("exposes update method", async () => {
      const { db } = await import("@/core/db")
      expect(typeof db.user.update).toBe("function")
    })

    it("exposes delete method", async () => {
      const { db } = await import("@/core/db")
      expect(typeof db.user.delete).toBe("function")
    })

    it("exposes findMany method", async () => {
      const { db } = await import("@/core/db")
      expect(typeof db.user.findMany).toBe("function")
    })

    it("exposes count method", async () => {
      const { db } = await import("@/core/db")
      expect(typeof db.user.count).toBe("function")
    })
  })
})

describe("prisma client singleton", () => {
  describe("when imported multiple times", () => {
    it("returns the same instance", async () => {
      const { prisma: prisma1 } = await import(
        "@/core/db/providers/supabase-prisma/client"
      )
      const { prisma: prisma2 } = await import(
        "@/core/db/providers/supabase-prisma/client"
      )
      expect(prisma1).toBe(prisma2)
    })
  })

  describe("interface", () => {
    it("is defined", async () => {
      const { prisma } = await import(
        "@/core/db/providers/supabase-prisma/client"
      )
      expect(prisma).toBeDefined()
    })
  })
})