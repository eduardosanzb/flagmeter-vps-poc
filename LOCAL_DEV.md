# Local Development Guide

## Quick Start

### 1. Setup Environment
```bash
# Copy environment template (only needed once)
cp .env.example .env
```

### 2. Start Infrastructure
```bash
./dev.sh
```

This starts:
- PostgreSQL (port 5432)
- Valkey/Redis (port 6379)
- Prometheus (port 9090)
- Grafana (port 3001)
- Loki (port 3100)

### 3. Start Applications

**Terminal 1 - Dashboard:**
```bash
cd apps/dashboard
pnpm dev
```
Access at: http://localhost:3000

**Terminal 2 - Worker:**
```bash
cd apps/worker
pnpm dev
```

## Environment Variables

Environment variables are loaded from the **root `.env` file**:

- **Dashboard**: TanStack Start automatically loads `.env` from root (configured via `envDir: '../../'`)
- **Worker**: tsx loads `.env` via `--env-file=../../.env` flag

### Required Variables
```bash
DATABASE_URL=postgresql://flagmeter:flagmeter@localhost:5432/flagmeter
VALKEY_URL=redis://localhost:6379
QUEUE_NAME=events
NODE_ENV=development
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/events` - Create event
- `GET /api/usage/:tenant` - Get tenant usage

## Database Management

### Run migrations:
```bash
# Check and apply migrations (safe, skips if already applied)
./migrate.sh

# If you get errors about existing constraints:
echo "yes" | ./reset-db.sh   # Drops and recreates all tables
```

**Note**: `./migrate.sh` will skip if tables already exist. Use `./reset-db.sh` for a fresh start.

### Seed test data:
```bash
cd packages/db
pnpm install  # First time only
pnpm db:seed
```

This creates:
- 3 test tenants (acme-corp, techstart-io, enterprise-llc)
- Random usage data (30-90% of quota)
- Aggregated rollups

### Open Drizzle Studio:
```bash
cd packages/db
pnpm db:studio
```

### Open TablePlus:
```bash
open "tableplus://?url=postgresql://flagmeter:flagmeter@localhost:5432/flagmeter"
```

## Monitoring

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Loki**: http://localhost:3100

## Stopping Services

```bash
docker compose -f compose.dev.yml down
```

## Troubleshooting

### Port conflicts
If ports are in use, stop existing services:
```bash
docker compose -f compose.dev.yml down
lsof -ti:3000 | xargs kill -9  # Kill dashboard
lsof -ti:6379 | xargs kill -9  # Kill Valkey if running locally
```

### Module not found errors
Reinstall dependencies:
```bash
pnpm install
```

### Database connection errors
Ensure Docker services are running:
```bash
docker compose -f compose.dev.yml ps
```
