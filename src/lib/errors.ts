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

    // fixes prototype chain in TypeScript when extending built-ins
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error
  if (error instanceof Error) {
    return new AppError("INTERNAL_ERROR", error.message)
  }
  return new AppError("INTERNAL_ERROR", "An unknown error occurred")
}