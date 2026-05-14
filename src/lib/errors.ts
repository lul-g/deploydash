/**
 * Typed error classes for DeployDash.
 *
 * Every error thrown in the application must use AppError with a typed ErrorCode.
 * Never throw plain Error objects — they have no machine-readable code.
 *
 * Adding a new error code:
 * 1. Add to the ErrorCode union type below
 * 2. Map it to an HTTP status in your route error handler
 *
 * Usage:
 *   throw new AppError("NOT_FOUND", "User not found", { userId })
 *   throw new AppError("PAYMENT_FAILED", "Stripe charge failed", { stripeCode })
 */

export type ErrorCode =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "PAYMENT_FAILED"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "VALIDATION_ERROR"
  | "WEBHOOK_ERROR"

export class AppError extends Error {
  readonly code: ErrorCode
  readonly context?: Record<string, unknown>

  constructor(
    code: ErrorCode,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.context = context

    // required — fixes prototype chain when extending built-in classes in TypeScript
    // without this, instanceof AppError returns false after transpilation
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

/**
 * Type guard — returns true if the value is an AppError.
 * Use before accessing .code or .context on an unknown error.
 *
 * @example
 * catch (error) {
 *   if (isAppError(error)) {
 *     logger.error({ code: error.code }, error.message)
 *   }
 * }
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Converts any unknown error into a typed AppError.
 * Use at catch boundaries where the error type is unknown.
 *
 * - AppError → returned as-is
 * - Error → wrapped with INTERNAL_ERROR, preserves message
 * - anything else → wrapped with INTERNAL_ERROR and a generic message
 *
 * @example
 * catch (error) {
 *   const appError = toAppError(error)
 *   logger.error({ code: appError.code }, appError.message)
 *   return new Response(appError.message, { status: 500 })
 * }
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error
  if (error instanceof Error) {
    return new AppError("INTERNAL_ERROR", error.message)
  }
  return new AppError("INTERNAL_ERROR", "An unknown error occurred")
}