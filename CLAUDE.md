# DeployDash — Project Intelligence File

> This file is the single source of truth for Cursor and any AI assistant working on this codebase.
> Read it fully before making any suggestions, generating any code, or modifying any file.
> Do not deviate from the patterns, principles, and structure defined here without explicit instruction.

---

## What is DeployDash

DeployDash is a CLI-based Next.js SaaS starter kit. It is NOT a framework, NOT a monorepo, and NOT a runtime dependency. It is a **code generator**. When a user runs `npx deploydash init`, they get a plain Next.js project with only the code they chose — no packages to import from DeployDash, no runtime coupling, no monorepo overhead. DeployDash's job ends the moment it writes the files.

This project is simultaneously:

1. The **template** — the actual Next.js codebase that gets generated
2. The **proof** — deploydash.com and deploydash.design are built with DeployDash itself

Every file written here will eventually become a template in the CLI. Build it right here first. The CLI copies it later.

---

## Core Philosophy

These are non-negotiable. Every line of code must respect them.

**KISS over cleverness** — The simplest solution that works is always preferred. If you have to explain why an abstraction exists, it probably shouldn't. Generated code must be readable by a junior developer on day one.

**SOLID at the adapter level, KISS at the module level** — Apply SOLID principles (especially Single Responsibility and Dependency Inversion) strictly inside `src/core/`. Inside modules like `waitlist` or `blog`, keep code dead simple and obvious.

**No hasty abstractions** — Do not create a utility, hook, or helper until it is needed in at least two places. Copy-paste once, abstract the second time.

**Tight coupling is a bug** — Modules must never import from each other. Modules import from `core/`, `lib/`, `components/`, and `config/` only. If two modules need the same thing, it belongs in `lib/` or `core/`.

**Separation of concerns** — Route handlers are thin. Business logic lives in `src/server/`. UI components know nothing about data fetching internals. Core knows nothing about modules.

**Document what matters** — Every function in `src/core/` gets a JSDoc comment. Every adapter interface gets documented. Module entry points get a one-paragraph comment explaining what the module does and what it depends on. Do not document the obvious.

**Consistency over preference** — Once a pattern is established, follow it everywhere. Do not introduce a second pattern for the same problem.

---

## V1 vs V2 — Strict Boundary

### DO NOT build anything from V2 until explicitly instructed.

### V1 — What we are building

**Infrastructure (core)**

- Auth — Clerk (roles: admin, user)
- Database — Supabase + Prisma
- Email — Resend
- Billing — Stripe
- Analytics — PostHog
- Logging — Pino
- Rate limiting — Upstash Redis
- API layer — Hono (optional, user opts in — but if opted in, handles ALL routes)
- Permissions — RBAC via Clerk roles
- Environment validation — t3-env + Zod
- Security headers — next.config.ts
- Error handling — global error boundaries + typed error classes

**Feature Modules**

- Authentication pages (sign in, sign up, forgot password)
- Dashboard (app shell, sidebar, topbar, settings)
- Admin dashboard (user management, role assignment)
- Marketing pages (landing, pricing, changelog)
- Waitlist (signup form, referral tracking, admin view, email trigger)
- Onboarding (multi-step wizard, progress persistence)
- Blog (MDX-based, categories, RSS)
- Docs (MDX-based, sidebar nav, search)
- Mailing (transactional email flows — welcome, payment failed, trial ending)
- SEO (metadata API, sitemap, robots.txt, OG images)

**Quality & DX**

- ESLint + Prettier configured
- Vitest + React Testing Library (standard setup)
- Dark mode (CSS variable based, theme toggle)
- Health endpoint (`/api/health`)
- Error boundaries per module
- Composable middleware chain (auth → rate limit → logging)

**Core libraries shipped**

- `zod` — validation everywhere, no exceptions
- `@t3-oss/env-nextjs` — environment variable validation at build time
- `@tanstack/react-query` — all server state, no exceptions
- `react-hook-form` — all forms, paired with zod resolvers
- `@tanstack/react-table` — all data tables
- `cmdk` — command palette (dashboard module)
- `zustand` — client-only global state (UI state only, never server state)
- `pino` — structured logging
- `date-fns` — all date manipulation
- `upstash/redis` + `upstash/ratelimit` — rate limiting

### V2 — Do not touch yet

- Monitoring (Sentry)
- Background jobs
- Internationalization (i18n)
- File uploads / storage
- AI infrastructure
- Additional DB providers (MongoDB, PlanetScale)
- Additional auth providers (Supabase Auth, Better Auth)
- Additional billing providers (Paddle)
- Additional email providers (Mailgun)

---

## Folder Structure

This structure is permanent. Every template in the CLI hardcodes these paths. Do not reorganize without explicit instruction — doing so breaks every generated project.

```
deploydash/
├── content/                        # MDX content (data, not code)
│   ├── blog/
│   └── docs/
├── public/
├── src/
│   ├── core/                       # ⚠️ HANDS OFF — DeployDash infrastructure
│   │   ├── auth/
│   │   │   ├── providers/
│   │   │   │   └── clerk/
│   │   │   ├── index.ts            # exports active auth adapter
│   │   │   ├── middleware.ts       # route protection middleware
│   │   │   ├── types.ts            # AuthAdapter interface
│   │   │   └── roles.ts            # role definitions and helpers
│   │   ├── db/
│   │   │   ├── providers/
│   │   │   │   └── supabase-prisma/
│   │   │   ├── index.ts
│   │   │   └── types.ts            # DbAdapter interface
│   │   ├── billing/
│   │   │   ├── providers/
│   │   │   │   └── stripe/
│   │   │   ├── index.ts
│   │   │   └── types.ts            # BillingAdapter interface
│   │   ├── email/
│   │   │   ├── providers/
│   │   │   │   └── resend/
│   │   │   ├── index.ts
│   │   │   └── types.ts            # EmailAdapter interface
│   │   ├── analytics/
│   │   │   ├── providers/
│   │   │   │   └── posthog/
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── logging/
│   │   │   ├── providers/
│   │   │   │   └── pino/
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── ratelimit/
│   │   │   ├── providers/
│   │   │   │   └── upstash/
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── permissions/
│   │   │   ├── index.ts            # hasRole(), requireRole(), etc.
│   │   │   ├── types.ts
│   │   │   └── roles.ts            # role and permission constants
│   │   ├── env/
│   │   │   └── index.ts            # t3-env schema — add vars here
│   │   └── api/
│   │       ├── providers/
│   │       │   └── hono/           # Hono setup (optional)
│   │       ├── index.ts
│   │       └── types.ts
│   │
│   ├── server/                     # Hono route handlers (user writes here)
│   │   ├── routes/
│   │   │   ├── waitlist.ts
│   │   │   └── billing.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── ratelimit.ts
│   │   └── index.ts                # Hono app instance
│   │
│   ├── app/                        # Next.js App Router (keep lightweight)
│   │   ├── (marketing)/            # public pages
│   │   │   ├── _components/        # marketing-only components
│   │   │   ├── page.tsx            # /
│   │   │   ├── pricing/
│   │   │   └── blog/
│   │   ├── (dashboard)/            # authed app pages
│   │   │   ├── _components/        # dashboard-only components
│   │   │   ├── layout.tsx          # dashboard shell
│   │   │   └── dashboard/
│   │   ├── (auth)/                 # auth pages
│   │   │   ├── _components/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── api/
│   │   │   ├── [[...route]]/
│   │   │   │   └── route.ts        # 5 lines — calls Hono, nothing else
│   │   │   └── health/
│   │   │       └── route.ts        # health check endpoint
│   │   ├── globals.css             # CSS variables — single source of truth for theming
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/                 # shadcn + shared UI only
│   │   ├── ui/                     # shadcn components — never edit manually
│   │   └── shared/                 # used across 2+ surfaces
│   │       ├── ThemeProvider.tsx
│   │       ├── ThemeToggle.tsx
│   │       ├── Logo.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── modules/                    # self-contained feature modules
│   │   ├── waitlist/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types.ts
│   │   │   ├── actions.ts
│   │   │   └── README.md           # what this module does, what it depends on
│   │   ├── onboarding/
│   │   ├── blog/
│   │   └── docs/
│   │
│   ├── lib/                        # utilities and helpers (user writes here)
│   │   ├── utils.ts                # cn() and general helpers
│   │   ├── errors.ts               # typed error classes
│   │   ├── validations/            # shared zod schemas
│   │   └── constants.ts
│   │
│   ├── hooks/                      # shared custom React hooks
│   ├── types/                      # shared TypeScript types and interfaces
│   ├── config/                     # user-facing configuration
│   │   ├── site.ts                 # site name, description, URL, socials
│   │   ├── nav.ts                  # navigation structure
│   │   ├── pricing.ts              # pricing tiers and features
│   │   └── routes.ts               # route path constants
│   └── styles/                     # additional global styles
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/                          # test files mirror src/ structure
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── CLAUDE.md                       # this file
├── AGENTS.md
├── .env.local                      # never commit
├── .env.example                    # always up to date
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── components.json
```

---

## Core Architecture Rules

### The adapter pattern

Every integration in `src/core/` follows this exact pattern. No exceptions.

1. `types.ts` — defines the adapter interface. This is the contract. Once shipped, never remove or rename a method.
2. `providers/[name]/index.ts` — implements the interface for a specific provider.
3. `index.ts` — imports and exports the active provider. This is the only file the rest of the app imports from.

```typescript
// src/core/auth/types.ts
export interface AuthAdapter {
  getUser(): Promise<User | null>
  requireAuth(): Promise<User>
  getSession(): Promise<Session | null>
}

// src/core/auth/providers/clerk/index.ts
import { AuthAdapter } from "../../types"
export const clerkAuthAdapter: AuthAdapter = {
  getUser: async () => { ... },
  requireAuth: async () => { ... },
  getSession: async () => { ... },
}

// src/core/auth/index.ts
export { clerkAuthAdapter as auth } from "./providers/clerk"
export type { AuthAdapter } from "./types"
```

The rest of the app only ever imports from `@/core/auth` — never from `@/core/auth/providers/clerk`. This is the swap point.

### API routes — Hono (when opted in)

`src/app/api/[[...route]]/route.ts` must contain nothing but:

```typescript
import { app } from "@/server"
export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const PATCH = app.fetch
export const DELETE = app.fetch
```

All logic lives in `src/server/routes/`. Route files export a Hono router. The main `src/server/index.ts` composes them. Middleware (auth, rate limiting, logging) is applied in `src/server/index.ts` globally.

### API routes — without Hono

When Hono is not opted in, route handlers live in `src/app/api/[route]/route.ts`. Each handler must:

- Be under 30 lines
- Validate input with Zod before touching any other logic
- Call a function from `src/server/` (or `src/modules/`) for business logic
- Never contain business logic itself
- Return typed responses

### Environment variables

All environment variables are defined in `src/core/env/index.ts` using t3-env. No `process.env.ANYTHING` anywhere else in the codebase. Import `env` from `@/core/env` and use `env.VARIABLE_NAME`. If a variable is not in the schema, it does not exist.

```typescript
// correct
import { env } from "@/core/env"
const secret = env.CLERK_SECRET_KEY

// forbidden
const secret = process.env.CLERK_SECRET_KEY
```

### Logging

Never use `console.log`, `console.error`, or `console.warn` in production code. Import the logger from `@/core/logging` and use structured logging:

```typescript
import { logger } from "@/core/logging"
logger.info({ userId, action: "waitlist.join" }, "User joined waitlist")
logger.error({ err, userId }, "Failed to process payment")
```

### Error handling

Typed error classes live in `src/lib/errors.ts`. Throw typed errors, catch them at the route/action level, and return appropriate responses. Never swallow errors silently.

```typescript
throw new AppError("PAYMENT_FAILED", "Stripe charge failed", { stripeCode })
```

Every module's entry point (page or layout) must be wrapped in an error boundary.

---

## Security Rules — Non-Negotiable

These rules exist because DeployDash's core marketing claim is security. Every generated project must be hardened by default.

**Never trust client input** — validate everything with Zod at the server boundary before any processing. No exceptions.

**Never use `process.env` directly** — use `src/core/env/` only. Unvalidated env vars are a misconfiguration vulnerability.

**Rate limit every public endpoint** — any route accessible without authentication must have Upstash rate limiting applied. Auth routes get the strictest limits.

**Verify Stripe webhook signatures** — never process a Stripe webhook without verifying `stripe.webhooks.constructEvent()`. A missing check here is a critical vulnerability.

**Enforce RLS on every Supabase table** — every table created in Prisma migrations must have corresponding Row Level Security policies. No table is ever accessible without RLS.

**Security headers are required** — `next.config.ts` must always contain the full security headers configuration. Never remove them.

**No secrets in code** — no API keys, secrets, or credentials anywhere in the codebase. Everything goes through `src/core/env/`.

**RBAC on all protected routes** — any route under `(dashboard)` must check authentication. Any route under `(admin)` must check the `admin` role. This is enforced in middleware, not in individual pages.

**Input sanitization** — sanitize all user-generated content before storing or rendering. Use Zod transforms for sanitization at the validation layer.

---

## API Security — The 9 Layers

Every API route must implement these layers. The order is mandatory — do not reorder.

### Layer 1 — HTTPS only

Enforced by the HSTS header in `next.config.ts`. Never allow HTTP in production. Already configured — do not remove it.

### Layer 2 — Authentication (first, always)

Verify who is making the request before doing anything else. Use the auth adapter — never Clerk directly.

```typescript
const user = await auth.requireAuth()
// throws UnauthorizedError if no valid session — never continues past this line
```

### Layer 3 — Authorization (immediately after auth)

Verify the authenticated user is allowed to perform this specific action. Never trust the client to declare their own role or ownership.

```typescript
// role check
if (!hasRole(user, "admin")) {
  return new Response("Forbidden", { status: 403 })
}

// ownership check — always scope queries to the current user
const order = await db.order.findUnique({
  where: { id: orderId, userId: user.id }, // userId scoping is mandatory
})
if (!order) return new Response("Not found", { status: 404 })
```

Never fetch all records and filter client-side:

```typescript
// FORBIDDEN — fetches everything, filters after
const orders = await db.order.findMany()
return orders.filter((o) => o.userId === user.id)

// CORRECT — database only returns this user's records
const orders = await db.order.findMany({ where: { userId: user.id } })
```

### Layer 4 — Rate limiting (before any business logic)

Apply before touching the database or any external service. Different endpoints get different limits.

```typescript
import { ratelimit } from "@/core/ratelimit"

const identifier =
  user?.id ?? request.headers.get("x-forwarded-for") ?? "anonymous"
const { success, reset } = await ratelimit.limit(identifier)
if (!success) {
  return new Response("Too many requests", {
    status: 429,
    headers: { "Retry-After": String(reset) },
  })
}
```

Rate limit tiers:

- **Auth routes** (sign in, sign up, forgot password) — strictest: 5 requests per minute
- **Mutation routes** (create, update, delete) — moderate: 30 per minute
- **Read routes** (get, list) — lenient: 60 per minute
- **Public routes** (waitlist join, contact form) — strict: 10 per minute

### Layer 5 — Input validation (Zod, always)

Parse and validate every input before use. Every request body, every URL param, every query string.

```typescript
const bodySchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  plan: z.enum(["free", "pro", "enterprise"]),
})

const result = bodySchema.safeParse(await request.json())
if (!result.success) {
  return new Response(
    JSON.stringify({ error: "Invalid input", issues: result.error.issues }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  )
}

// only safe to use after parsing
const { email, plan } = result.data
```

Use Zod transforms for sanitization — trim strings, normalize emails, strip HTML:

```typescript
email: z.string().email().toLowerCase().trim()
name: z.string().trim().max(100)
```

### Layer 6 — CSRF protection

Next.js Server Actions have built-in CSRF protection — use them for form mutations. For API routes, Clerk session tokens are same-site cookies which provides CSRF protection automatically. Do not roll your own CSRF tokens.

### Layer 7 — Webhook signature verification

Every incoming webhook must have its signature verified before processing. Never process a webhook event that has not been verified.

```typescript
// Stripe — always verify before processing
const signature = request.headers.get("stripe-signature")
if (!signature) return new Response("Missing signature", { status: 400 })

let event: Stripe.Event
try {
  // raw body is mandatory — never use parsed JSON here
  const rawBody = await request.text()
  event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  )
} catch {
  return new Response("Invalid signature", { status: 400 })
}

// only now is it safe to process the event
```

This pattern applies to every webhook provider — Clerk, Stripe, Resend. Always verify.

### Layer 8 — SQL injection prevention

Prisma parameterizes all queries by default. You get this for free. The one rule: never use `$queryRaw` with string interpolation.

```typescript
// SAFE — Prisma parameterizes automatically
await db.user.findUnique({ where: { email } })

// DANGEROUS — string interpolation in raw query
await db.$queryRaw`SELECT * FROM users WHERE email = ${email}` // still safe with tagged template
await db.$queryRaw(`SELECT * FROM users WHERE email = '${email}'`) // NEVER do this
```

If you need raw queries, use Prisma's tagged template literal `Prisma.sql` which parameterizes safely.

### Layer 9 — Response scoping (never expose more than needed)

Never return a database record directly. Always map to an explicit response type with only the fields the client needs.

```typescript
// FORBIDDEN — exposes passwordHash, internal flags, stripe customer id, etc.
return Response.json(user)

// CORRECT — explicit response shape
return Response.json({
  id: user.id,
  email: user.email,
  name: user.name,
  plan: user.plan,
})
```

Define response types explicitly in `src/types/` and use them consistently.

---

### The complete secure route pattern

Every route handler in DeployDash follows this exact structure. No exceptions.

```typescript
export async function POST(request: Request) {
  // Layer 2 — authentication
  const user = await auth.requireAuth()

  // Layer 4 — rate limiting
  const { success } = await ratelimit.limit(user.id)
  if (!success) return new Response("Too many requests", { status: 429 })

  // Layer 5 — input validation
  const result = mySchema.safeParse(await request.json())
  if (!result.success) return new Response("Invalid input", { status: 400 })

  // Layer 3 — authorization (when needed)
  if (!hasRole(user, "admin")) return new Response("Forbidden", { status: 403 })

  // Layer 8 — Prisma handles SQL injection, Layer 3 — scope to user
  const record = await db.myTable.create({
    data: { ...result.data, userId: user.id },
  })

  // Layer 9 — return only what's needed
  return Response.json({ id: record.id })
}
```

With Hono opted in, layers 2 and 4 become global middleware in `src/server/index.ts`. Individual route handlers only implement layers 3, 5, and 9.

---

## Component Rules

**Color — theming compatibility** — never use raw Tailwind palette classes on themeable elements. Always use semantic classes that map to CSS variables.

```tsx
// forbidden — breaks preset theming
<div className="bg-blue-600 text-white">

// correct — reads from CSS variables, works with any preset
<div className="bg-primary text-primary-foreground">
```

Raw palette classes (`blue-600`, `slate-900`) are only acceptable for elements that must never change with a theme — like a hardcoded status dot.

**`src/components/ui/`** — shadcn components only. Never edit these files manually. Re-run `npx shadcn add` if you need to update them. Never add custom logic to shadcn components — wrap them instead.

**`_components/` folders** — components that are only used by one route group live inside that group's `_components/` folder. Only promote to `src/components/shared/` when a component is used in two or more route groups.

**One component per file** — no exceptions. File name matches the component name exactly.

**No inline styles** — use Tailwind classes. If a Tailwind class doesn't exist for what you need, add it to the theme in `globals.css` or `tailwind.config.ts`.

**Server components by default** — every component is a React Server Component unless it needs interactivity. Add `"use client"` only when necessary. Never put `"use client"` on a layout.

---

## Data Fetching Rules

**Server state — TanStack Query** — all data fetching from the server uses TanStack Query. No `useEffect` + `fetch` anywhere. No exceptions.

**Forms — React Hook Form + Zod** — every form uses React Hook Form with a Zod resolver. No uncontrolled forms. No manual validation.

**Client state — Zustand** — only for genuine client-only global state (UI state: sidebar open/closed, modal state, theme). Never put server data in Zustand. If you're tempted to put something from the server in Zustand, use TanStack Query instead.

**Mutations** — use TanStack Query mutations or Next.js Server Actions. Server Actions are preferred for form submissions. TanStack Query mutations are preferred for programmatic updates.

---

## Module Rules

Every module in `src/modules/` must:

1. Be fully self-contained — all its components, hooks, and types live inside its folder
2. Have a `README.md` explaining what it does, what it depends on, and what env vars it needs
3. Never import from another module
4. Export a clean public API from its `index.ts`
5. Have its own error boundary
6. Be independently testable
7. Declare its dependencies in a manifest at the top of `index.ts`

Module dependency manifest — required on every module and adapter:

/\*\*

- @module billing
- @requires auth — links payments to users. Run: npx deploydash add auth
- @requires db — stores subscription data. Run: npx deploydash add db
- @optional email — sends payment receipts. Run: npx deploydash add email
- @install npx deploydash add billing
- @env STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
  \*/

Module structure:

```
src/modules/[module]/
  components/       # module-specific components
  hooks/            # module-specific hooks
  types.ts          # module types
  actions.ts        # Server Actions for this module
  utils.ts          # module-specific utilities (if needed)
  index.ts          # public API — what the rest of the app can import
  README.md         # required
```

---

## How We Build — Non-Negotiable Process

This is not a suggestion. Every feature, every integration, every module is built this way. No exceptions.

### Vertical slicing

We build one feature completely end to end before touching the next. Never build the full UI layer first, never build the full backend first. One slice = one feature, fully complete.

A slice is only "done" when ALL of these exist:

```
□ types.ts written (interfaces and types first)
□ failing tests written (red)
□ implementation written to make tests pass (green)
□ test output pasted and verified — all green
□ content/docs/[feature].mdx written
□ content/blog/[feature].mdx written
□ CLAUDE.md feature tracker updated
```

If any of these is missing, the slice is not done. Do not start the next slice.

### Slice dependency order

Some slices depend on others. Always follow this order:

```
1. Core infrastructure  → env, logging, errors
2. Auth                 → everything depends on this
3. Database             → needed by all feature modules
4. Permissions          → depends on auth + db
5. Rate limiting        → needed before any public API
6. Billing              → depends on auth + db
7. Email                → depends on env
8. Analytics            → depends on auth
9. Waitlist             → first feature module
10. Dashboard           → depends on auth + db
11. Admin               → depends on auth + permissions
12. Onboarding          → depends on auth + db + email
13. Marketing pages     → mostly independent
14. Blog                → independent
15. Docs                → independent
```

### Red-green testing (TDD)

Every piece of code is test-driven. The order is strict:

```
1. Create the file with a skeleton — empty exports, no logic
2. Write the test file
3. Run the test — confirm it FAILS with a logic error (real red)
4. Paste the failing output — do not skip this
5. Write the minimum implementation to make it pass
6. Run the test again — confirm it PASSES (green)
7. Paste the passing output — do not skip this
8. Refactor if needed, tests must stay green
```

### What counts as real red vs fake red

**Fake red — do not accept this:**

```
Error: Failed to resolve import "@/core/auth/roles"
Tests: no tests
```

This means the file does not exist. The test never ran. This is not a red test.

**Real red — this is what we want:**

```
FAIL core/auth/roles > hasRole returns false for undefined
AssertionError: expected true to be false
Tests: 1 failed, 4 passed
```

The file exists, the test ran, the logic failed. This is a real red.

**Always create the skeleton file first:**

```typescript
// skeleton — just enough to resolve imports, no real logic
export const ROLES = {} as const
export type Role = never
export function hasRole() {
  return false
}
```

Then write the test, get real red, then write the real implementation.

**Cursor must never write implementation code before the failing test exists and real red output has been confirmed.**

### Documentation discipline

Every slice produces two content files. Write them immediately after tests go green — not later, not "when there's time."

**`content/docs/[feature].mdx`** — technical reference for DeployDash users:

- What it does
- How to use it (code examples)
- Configuration options
- Rules and constraints
- Common mistakes

**`content/blog/[feature].mdx`** — build journal entry:

- Why this decision was made
- What alternatives were considered
- What was learned
- What's coming next

Naming convention:

```
content/docs/logging.mdx
content/blog/001-logging-setup.mdx   ← numbered in build order
content/blog/002-env-validation.mdx
content/blog/003-auth-setup.mdx
```

### What "done" looks like in practice

```
✓ wrote tests/unit/core/logging.test.ts  (3 tests — red)
✓ wrote src/core/logging/types.ts
✓ wrote src/core/logging/providers/pino/index.ts
✓ wrote src/core/logging/index.ts
✓ ran tests — all 3 green
✓ wrote content/docs/logging.mdx
✓ wrote content/blog/001-logging-setup.mdx
✓ updated CLAUDE.md tracker: [x] Logging — Pino
→ slice complete. move to next.
```

---

# The testing philosophy behind DeployDash

When I started DeployDash I made a decision early: tests are not an
afterthought. They are part of the definition of done. Every slice —
auth, billing, waitlist, everything — is not complete until it has
tests that would make a senior engineer at Google nod.

Here's the philosophy behind how DeployDash is tested and why.

## The Google standard — it's real and it's documented

Google published their internal engineering standards in a book called
"Software Engineering at Google." The testing chapter is publicly
available and it's the closest thing the industry has to a gold
standard for unit testing.

Their principles, directly quoted:

> Strive for unchanging tests. Test via public APIs. Test state, not
> interactions. Make your tests complete and concise. Test behaviors,
> not methods. Name tests after the behavior being tested. Don't put
> logic in tests. Write clear failure messages. Follow DAMP over DRY.

Let me break down what each of these means in practice for a Next.js
TypeScript codebase.

## Test behaviors, not methods

This is the biggest mindset shift. Most developers write one test per
function. Google says write one test per **behavior**.

A single function can have many behaviors:

```typescript
// hasRole has at least 5 distinct behaviors worth testing:
// 1. returns true when roles match
// 2. returns false when roles don't match
// 3. returns false for undefined (unauthenticated user)
// 4. returns false for empty string
// 5. is case sensitive
// 6. never throws for any input
```

Each behavior gets its own `it()` block with a name that describes
exactly what it does — not "hasRole test 1" but
"returns false when user is unauthenticated."

## DAMP over DRY in tests

DRY (Don't Repeat Yourself) is good advice for production code.
In tests it's the wrong instinct.

DAMP — Descriptive And Meaningful Phrases — means each test is
self-contained and readable without jumping around the file.

```typescript
// DRY — bad for tests
const adminUser = createUser({ role: "admin" })

it("allows admin", () => expect(hasRole(adminUser.role, "admin")).toBe(true))
it("blocks user", () => expect(hasRole(adminUser.role, "user")).toBe(false))
// adminUser is defined elsewhere — reader has to scroll to understand

// DAMP — good for tests
it("returns true when user has admin role", () => {
  expect(hasRole("admin", "admin")).toBe(true)
  // everything needed is right here
})
```

## The AAA pattern — non-negotiable structure

Every test in DeployDash follows Arrange, Act, Assert:

```typescript
it("returns null when auth is not configured", async () => {
  // Arrange — set up the world
  vi.stubEnv("CLERK_SECRET_KEY", "")

  // Act — run the code
  const user = await auth.getUser()

  // Assert — verify the result
  expect(user).toBeNull()
})
```

When a test fails, this structure tells you immediately:

- What state the world was in (Arrange)
- What triggered the failure (Act)
- What was expected vs what happened (Assert)

## Name tests like documentation

Test names are the first thing you read when a build fails in CI.
They should tell you exactly what broke without reading the code.

```typescript
// Useless name — what broke?
it("works correctly")

// Good name — immediately actionable
it("throws UNAUTHORIZED when session has expired")
it("returns false when user has no role assigned in Clerk metadata")
it("falls back to null adapter when CLERK_SECRET_KEY is missing")
```

## What we test in DeployDash

Every adapter in `src/core/` — these are the most critical. If the
auth adapter is wrong, nothing works. Full coverage, every behavior.

Every utility in `src/lib/` — errors, setup detection, validators.
These are pure functions — easy to test, no excuses for skipping.

Every server action in every module — this is where business logic
lives. A bug in `joinWaitlist()` means real users can't join your
waitlist. Test it thoroughly.

Every Zod schema — valid input, invalid input, boundary values. Zod
schemas are your first line of defense against bad data.

## What we don't test

shadcn UI components — they're third-party, they're tested upstream.

Pure layout components with no logic — a `DashboardShell` that just
renders children doesn't need a test.

Config files — `src/config/routes.ts` is just data. No logic, no test.

## The red-green discipline

Before writing any implementation, we write a failing test. Not a
"file not found" error — a real logical failure. The skeleton file
exists, the test runs, and it fails because the behavior isn't
implemented yet. That's real red.

Then we write the minimum code to make it pass. Then we refactor
if needed. Tests stay green throughout.

This discipline ensures tests actually test something. If you write
tests after implementation, you tend to write tests that confirm what
you just wrote, not tests that verify correct behavior.

## The coverage checklist

For every function or module, run through this checklist before
considering tests complete:

```
happy path        → correct output with valid input
sad path          → correct error/null with invalid input
edge cases        → empty string, null, undefined, 0, []
boundaries        → max length, min length, exact limits
error messages    → throws the RIGHT error with the RIGHT message and code
type safety       → unexpected types don't cause silent failures
independence      → tests never depend on each other
no side effects   → each test cleans up after itself (beforeEach/afterEach)
```

This checklist came from bitter experience. Every item on it maps to
a real class of bug that slips through shallow tests:

**Happy path only** — the most common mistake. Tests pass in ideal
conditions, fail the moment a user does something unexpected.

**Missing sad path** — what happens when `getUser()` returns null?
When the database is down? When the webhook signature is invalid?
These are the paths that matter most in production.

**Skipping edge cases** — empty strings look like falsy values but
behave differently than null. `undefined` and `null` are different.
An empty array `[]` is truthy. These catch you if you don't test them.

**Ignoring boundaries** — a Zod schema with `z.string().max(100)`
should be tested at exactly 100 characters, 101 characters, and 0
characters. Not just "some string."

**Wrong error messages** — throwing the right error TYPE but with
the wrong CODE or MESSAGE is still a bug. Test both.

**Type safety gaps** — TypeScript catches most of this at compile
time but runtime values from APIs, webhooks, and form data are
untyped. Test that your validation handles garbage input gracefully.

**Test interdependence** — if test B only passes because test A ran
first, you have a hidden dependency. Tests must be runnable in any
order. `vi.resetModules()` and `vi.unstubAllEnvs()` in `beforeEach`
and `afterEach` prevents this.

**Side effects** — a test that modifies a shared variable, writes
to a file, or leaves a stubbed env var in place poisons every test
that runs after it. Always clean up.

Run this checklist mentally for every `describe` block you write.
If any item is missing, add the test before moving on.

## The result

A codebase where:

- Every public API is tested against its contract
- Failure messages tell you exactly what broke
- Tests read like documentation
- Refactoring is safe because tests catch regressions
- New contributors understand expected behavior from test names alone

That's the standard. That's what DeployDash ships.

---

## Testing Rules

Testing stack: **Vitest + React Testing Library**

Test files mirror `src/` structure inside `tests/`:

- `tests/unit/` — pure functions, utilities, adapter logic
- `tests/integration/` — API routes, server actions, database interactions
- `tests/e2e/` — critical user flows (sign up, checkout, waitlist join)

**What must be tested:**

- Every function in `src/core/` — adapters, permissions, env validation
- Every API route handler
- Every server action in every module
- Every Zod schema
- Every utility in `src/lib/`
- Critical UI flows (forms submitting, auth redirects)

**What doesn't need tests:**

- shadcn components in `src/components/ui/`
- Pure layout components with no logic
- Config files

**Test naming:**

```typescript
describe("waitlist.join", () => {
  it("adds email to waitlist when valid", async () => { ... })
  it("returns error when email already exists", async () => { ... })
  it("rate limits after 5 attempts", async () => { ... })
})
```

---

## Code Style

**TypeScript — strict mode always.** `tsconfig.json` has `strict: true`. No `any`. No type assertions unless absolutely unavoidable — and if unavoidable, add a comment explaining why.

**Zod for all validation.** Every external input (API request body, form data, env vars, URL params) is parsed with Zod before use. If it hasn't been parsed, it hasn't been validated.

**Named exports only.** No default exports except for Next.js pages and layouts (which Next.js requires as default exports). Everything else is a named export.

**No barrel files that re-export everything.** Only export what external code actually needs. Barrel files that export everything create circular dependency risks and slow down TypeScript.

**Async/await over .then().catch().** Always. No promise chains.

**Early returns over nested conditionals:**

```typescript
// correct
if (!user) return { error: "Unauthorized" }
if (!user.hasRole("admin")) return { error: "Forbidden" }
return { data: await getAdminData() }

// forbidden
if (user) {
  if (user.hasRole("admin")) {
    return { data: await getAdminData() }
  } else {
    return { error: "Forbidden" }
  }
} else {
  return { error: "Unauthorized" }
}
```

**Import order** (enforced by ESLint):

1. Node built-ins
2. External packages
3. Internal aliases (`@/core`, `@/lib`, `@/components`)
4. Relative imports

---

## Naming Conventions

| Thing                   | Convention         | Example                        |
| ----------------------- | ------------------ | ------------------------------ |
| Files (components)      | PascalCase         | `WaitlistForm.tsx`             |
| Files (everything else) | kebab-case         | `waitlist-actions.ts`          |
| Components              | PascalCase         | `WaitlistForm`                 |
| Functions               | camelCase          | `joinWaitlist()`               |
| Constants               | SCREAMING_SNAKE    | `MAX_WAITLIST_ENTRIES`         |
| Types / Interfaces      | PascalCase         | `WaitlistEntry`                |
| Zod schemas             | camelCase + Schema | `waitlistEntrySchema`          |
| Env vars                | SCREAMING_SNAKE    | `RESEND_API_KEY`               |
| Database tables         | snake_case         | `waitlist_entries`             |
| CSS variables           | kebab-case         | `--color-primary`              |
| Route paths             | kebab-case         | `/sign-in`, `/admin-dashboard` |

---

## Git Conventions

Commit message format: `type(scope): description`

Types: `feat`, `fix`, `security`, `refactor`, `test`, `docs`, `chore`

Examples:

```
feat(waitlist): add referral tracking
fix(auth): correct middleware redirect on expired session
security(billing): enforce webhook signature verification
test(waitlist): add integration tests for join action
```

---

## What Cursor Should Never Do

- Do not write implementation before a failing test exists
- Do not skip pasting red test output before writing implementation
- Do not skip pasting green test output before marking a slice done
- Do not start a new slice before the current one is fully complete
- Do not skip writing docs and blog entries — they are part of done
- Do not install packages without being asked
- Do not create new folders outside the defined structure
- Do not add `console.log` to production code
- Do not use `any` in TypeScript
- Do not create abstractions for things that only exist once
- Do not import from `src/core/auth/providers/clerk` directly — always use `src/core/auth`
- Do not put business logic in `src/app/api/` route handlers
- Do not edit files in `src/components/ui/` manually
- Do not use `process.env` directly anywhere
- Do not build anything from the V2 list
- Do not add packages not in the approved stack without asking
- Do not use default exports except for Next.js pages and layouts
- Do not import from one module into another module

---

## Approved Package List

If a package is not on this list, ask before installing.

**Core framework**

- `next`, `react`, `react-dom`
- `typescript`

**Styling**

- `tailwindcss`, `tailwind-merge`, `tailwind-animate`
- `class-variance-authority`, `clsx`
- `shadcn/ui` components (via CLI only)

**Auth**

- `@clerk/nextjs`

**Database**

- `@prisma/client`, `prisma`
- `@supabase/supabase-js`

**Billing**

- `stripe`

**Email**

- `resend`
- `@react-email/components`, `react-email`

**Analytics**

- `posthog-js`, `posthog-node`

**API**

- `hono` (optional)

**Validation**

- `zod`
- `@t3-oss/env-nextjs`

**Forms**

- `react-hook-form`
- `@hookform/resolvers`

**Data fetching**

- `@tanstack/react-query`
- `@tanstack/react-query-devtools`

**Tables**

- `@tanstack/react-table`

**State**

- `zustand`

**Logging**

- `pino`, `pino-pretty`

**Rate limiting**

- `@upstash/redis`, `@upstash/ratelimit`

**Command palette**

- `cmdk`

**Dates**

- `date-fns`

**Content**

- `contentlayer2` or `next-mdx-remote` (for blog and docs)

**Testing**

- `vitest`
- `@testing-library/react`, `@testing-library/user-event`
- `@vitejs/plugin-react`
- `msw` (API mocking)

**DX**

- `eslint`, `prettier`
- `@types/node`, `@types/react`

---

## Feature Status Tracker

Update this as features are completed.

### Infrastructure

- [x] Next.js project setup
- [x] Security headers (next.config.ts)
- [x] Environment validation (t3-env + Zod)
- [x] Folder structure finalized
- [ ] Adapter interfaces defined (core/\*/types.ts)
- [x] Auth adapter — Clerk
- [x] DB adapter — Supabase + Prisma
- [ ] Email adapter — Resend
- [ ] Billing adapter — Stripe
- [ ] Analytics adapter — PostHog
- [x] Logging — Pino
- [ ] Rate limiting — Upstash
- [x] Permissions — RBAC (admin, user)
- [ ] Hono setup (optional)
- [x] Middleware chain (auth → ratelimit → logging)
- [ ] Health endpoint (/api/health)
- [ ] Monitoring module (health endpoint + status page)
- [x] Error boundary architecture
- [ ] Dark mode

### Feature Modules

- [ ] Auth pages (sign in, sign up, forgot password)
- [ ] Dashboard shell (sidebar, topbar, settings)
- [ ] Admin dashboard
- [ ] Marketing pages (landing, pricing, changelog)
- [ ] Waitlist module
- [ ] Onboarding module
- [ ] Blog module (MDX)
- [ ] Docs module (MDX)
- [ ] Mailing flows (welcome, payment failed, trial ending)
- [ ] SEO (metadata, sitemap, robots.txt, OG images)

### Quality

- [x] ESLint configured
- [x] Prettier configured
- [x] Vitest configured
- [ ] Unit tests — core adapters
- [ ] Integration tests — API routes
- [ ] E2E tests — critical flows

---

_This file is a living document. Update the feature tracker as things are completed. Update rules and patterns as the codebase evolves. Never delete a rule without replacing it with a better one._
