# FlagMeter Agent Guidelines

## Build & Test Commands
- **Dev**: `pnpm dev` (full stack), `cd apps/dashboard && pnpm dev` (dashboard only), `cd apps/worker && pnpm dev` (worker only)
- **Test**: `cd apps/dashboard && pnpm test` (run all), `cd apps/dashboard && pnpm test -- <file>` (single test)
- **Typecheck**: `pnpm typecheck` (all packages)
- **Database**: `pnpm db:push` (apply schema), `pnpm db:studio` (Drizzle Studio)
- **Lint**: `pnpm lint` (all packages)

## Code Style
- **TypeScript**: Strict mode enabled (`strict: true`), no unused locals/parameters, explicit types for exported functions
- **Imports**: Use `@/` or `~/` for local imports, workspace packages via `@flagmeter/db` or `@flagmeter/types`
- **Formatting**: 2-space indent, single quotes preferred, trailing commas
- **Naming**: camelCase for variables/functions, PascalCase for types/components, UPPER_SNAKE for constants
- **Error Handling**: Use try-catch with logger (pino), return JSON errors with status codes (`json({ error: 'message' }, { status: 400 })`)
- **Validation**: Use Zod schemas (`z.object()`) for request validation, call `.safeParse()` and check `success`
- **Database**: Drizzle ORM with explicit types (`typeof table.$inferSelect`), use `eq()`, `and()` from drizzle-orm for queries
- **React**: TanStack Router (`createFileRoute`), functional components, hooks over classes
- **Logging**: Use structured logging with pino (`logger.info({ context }, 'message')`)

## Shadcn Components
- Install components via: `pnpx shadcn@latest add <component>`
