/**
 * @module db/providers/supabase-prisma/client
 * @provider supabase-prisma
 * @install npx deploydash add db
 * @env DATABASE_URL, DATABASE_URL_UNPOOLED
 *
 * Prisma client singleton for DeployDash.
 *
 * Uses a global singleton to prevent connection pool exhaustion
 * during Next.js hot reloads in development. Without this, every
 * hot reload creates a new PrismaClient and connection pool,
 * eventually exhausting Supabase's connection limit.
 *
 * Never import PrismaClient directly outside this file.
 * Always import { prisma } from "@/core/db/providers/supabase-prisma/client"
 *
 * ⚠️ DEPLOYMENT REMINDER: switch DATABASE_URL to the pooled connection
 * (DATABASE_URL_UNPOOLED) before deploying to production.
 */

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/generated/prisma/client"
import { env } from "@/core/env"
import { logger } from "@/core/logging"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL ?? "" })

  if (process.env.NODE_ENV === "development") {
    const client = new PrismaClient({
      adapter,
      log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "error" },
        { emit: "event", level: "warn" },
      ],
    })

    client.$on("query", (e) => {
      if (e.duration > 2000) {
        logger.warn(
          { duration: e.duration, query: e.query },
          "Slow Prisma query detected"
        )
      }
    })

    client.$on("error", (e) => {
      logger.error({ message: e.message }, "Prisma error")
    })

    return client
  }

  return new PrismaClient({
    adapter,
    log: [{ emit: "event", level: "error" }],
  })
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}