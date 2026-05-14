/**
 * @module db/providers/supabase-prisma
 * @provider supabase-prisma
 * @requires none — this IS the db provider
 * @install npx deploydash add db
 * @env DATABASE_URL, DATABASE_URL_UNPOOLED
 *
 * Supabase + Prisma implementation of the DbAdapter interface.
 *
 * Rules:
 * - Only file that imports from @/generated/prisma (via client.ts)
 * - Never let Prisma types leak outside this folder
 * - Map Prisma results to DeployDash types before returning
 * - To swap to Drizzle: replace this folder only
 */

import { prisma } from "./client"
import type {
  DbAdapter,
  UserRepository,
  User,
  CreateUserInput,
  UpdateUserInput,
  FindUsersOptions,
} from "../../types"

/**
 * Maps a Prisma user to DeployDash's provider-agnostic User type.
 * Update here if the Prisma schema changes — never elsewhere.
 */
function mapUser(prismaUser: {
  id: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}): User {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    role: prismaUser.role,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
  }
}

const userRepository: UserRepository = {
  findById: async (id) => {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? mapUser(user) : null
  },

  findByEmail: async (email) => {
    const user = await prisma.user.findUnique({ where: { email } })
    return user ? mapUser(user) : null
  },

  findMany: async (options?: FindUsersOptions) => {
    const users = await prisma.user.findMany({
      where: {
        role: options?.where?.role,
        email: options?.where?.email,
      },
      orderBy: options?.orderBy
        ? { [options.orderBy.field]: options.orderBy.direction }
        : { createdAt: "desc" },
      take: options?.limit,
      skip: options?.offset,
    })
    return users.map(mapUser)
  },

  create: async (data: CreateUserInput) => {
    const user = await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        role: data.role ?? "user",
      },
    })
    return mapUser(user)
  },

  update: async (id, data: UpdateUserInput) => {
    const user = await prisma.user.update({
      where: { id },
      data,
    })
    return mapUser(user)
  },

  delete: async (id) => {
    await prisma.user.delete({ where: { id } })
  },

  count: async (where) => {
    return prisma.user.count({
      where: {
        role: where?.role,
        email: where?.email,
      },
    })
  },
}

export const supabasePrismaAdapter: DbAdapter = {
  user: userRepository,
}