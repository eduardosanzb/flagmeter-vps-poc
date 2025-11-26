# FlagMeter - Project Handover Document

## Project Overview

**FlagMeter** is a high-performance, cost-efficient microservice designed to monitor and track AI token usage (quotas) for SaaS platforms. It ingests token usage events, aggregates them every minute, displays live usage metrics through a dashboard, and sends Slack notifications when usage exceeds quota thresholds.

### Key Characteristics
- **Single VPS deployment** (≤ €45/month cost)
- **AI-quota focused** - specifically built for tracking AI model token consumption
- **Real-time aggregation** - minute-level rollups with live dashboard updates
- **Alert system** - Slack webhook triggers at 80% quota threshold
- **Full observability** - Prometheus, Grafana, and Loki integration
- **Production-ready** - Zero-downtime deployment via Coolify

---

## Architecture

### High-Level Flow

```
Client Events
    ↓
POST /events (API)
    ↓
Valkey Queue (LPUSH)
    ↓
Worker (BRPOP + Aggregation)
    ↓
PostgreSQL (Rollups & Events)
    ↓
Dashboard (Real-time usage)
    ↓
Slack Webhooks (Alerts at 80%)
```

### Components

1. **API Server (apps/dashboard)**
   - Receives POST requests at `/events` endpoint
   - Serves live dashboard at `/usage`
   - Exposes metrics for Prometheus scraping
   - Built with TanStack Start + React

2. **Worker (apps/worker)**
   - Consumes events from Valkey queue
   - Aggregates tokens by tenant+feature+minute
   - Upserts rollups into PostgreSQL
   - Sends Slack webhooks when quota threshold exceeded

3. **Database (packages/db)**
   - PostgreSQL 18 Alpine
   - Manages schema via Drizzle ORM
   - Stores events, rollups, tenants, and webhook configs

4. **Queue (Valkey)**
   - Redis-compatible in-memory queue
   - Decouples event ingestion from processing
   - Handles backpressure gracefully

---

## Technology Stack

### Runtime & Languages
- **Node.js**: 20 LTS (TypeScript throughout)
- **TypeScript**: 5.x for type safety
- **pnpm**: Workspace package manager

### Framework & Web
- **TanStack Start**: Full-stack React framework
- **React**: 19.2.0 for UI components
- **Vite**: Build tool & dev server
- **TailwindCSS**: 4.x for styling
- **shadcn/ui**: Headless UI component library

### Database & Data
- **PostgreSQL**: 18 Alpine for relational data
- **Drizzle ORM**: Schema-first migrations & querying
- **Postgres (node)**: Native PostgreSQL client
- **ioredis**: Redis/Valkey client for queue operations

### Observability & Monitoring
- **Prometheus**: Metrics collection & scraping
- **Grafana**: Visualization & dashboards
- **Loki**: Log aggregation
- **Pino**: Structured logging (JSON format)

### Deployment & Infrastructure
- **Docker & Docker Compose**: Containerization
- **Coolify**: Single-VPS deployment platform
- **Zero-downtime deployment**: Built-in support

### Testing & Development
- **Vitest**: Unit & integration test runner
- **Testing Library**: React component testing
- **tsx**: TypeScript execution for Node scripts
- **Zod**: Schema validation (API requests)

---

## Monorepo Structure

```
flagmeter/
├── apps/
│   ├── dashboard/           # TanStack Start API + React Dashboard
│   │   ├── src/
│   │   │   ├── routes/      # File-based routing (TanStack Router)
│   │   │   ├── components/  # React components (shadcn/ui based)
│   │   │   └── server/      # Server handlers & API routes
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── worker/              # Queue consumer & aggregator
│       ├── src/
│       │   ├── index.ts     # Main worker loop
│       │   └── services/    # Business logic
│       └── package.json
│
├── packages/
│   ├── db/                  # Drizzle schema & migrations
│   │   ├── schema.ts        # Table definitions
│   │   ├── migrations/      # SQL migration files
│   │   └── seed.ts          # Database seeding script
│   │
│   └── types/               # Shared TypeScript types
│       ├── index.ts         # Type exports
│       └── events.ts        # Event type definitions
│
├── infra/
│   ├── docker/
│   │   ├── Dockerfile.dashboard
│   │   ├── Dockerfile.worker
│   │   ├── init-db.sh       # Database initialization
│   │   └── ...
│   │
│   ├── grafana/
│   │   └── provisioning/    # Pre-built dashboard configs
│   │
│   └── load-test/           # k6 performance test suite
│       └── load.js
│
├── compose.dev.yml          # Development environment (all services)
├── docker-compose.yml       # Production stack
├── drizzle.config.ts        # Drizzle configuration
├── pnpm-workspace.yaml      # Workspace definition
├── package.json             # Root scripts
└── .env.example             # Environment template
```

---

## Database Schema

### Tables

1. **tenants**
   - `id` (UUID, PK)
   - `name` (String)
   - `monthly_quota` (Integer - total tokens allowed)
   - `billing_day` (Integer - day of month quota resets)

2. **events**
   - `id` (UUID, PK)
   - `tenant` (String, FK)
   - `feature` (String - e.g., "gpt-4-turbo")
   - `tokens` (Integer)
   - `created_at` (Timestamp)

3. **rollups**
   - `tenant` (String, FK)
   - `feature` (String)
   - `minute` (Timestamp - bucketed to minute)
   - `total_tokens` (Integer)
   - `updated_at` (Timestamp)
   - *Composite PK: (tenant, feature, minute)*

4. **slack_webhooks**
   - `tenant` (String, FK)
   - `url` (String - Slack incoming webhook URL)
   - `enabled` (Boolean)

---

## API Endpoints

### POST /events
**Ingest token usage event**

Request body:
```json
{
  "tenant": "acme-corp",
  "feature": "gpt-4-turbo",
  "tokens": 1500
}
```

Response: `200 OK`

---

### GET /usage/:tenant
**Retrieve current month usage**

Query params:
- `tenant` (path param) - tenant identifier

Response:
```json
{
  "tenant": "acme-corp",
  "minute": "2025-11-25T14:32:00Z",
  "totalTokens": 820000,
  "quotaPercent": 82
}
```

---

## Key Features

### 1. Real-Time Event Ingestion
- Accepts POST requests with tenant, feature, and token count
- Events immediately pushed to Valkey queue
- Response time: P99 ≤ 200ms at 1,000 RPS

### 2. Minute-Level Aggregation
- Worker consumes events every second
- Groups by tenant + feature + minute
- Upserts rollups for efficient storage

### 3. Live Dashboard
- Real-time usage metrics by tenant
- Visual quota percentage display
- Auto-refresh with WebSocket support

### 4. Quota Alerts
- Slack webhook sent when usage exceeds 80%
- Configurable per tenant via `slack_webhooks` table
- Only fires once per threshold transition

### 5. Observability Stack
- **Prometheus**: Scrapes metrics from API & Worker
- **Grafana**: Pre-built dashboards with:
  - HTTP request latency (P50/P95/P99)
  - Queue depth monitoring
  - PostgreSQL connection pool stats
  - Worker concurrency levels
  - Memory & CPU usage
- **Loki**: Log aggregation (structured JSON logs)

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Throughput | 1,000 requests/sec |
| Latency (P99) | ≤ 200ms |
| Memory | ≤ 2GB total |
| Storage | External PostgreSQL volume |

---

## Development Environment

### Prerequisites
- Docker & Docker Compose
- pnpm (for local scripts only)
- No local Node.js/PostgreSQL needed (all containerized)

### Quick Start

```bash
# Clone and navigate
git clone https://github.com/eduardosanzb/flagmeter.git
cd flagmeter

# Start dev environment (builds all containers)
pnpm dev

# Services available at:
# - Dashboard: http://localhost:3000
# - Grafana: http://localhost:3001 (admin/admin)
# - Prometheus: http://localhost:9090
# - PostgreSQL: localhost:5432
# - Valkey: localhost:6379
```

### Shutdown
```bash
pnpm dev:down  # Stops all containers and removes volumes
```

---

## Deployment

### Deployment Platform
- **Coolify** at `https://cool.eduardosanzb.dev/`
- Supports zero-downtime deployments
- Automatic HTTPS/SSL
- Branch previews for PRs

### Deployment Steps

1. **Connect Repository**
   - Add this GitHub repo to Coolify dashboard

2. **Select Deployment Method**
   - Choose `docker-compose.yml` as the deployment configuration

3. **Configure Environment**
   - Set `DATABASE_URL` (PostgreSQL connection string)
   - Set `VALKEY_URL` (Redis/Valkey connection string)
   - Add Slack webhook URLs in database or via env

4. **Deploy**
   - Push to `main` branch for production
   - PRs auto-deploy to `pr-{n}.meter.yourdomain.com`

### Environment Variables

See `.env.example` for full list. Key variables:

```
DATABASE_URL=postgresql://user:pass@db:5432/flagmeter
VALKEY_URL=redis://valkey:6379
LOG_LEVEL=info
```

---

## Load Testing

### Running Load Tests

```bash
# Build load test image
docker build -t flagmeter-load infra/load-test

# Run against local/remote instance
docker run --rm --network=host flagmeter-load
```

### Expected Results
- **Throughput**: 1,000 RPS sustained
- **Latency**: P99 ≤ 200ms
- **Success Rate**: 99.9%+

The load test uses **k6** and is defined in `infra/load-test/load.js`.

---

## Important Files & Directories

| Path | Purpose |
|------|---------|
| `apps/dashboard` | API server & React dashboard |
| `apps/worker` | Event processing worker |
| `packages/db` | Database schema & migrations |
| `packages/types` | Shared TypeScript types |
| `infra/docker` | Dockerfile definitions |
| `infra/grafana` | Pre-built Grafana dashboards |
| `compose.dev.yml` | Development services |
| `docker-compose.yml` | Production services |
| `.env.example` | Environment variables template |

---

## Common Tasks

### Database Schema Changes
```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations
pnpm db:push

# View database in Drizzle Studio
pnpm db:studio
```

### Running Tests
```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test -- --coverage
```

### Type Checking
```bash
# Check all types
pnpm typecheck
```

### Linting
```bash
# Lint all packages
pnpm lint
```

---

## Known Limitations & TODOs

### Current Limitations
- No authentication/authorization (all tenants publicly accessible)
- No rate limiting on `/events` endpoint
- Webhook signatures not verified
- Basic observability (could expand metrics)
- No automated backups configured

### Recommended Improvements
1. Add JWT/API key authentication
2. Implement per-tenant rate limiting
3. Add HMAC signature verification for Slack webhooks
4. Expand Prometheus metrics (business logic metrics)
5. Set up automated PostgreSQL backups
6. Add data retention/archival policies
7. Implement webhook retry logic
8. Add circuit breaker for Slack API calls

---

## Cost Breakdown (€45/month estimate)

| Service | Cost | Notes |
|---------|------|-------|
| VPS (Single) | €30 | 2GB RAM, 1 vCPU (Hetzner/similar) |
| PostgreSQL Storage | €8-12 | External managed DB if needed |
| Monitoring | €3-5 | Grafana Cloud (optional) |

---

## Support & Contact

- **Repository**: https://github.com/eduardosanzb/flagmeter
- **Author**: Eduardo Sanchez
- **License**: MIT

---

## Next Steps for New Agents

1. **Setup Development Environment**
   - Clone the repo and run `pnpm dev`
   - Verify all services start (Dashboard, Grafana, Prometheus)

2. **Understand the Event Flow**
   - Trace a request: `/events` → Valkey Queue → Worker → PostgreSQL
   - Review `apps/dashboard/src/routes/api/events.ts` and `apps/worker/src/index.ts`

3. **Review Database Schema**
   - Run `pnpm db:studio` to visualize the schema
   - Understand tenant → event → rollup relationship

4. **Explore the Dashboard**
   - Navigate to `http://localhost:3000` and view live metrics
   - Check Grafana at `http://localhost:3001` for system metrics

5. **Run Load Tests**
   - Execute load tests to understand performance characteristics
   - Review latency and throughput metrics

6. **Read Key Files**
   - `README.md` - Project overview
   - `apps/dashboard/package.json` - Frontend dependencies
   - `apps/worker/package.json` - Worker dependencies
   - `packages/db/schema.ts` - Database structure

---

**Document Version**: 1.0  
**Last Updated**: November 26, 2025  
**Status**: Active Development
