import { describe, it, expect, vi, beforeEach } from "vitest"

const mockPrismaUser = {
  id: "user_123",
  email: "test@example.com",
  role: "user",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
}

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
}

vi.mock("@/core/db/providers/supabase-prisma/client", () => ({
  prisma: mockPrisma,
}))

// import AFTER mock is set up
const { supabasePrismaAdapter } = await import(
  "@/core/db/providers/supabase-prisma"
)

describe("supabasePrismaAdapter — UserRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("findById", () => {
    describe("when user exists", () => {
      it("returns mapped user", async () => {
        // Arrange
        mockPrisma.user.findUnique.mockResolvedValue(mockPrismaUser)

        // Act
        const user = await supabasePrismaAdapter.user.findById("user_123")

        // Assert
        expect(user).not.toBeNull()
        expect(user?.id).toBe("user_123")
        expect(user?.email).toBe("test@example.com")
        expect(user?.role).toBe("user")
      })

      it("queries with correct id", async () => {
        // Arrange
        mockPrisma.user.findUnique.mockResolvedValue(mockPrismaUser)

        // Act
        await supabasePrismaAdapter.user.findById("user_123")

        // Assert
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
          where: { id: "user_123" },
        })
      })
    })

    describe("when user does not exist", () => {
      it("returns null", async () => {
        // Arrange
        mockPrisma.user.findUnique.mockResolvedValue(null)

        // Act
        const user = await supabasePrismaAdapter.user.findById("nonexistent")

        // Assert
        expect(user).toBeNull()
      })
    })
  })

  describe("findByEmail", () => {
    describe("when user exists", () => {
      it("returns mapped user", async () => {
        // Arrange
        mockPrisma.user.findUnique.mockResolvedValue(mockPrismaUser)

        // Act
        const user = await supabasePrismaAdapter.user.findByEmail(
          "test@example.com"
        )

        // Assert
        expect(user?.email).toBe("test@example.com")
      })

      it("queries with correct email", async () => {
        // Arrange
        mockPrisma.user.findUnique.mockResolvedValue(mockPrismaUser)

        // Act
        await supabasePrismaAdapter.user.findByEmail("test@example.com")

        // Assert
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
          where: { email: "test@example.com" },
        })
      })
    })

    describe("when user does not exist", () => {
      it("returns null", async () => {
        // Arrange
        mockPrisma.user.findUnique.mockResolvedValue(null)

        // Act
        const user = await supabasePrismaAdapter.user.findByEmail(
          "notfound@example.com"
        )

        // Assert
        expect(user).toBeNull()
      })
    })
  })

  describe("create", () => {
    describe("when given valid input", () => {
      it("returns created user", async () => {
        // Arrange
        mockPrisma.user.create.mockResolvedValue(mockPrismaUser)

        // Act
        const user = await supabasePrismaAdapter.user.create({
          id: "user_123",
          email: "test@example.com",
        })

        // Assert
        expect(user.id).toBe("user_123")
        expect(user.email).toBe("test@example.com")
      })

      it("defaults role to user when not provided", async () => {
        // Arrange
        mockPrisma.user.create.mockResolvedValue(mockPrismaUser)

        // Act
        await supabasePrismaAdapter.user.create({
          id: "user_123",
          email: "test@example.com",
        })

        // Assert
        expect(mockPrisma.user.create).toHaveBeenCalledWith({
          data: expect.objectContaining({ role: "user" }),
        })
      })

      it("uses provided role when given", async () => {
        // Arrange
        mockPrisma.user.create.mockResolvedValue({
          ...mockPrismaUser,
          role: "admin",
        })

        // Act
        await supabasePrismaAdapter.user.create({
          id: "user_123",
          email: "test@example.com",
          role: "admin",
        })

        // Assert
        expect(mockPrisma.user.create).toHaveBeenCalledWith({
          data: expect.objectContaining({ role: "admin" }),
        })
      })
    })
  })

  describe("update", () => {
    describe("when user exists", () => {
      it("returns updated user", async () => {
        // Arrange
        const updatedUser = { ...mockPrismaUser, role: "admin" }
        mockPrisma.user.update.mockResolvedValue(updatedUser)

        // Act
        const user = await supabasePrismaAdapter.user.update("user_123", {
          role: "admin",
        })

        // Assert
        expect(user.role).toBe("admin")
      })

      it("queries with correct id", async () => {
        // Arrange
        mockPrisma.user.update.mockResolvedValue(mockPrismaUser)

        // Act
        await supabasePrismaAdapter.user.update("user_123", { role: "admin" })

        // Assert
        expect(mockPrisma.user.update).toHaveBeenCalledWith(
          expect.objectContaining({ where: { id: "user_123" } })
        )
      })
    })
  })

  describe("delete", () => {
    describe("when user exists", () => {
      it("calls prisma delete with correct id", async () => {
        // Arrange
        mockPrisma.user.delete.mockResolvedValue(mockPrismaUser)

        // Act
        await supabasePrismaAdapter.user.delete("user_123")

        // Assert
        expect(mockPrisma.user.delete).toHaveBeenCalledWith({
          where: { id: "user_123" },
        })
      })

      it("returns void", async () => {
        // Arrange
        mockPrisma.user.delete.mockResolvedValue(mockPrismaUser)

        // Act
        const result = await supabasePrismaAdapter.user.delete("user_123")

        // Assert
        expect(result).toBeUndefined()
      })
    })
  })

  describe("count", () => {
    describe("when called without filters", () => {
      it("returns total user count", async () => {
        // Arrange
        mockPrisma.user.count.mockResolvedValue(42)

        // Act
        const count = await supabasePrismaAdapter.user.count()

        // Assert
        expect(count).toBe(42)
      })
    })

    describe("when called with role filter", () => {
      it("returns filtered count", async () => {
        // Arrange
        mockPrisma.user.count.mockResolvedValue(5)

        // Act
        const count = await supabasePrismaAdapter.user.count({ role: "admin" })

        // Assert
        expect(count).toBe(5)
        expect(mockPrisma.user.count).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({ role: "admin" }),
          })
        )
      })
    })
  })

  describe("findMany", () => {
    describe("when called without options", () => {
      it("returns array of mapped users", async () => {
        // Arrange
        mockPrisma.user.findMany.mockResolvedValue([mockPrismaUser])

        // Act
        const users = await supabasePrismaAdapter.user.findMany()

        // Assert
        expect(Array.isArray(users)).toBe(true)
        expect(users).toHaveLength(1)
        expect(users[0].id).toBe("user_123")
      })

      it("returns empty array when no users exist", async () => {
        // Arrange
        mockPrisma.user.findMany.mockResolvedValue([])

        // Act
        const users = await supabasePrismaAdapter.user.findMany()

        // Assert
        expect(users).toHaveLength(0)
      })
    })

    describe("when called with limit and offset", () => {
      it("passes limit and offset to prisma", async () => {
        // Arrange
        mockPrisma.user.findMany.mockResolvedValue([])

        // Act
        await supabasePrismaAdapter.user.findMany({ limit: 10, offset: 20 })

        // Assert
        expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
          expect.objectContaining({ take: 10, skip: 20 })
        )
      })
    })
  })
})