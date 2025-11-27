# FlagMeter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-green.svg)](https://nodejs.org/)

> A single-VPS, AI-quota microservice that ingests events, rolls them up every minute, shows a live dashboard, and fires Slack webhooks at 80% quota threshold.

> [!IMPORTANT]
> "FlagMeter stayed stable at 300 req/s on a €3.75 ARM box—7 k active users, zero data loss, tail latency CPU-bound"
> You can read the details [here](https://notes.eduardosanzb.dev/s/aa17de1b-baac-4784-9142-dca089d298a5)


## Architecture

```mermaid
graph LR
    A[Client] -->|POST /events| B[API]
    B -->|LPUSH| C[Valkey Queue]
    C -->|BRPOP| D[Worker]
    D -->|Upsert Rollups| E[(PostgreSQL 18)]
    E -->|Query Usage| B
    B -->|Serve Dashboard| F[Browser]
    D -->|>80% Quota| G[Slack Webhook]
    H[Prometheus] -->|Scrape| B
    H -->|Scrape| D
    I[Grafana] -->|Query| H
    J[Loki] -->|Collect Logs| B
    J -->|Collect Logs| D
```

## Stack

- **Runtime**: Node LTS (TypeScript)
- **Database**: PostgreSQL 18 Alpine
- **Cache/Queue**: Valkey (Redis clone)
- **ORM**: Drizzle ORM (schema management) + raw SQL (hot paths)
- **API Framework**: TanStack Start
- **UI**: shadcn/ui
- **Observability**: Prometheus + Grafana + Loki
- **Deployment**: Coolify (zero-downtime, auto-HTTPS)
- **Cost**: ≤ €45/month

## Monorepo Structure

```
flagmeter/
├── apps/
│   ├── api/          # TanStack Start API + Dashboard
│   └── worker/       # Queue consumer & aggregator
├── packages/
│   ├── db/           # Drizzle schema & migrations
│   └── types/        # Shared TypeScript types
├── infra/
│   ├── docker/       # Dockerfiles & init scripts
│   ├── load-test/    # k6 performance tests
│   └── grafana/      # Dashboard definitions
├── compose.dev.yml   # Development environment
└── docker-compose.yml # Production stack
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- pnpm (only for scripts, not for runtime)

### Development

```bash
# Clone the repository
git clone https://github.com/eduardosanzb/flagmeter.git
cd flagmeter

# Start dev environment (builds all containers)
pnpm dev

# Access services:
# - Dashboard: http://localhost:3000
# - Grafana: http://localhost:3001 (admin/admin)
# - Prometheus: http://localhost:9090
```

**Note**: `pnpm dev` only runs Docker Compose. Your host machine does NOT need Node.js or PostgreSQL installed.

## API Endpoints

### POST /events
Ingest token usage event:
```json
{
  "tenant": "acme-corp",
  "feature": "gpt-4-turbo",
  "tokens": 1500
}
```

### GET /usage/:tenant
Retrieve current month usage:
```json
{
  "tenant": "acme-corp",
  "minute": "2025-11-25T14:32:00Z",
  "totalTokens": 820000,
  "quotaPercent": 82
}
```

## Database Schema

- **tenants**: `id, name, monthly_quota, billing_day`
- **events**: `id, tenant, feature, tokens, created_at`
- **rollups**: `tenant, feature, minute, total_tokens, updated_at`
- **slack_webhooks**: `tenant, url, enabled`

## Performance Targets

- **Throughput**: 1,000 requests/sec
- **Latency**: P99 ≤ 200ms
- **Memory**: ≤ 2GB total
- **Storage**: PostgreSQL external volume

## Deployment

Deploy to Coolify instance at `https://cool.eduardosanzb.dev/`:

1. Connect this repo in Coolify UI
2. Select `docker-compose.yml` as deployment method
3. Set environment variables (DATABASE_URL, VALKEY_URL)
4. Push to `main` branch for production deploy
5. Branch previews auto-deploy to `pr-{n}.meter.yourdomain.com`

## Load Testing

```bash
docker build -t flagmeter-load infra/load-test
docker run --rm --network=host flagmeter-load
```

Expected output: P99 ≤ 200ms at 1,000 rps.

## Observability

Grafana dashboards include:
- HTTP latency (p50/p95/p99)
- Queue depth
- PostgreSQL connections
- Worker concurrency
- Memory & CPU usage

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

This is a proof-of-concept project. For production use, consider:
- Adding authentication/authorization
- Implementing rate limiting
- Adding webhook signature verification
- Expanding observability metrics
- Setting up automated backups

---

**Note**: Branch protection and GitHub repo creation require manual GitHub UI/API configuration.
