/**
 * Role definitions and helpers for DeployDash RBAC.
 * Add new roles here — the Role type updates automatically.
 * Never hardcode role strings outside this file.
 */

export const ROLES = {
    ADMIN: "admin",
    USER: "user",
  } as const
  
  // derived from ROLES — adding to ROLES automatically updates this type
  export type Role = (typeof ROLES)[keyof typeof ROLES]
  
  /**
   * Checks if a given role matches the required role.
   * Safe to call with undefined — returns false instead of throwing.
   *
   * @param userRole - the role assigned to the current user
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
   * Convenience wrapper around hasRole.
   */
  export function isAdmin(userRole: string | undefined): boolean {
    return hasRole(userRole, ROLES.ADMIN)
  }