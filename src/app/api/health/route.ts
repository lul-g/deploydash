import { isConfigured, getMissingFeatures } from "@/lib/setup"
import { db } from "@/core/db"
import { logger } from "@/core/logging"

type ServiceStatus = "healthy" | "unhealthy" | "not_configured"

interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy"
  timestamp: string
  services: {
    database: ServiceStatus
    auth: ServiceStatus
    ratelimit: ServiceStatus
    email: ServiceStatus
    billing: ServiceStatus
    analytics: ServiceStatus
  }
}

async function checkDatabase(): Promise<ServiceStatus> {
  if (!isConfigured.db()) return "not_configured"
  try {
    await db.user.count()
    return "healthy"
  } catch {
    return "unhealthy"
  }
}

export async function GET(): Promise<Response> {
  const [database] = await Promise.all([checkDatabase()])

  const services: HealthResponse["services"] = {
    database,
    auth: isConfigured.auth() ? "healthy" : "not_configured",
    ratelimit: isConfigured.ratelimit() ? "healthy" : "not_configured",
    email: isConfigured.email() ? "healthy" : "not_configured",
    billing: isConfigured.billing() ? "healthy" : "not_configured",
    analytics: isConfigured.analytics() ? "healthy" : "not_configured",
  }

  const isUnhealthy = Object.values(services).some((s) => s === "unhealthy")
  const status = isUnhealthy ? "degraded" : "healthy"

  if (isUnhealthy) {
    logger.warn({ services }, "Health check degraded")
  }

  const response: HealthResponse = {
    status,
    timestamp: new Date().toISOString(),
    services,
  }

  return Response.json(response, {
    status: isUnhealthy ? 503 : 200,
  })
}