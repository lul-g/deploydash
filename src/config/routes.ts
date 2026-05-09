/**
 * Route configuration for DeployDash.
 * THIS is the file users edit to control route protection.
 * The middleware reads this — never edit the middleware directly.
 *
 * Patterns support regex — use (.*) for wildcards.
 * Example: "/blog(.*)" matches /blog, /blog/post-1, /blog/category/x
 */
export const routeConfig = {
    /**
     * Routes accessible without authentication.
     * Add any public-facing page here.
     */
    publicRoutes: [
      "/",
      "/pricing",
      "/blog(.*)",
      "/docs(.*)",
      "/sign-in(.*)",
      "/sign-up(.*)",
      "/api/health",
      "/api/webhooks(.*)", // webhooks are verified by signature, not auth
    ],
  
    /**
     * Routes that require the admin role.
     * Authenticated users without admin role get a 403.
     */
    adminRoutes: [
      "/admin(.*)",
    ],
  
    /**
     * Where to redirect unauthenticated users.
     * Change this if your sign-in page is at a different path.
     */
    signInUrl: "/sign-in",
  
    /**
     * Where to redirect after successful sign-in.
     */
    afterSignInUrl: "/dashboard",
  
    /**
     * Where to redirect after successful sign-up.
     */
    afterSignUpUrl: "/onboarding",
}