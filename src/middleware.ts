import { authMiddleware } from "@/core/auth/middleware"

export default authMiddleware

export const config = {
  matcher: [
    // run on everything except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}