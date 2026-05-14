/**
 * @module db/types
 * @provider none — shared types, no external dependencies
 * @install npx deploydash add db
 * @env none
 *
 * DbAdapter interface and repository types for DeployDash.
 *
 * IMPORTANT: This interface is a public contract.
 * Once shipped, never remove or rename methods.
 * Adding new optional methods is safe.
 *
 * Never import from @prisma/client or any ORM directly in this file.
 * All types are provider-agnostic.
 */

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
    id: string
    email: string
    role: string
    createdAt: Date
    updatedAt: Date
  }
  
  export interface CreateUserInput {
    id: string
    email: string
    role?: string
  }
  
  export interface UpdateUserInput {
    email?: string
    role?: string
  }
  
  export interface FindUsersOptions {
    where?: {
      role?: string
      email?: string
    }
    orderBy?: {
      field: "createdAt" | "email"
      direction: "asc" | "desc"
    }
    limit?: number
    offset?: number
  }
  
  export interface UserRepository {
    /** Returns user by ID or null if not found */
    findById(id: string): Promise<User | null>
    /** Returns user by email or null if not found */
    findByEmail(email: string): Promise<User | null>
    /** Returns multiple users with optional filtering */
    findMany(options?: FindUsersOptions): Promise<User[]>
    /** Creates a new user record */
    create(data: CreateUserInput): Promise<User>
    /** Updates an existing user record */
    update(id: string, data: UpdateUserInput): Promise<User>
    /** Deletes a user record */
    delete(id: string): Promise<void>
    /** Returns total count of users with optional filtering */
    count(where?: FindUsersOptions["where"]): Promise<number>
  }
  
  // ─── DbAdapter ───────────────────────────────────────────────────────────────
  
  export interface DbAdapter {
    /** User repository — CRUD operations for user records */
    user: UserRepository
  }