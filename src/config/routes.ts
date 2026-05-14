/**
 * Route configuration for DeployDash.
 *
 * THIS is the file you edit to control route protection.
 * The middleware reads this config — never edit the middleware directly.
 *
 * Patterns support regex:
 * - "/blog(.*)" matches /blog, /blog/post-1, /blog/category/x
 * - "/admin(.*)" matches /admin, /admin/users, /admin/settings
 *
 * Common tasks:
 * - Make a route public → add it to publicRoutes
 * - Protect a route → remove it from publicRoutes (protected by default)
 * - Restrict to admins → add it to adminRoutes
 * - Change sign-in redirect → update signInUrl
 */

export const routeConfig = {
  /**
   * Routes accessible without authentication.
   * Everything NOT listed here requires authentication by default.
   * Add any public-facing page, API route, or asset path here.
   */
  publicRoutes: [
    "/",
    "/pricing",
    "/blog(.*)",
    "/docs(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/health",
    "/api/webhooks(.*)", // webhooks are verified by signature, not session auth
  ],

  /**
   * Routes that require the admin role.
   * Authenticated users without the admin role receive a 403.
   * Users must be authenticated AND have the admin role.
   */
  adminRoutes: [
    "/admin(.*)",
  ],

  /**
   * Where to redirect unauthenticated users who try to access a protected route.
   * Change this if your sign-in page is at a different path.
   */
  signInUrl: "/sign-in",

  /**
   * Where to redirect after a successful sign-in.
   */
  afterSignInUrl: "/dashboard",

  /**
   * Where to redirect after a successful sign-up.
   * Typically points to onboarding for new users.
   */
  afterSignUpUrl: "/onboarding",
}