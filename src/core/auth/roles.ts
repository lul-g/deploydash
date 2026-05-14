/**
 * @module auth/roles
 * @provider none — pure logic, no external dependencies
 * @install npx deploydash add auth
 * @env none
 *
 * Role definitions and RBAC helpers for DeployDash.
 *
 * Rules:
 * - Never hardcode role strings outside this file
 * - Add new roles to ROLES — the Role type updates automatically
 * - hasRole and isAdmin are the only functions that check roles
 * - Role strings are stored in Clerk's publicMetadata.role field
 */

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const

// derived from ROLES — adding a new role here automatically updates this type
export type Role = (typeof ROLES)[keyof typeof ROLES]

/**
 * Returns true if the given role matches the required role.
 * Safe to call with undefined — returns false instead of throwing.
 * Case sensitive — "Admin" !== "admin".
 *
 * @param userRole - the role assigned to the current user (from Clerk publicMetadata)
 * @param requiredRole - the role required for the action
 */
export function hasRole(
  userRole: string | undefined,
  requiredRole: Role
): boolean {
  return userRole === requiredRole
}

/**
 * Returns true if the user has the admin role.
 * Convenience wrapper around hasRole for the most common role check.
 *
 * @param userRole - the role assigned to the current user (from Clerk publicMetadata)
 */
export function isAdmin(userRole: string | undefined): boolean {
  return hasRole(userRole, ROLES.ADMIN)
}