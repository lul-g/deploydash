/**
 * @module logging
 * @provider pino
 * @install npx deploydash add logging
 * @env none — uses NODE_ENV only
 *
 * Pino logging provider for DeployDash.
 *
 * Development → pino-pretty, colorized, human-readable, debug level
 * Production  → raw JSON to stdout, info level, consumed by log drain
 *
 * process.env.NODE_ENV is read directly here — this is the ONE legitimate
 * exception to the "never use process.env" rule. This file initializes
 * before t3-env runs so it cannot import from @/core/env.
 *
 * Never import this file directly — always import from @/core/logging.
 */

import pino from "pino"

const isDevelopment = process.env.NODE_ENV === "development"

export const logger = pino({
  level: isDevelopment ? "debug" : "info",
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "HH:MM:ss",
        },
      }
    : undefined,
})