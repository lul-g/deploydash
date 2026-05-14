/**
 * @module logging
 * @provider pino
 * @install npx deploydash add logging
 * @env none
 *
 * Logging adapter public export.
 * The rest of the app imports from here — never from providers directly.
 * To swap providers: change the import below. Zero other changes needed.
 */

export { logger } from "./providers/pino"
export type { LogLevel, LogContext } from "./types"