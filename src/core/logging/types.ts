/**
 * Shared types for the DeployDash logging system.
 * @module logging/types
 * @install npx deploydash add logging
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal"

export interface LogContext {
  userId?: string
  action?: string
  module?: string
  [key: string]: unknown
}