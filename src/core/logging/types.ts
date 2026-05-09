export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal"

export interface LogContext {
  userId?: string
  action?: string
  module?: string
  [key: string]: unknown
}