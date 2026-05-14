/**
 * @module db/providers/null
 * @provider null — no-op adapter for projects without a database
 * @install automatic — used when db is not configured
 * @env none
 *
 * Null db adapter — used when DATABASE_URL is not configured.
 * Every method throws a clear error pointing to setup instructions.
 * Selected automatically by src/core/db/index.ts when db is unconfigured.
 */

import { AppError } from "@/lib/errors"
import type { DbAdapter } from "../../types"

const notConfigured = () => {
  throw new AppError(
    "INTERNAL_ERROR",
    "Database is not configured. Add DATABASE_URL to .env.local and run: npx deploydash add db"
  )
}

export const nullDbAdapter: DbAdapter = {
  user: {
    findById: async () => notConfigured(),
    findByEmail: async () => notConfigured(),
    findMany: async () => notConfigured(),
    create: async () => notConfigured(),
    update: async () => notConfigured(),
    delete: async () => notConfigured(),
    count: async () => notConfigured(),
  },
}