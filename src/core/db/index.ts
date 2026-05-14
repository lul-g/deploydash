/**
 * @module db
 * @provider supabase-prisma (default) | null (when unconfigured)
 * @requires none — db is a foundation module
 * @install npx deploydash add db
 * @env DATABASE_URL, DATABASE_URL_UNPOOLED
 *
 * Database adapter public export.
 * The rest of the app imports from here — never from providers directly.
 *
 * Active provider is selected based on isConfigured.db().
 * If DATABASE_URL is present → supabasePrismaAdapter
 * If DATABASE_URL is missing → nullDbAdapter (safe no-ops)
 *
 * To swap providers: change the import and assignment below.
 * Zero other changes needed anywhere in the app.
 */

import { isConfigured } from "@/lib/setup"

import { supabasePrismaAdapter } from "./providers/supabase-prisma"
import { nullDbAdapter } from "./providers/null"
import type { DbAdapter } from "./types"

export const db: DbAdapter = isConfigured.db()
  ? supabasePrismaAdapter
  : nullDbAdapter

export type { DbAdapter, UserRepository, User, CreateUserInput, UpdateUserInput, FindUsersOptions } from "./types"