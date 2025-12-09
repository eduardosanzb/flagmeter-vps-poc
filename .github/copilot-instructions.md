# FlagMeter Agent Guidelines

> **AI-quota microservice**: Event ingestion → Valkey queue → Worker aggregation → PostgreSQL rollups → Dashboard + Slack webhooks at 80% quota

## Quick Start
- **Stack**: Node 20 LTS + PostgreSQL 18 + Valkey + TanStack Start + Drizzle ORM + shadcn/ui
- **Structure**: Monorepo (pnpm workspace) - `apps/` (dashboard, worker, landing) + `packages/` (db, types, telemetry) + `infra/`
- **Dev Setup**: Copy `.env.example` → `.env`, then `./dev.sh` (starts Postgres, Valkey, Prometheus, Grafana, Loki via Docker)

## Build & Commands
- **Dev**: `pnpm dev` (Docker full stack), `cd apps/dashboard && pnpm dev` (dashboard only on :3000), `cd apps/worker && pnpm dev` (worker only)
- **Test**: `cd apps/dashboard && pnpm test` (all tests), `cd apps/dashboard && pnpm test -- <file>` (single test via vitest)
- **Typecheck**: `pnpm typecheck` (all packages)
- **Database**: `./migrate.sh` (apply migrations), `./reset-db.sh` (drop & recreate), `pnpm db:studio` (Drizzle Studio), `cd packages/db && pnpm db:seed` (test data)
- **Lint**: `pnpm lint` (all packages)
- **Load Test**: `docker build -t flagmeter-load infra/load-test && docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 flagmeter-load` (targets: 1k rps, P99 ≤200ms)

## Code Style
- **TypeScript**: Strict mode (`strict: true`), no unused locals/parameters, explicit return types for exported functions/hooks
- **Imports**: Use `@/` or `~/` for local imports (configured via tsconfig `paths`), workspace packages via `@flagmeter/db`, `@flagmeter/types`, `@flagmeter/telemetry`
- **Formatting**: 2-space indent, single quotes, trailing commas, ES2022 target
- **Naming**: camelCase (vars/functions), PascalCase (types/components), UPPER_SNAKE (constants)
- **Error Handling**: Try-catch with pino logger (`logger.error({ err, context }, 'message')`), return JSON errors with status (`json({ error: 'message' }, { status: 400 })`)
- **Validation**: Zod schemas (`z.object()`), use `.safeParse()` and check `success`
- **Database**: Drizzle ORM with explicit types (`typeof table.$inferSelect`), use `eq()`, `and()` helpers, raw SQL for hot paths
- **React**: TanStack Router (`createFileRoute`), functional components, hooks over classes
- **Logging**: Structured pino logs (`logger.info({ tenant, tokens }, 'Event ingested')`)

## Observability
- **Telemetry**: Auto-instrumented via `@flagmeter/telemetry` (OpenTelemetry) - HTTP, PostgreSQL, Redis, Node.js runtime metrics
- **Metrics Ports**: Dashboard `:9464/metrics`, Worker `:9465/metrics`
- **Dashboards**: Grafana (http://localhost:3001, admin/admin) - HTTP latency (p50/p95/p99), queue depth, DB connections, worker concurrency, memory/CPU
- **Queries**: See `PROMETHEUS_QUERIES.md` for examples (e.g., `rate(http_server_requests_total[1m])`, `histogram_quantile(0.99, rate(http_server_duration_bucket[5m]))`)
- **Logs**: Loki (http://localhost:3100) collects structured logs from dashboard + worker via pino-loki transport
  - **Labels**: `service` (dashboard/worker), `environment` (dev/prod), `level` (info/warn/error)
  - **Example Queries**: `{service="dashboard"}`, `{service="worker", level="error"}`, `{service="dashboard"} |= "tenant"`
  - **Grafana**: Explore → Select "Loki" datasource → Use LogQL queries to filter and search logs
  - **Test Logs**: `cd apps/dashboard && node test-logs.mjs` (generates sample logs for testing)

## Deployment

### Docker Swarm Architecture (2-Server Setup)

**Deployment Configs:**
- `coolify.yaml` - All-in-one single-server config (backup/reference)
- `coolify.observability.yaml` - Observability stack (deploys to manager node)
- `coolify.app.yaml` - Application stack (deploys to worker node)

**Server Topology:**

**Manager Node (CAX21 recommended):**
- Role: Swarm manager + observability
- Services: Prometheus, Grafana, Loki
- Resources: ~1GB RAM, 0.6 CPU
- Scrapes metrics from worker via overlay network

**Worker Node (CAX11 for testing, CAX21 for production):**
- Role: Swarm worker + application + databases
- Services: Dashboard, Worker, PostgreSQL, Valkey, Exporters
- Resources: ~4GB RAM, 2.0 CPU (maxed for load testing)
- Exposes: :3000 (dashboard app) to internet
- Metrics ports (9464, 9465) only accessible via overlay network

**Network Architecture:**
- Overlay network: `flagmeter-net` (private communication between nodes)
- Prometheus scrapes `dashboard:9464` and `worker:9465` via overlay
- No metrics ports exposed to internet (security)
- Only dashboard :3000 and Grafana :3001 publicly accessible

**Setup Steps:**
1. Init Swarm on manager: `docker swarm init --advertise-addr <MANAGER_IP>`
2. Join worker: `docker swarm join --token <TOKEN> <MANAGER_IP>:2377`
3. Create overlay network: `docker network create --driver overlay --attachable flagmeter-net`
4. Deploy observability: `docker stack deploy -c coolify.observability.yaml obs`
5. Deploy app: `docker stack deploy -c coolify.app.yaml app`

**Hetzner Configuration:**
- Setup private network (10.0.0.0/16) between servers
- Attach manager + worker to private network
- Swarm traffic goes over private network (faster, free bandwidth)

**Load Testing Goal:**
- Isolate observability on manager node
- Pure app performance testing on worker node
- Find max RPS @ P90 <250ms on CAX11 without observability overhead

### Single-Server Deployment (Coolify)
- **Coolify**: Push to `main` → auto-deploy with zero downtime, auto-HTTPS via Let's Encrypt, branch previews at `pr-{n}.meter.yourdomain.com`
- **Environment**: Set `DATABASE_URL`, `VALKEY_URL`, `NODE_ENV=production`, `WORKER_CONCURRENCY=4`, `GF_SECURITY_ADMIN_PASSWORD` in Coolify UI
- **Migrations**: First deploy: `cd /app/packages/db && pnpm db:push:force` in Coolify terminal
- **Target VPS Options**:
  - **CAX21** (ARM64, 4 vCPU, 8GB RAM, €7.59/mo): Current production, handles 500+ RPS sustained, ~1000 RPS peak with optimized PostgreSQL config
  - **CAX11** (ARM64, 2 vCPU, 4GB RAM, €3.79/mo): Target for cost optimization, handles 250-350 RPS sustained, requires tuned PostgreSQL config

## PostgreSQL Configuration
- **Location**: Inline command arguments in `coolify.yaml` postgres service
- **Optimization**: Tuned for heavy write workload (INSERT ... ON CONFLICT upserts), 500+ RPS sustained
- **Critical Settings**:
  - `synchronous_commit=off`: 2-3x write throughput, reduces CPU by 40-60% (acceptable for metrics data)
  - `max_wal_size=3GB`: Reduces checkpoint frequency from every 2-3min to every 10-15min
  - `shared_buffers=1GB` (CAX21) or `512MB` (CAX11)
  - `checkpoint_timeout=900`: Spreads checkpoint I/O over longer periods
- **Server Selection**: Edit `coolify.yaml` postgres command section to switch between CAX21/CAX11 settings
- **Performance Impact**: Before tuning: 103% CPU @ 500 RPS → After tuning: 50-60% CPU @ 500 RPS
- **Documentation**: See `infra/postgres/README.md` for monitoring queries, troubleshooting, and CAX21↔CAX11 migration guide
- **Validation**: After deploy, connect to postgres and run `SHOW synchronous_commit;` to verify settings applied

## API Endpoints
- `POST /api/events` - Ingest event: `{ "tenant": "acme-corp", "feature": "gpt-4-turbo", "tokens": 1500 }`
- `GET /api/usage/:tenant` - Current month usage with quota percent
- `GET /api/health` - Health check

## Shadcn Components
- Install via: `pnpx shadcn@latest add <component>` (configured at `apps/dashboard/components.json`)
