# Deployment Guide

## Coolify Deployment

### Prerequisites

- Coolify instance running at `https://cool.eduardosanzb.dev/`
- GitHub repository connected to Coolify
- Domain configured (e.g., `meter.yourdomain.com`)

### Steps

1. **Connect Repository in Coolify UI**
   - Navigate to your Coolify instance
   - Add a new project
   - Connect this GitHub repository
   - Coolify will auto-detect `coolify.yaml`

2. **Configure Environment Variables**

   Set these in Coolify's environment configuration:

   ```bash
   # Database
   POSTGRES_USER=flagmeter
   POSTGRES_PASSWORD=<generate-strong-password>
   POSTGRES_DB=flagmeter
   DATABASE_URL=postgresql://flagmeter:<password>@postgres:5432/flagmeter
   
   # Redis/Valkey
   VALKEY_URL=redis://valkey:6379
   
   # Application
   NODE_ENV=production
   QUEUE_NAME=events
   LOG_LEVEL=info
   
   # Grafana
   GF_SECURITY_ADMIN_USER=admin
   GF_SECURITY_ADMIN_PASSWORD=<generate-strong-password>
   GF_SERVER_ROOT_URL=https://grafana.meter.yourdomain.com
   
   # Worker
   WORKER_CONCURRENCY=4
   ```

3. **Configure Domain**
   - In Coolify, set your domain (e.g., `meter.yourdomain.com`)
   - Coolify automatically handles Let's Encrypt SSL certificates
   - No need to configure Caddy or any reverse proxy

4. **Deploy**
   - Push to `main` branch
   - Coolify will automatically:
     - Build Docker images
     - Run database migrations
     - Deploy services with zero downtime
     - Configure HTTPS

5. **Access Services**
   - Dashboard: `https://meter.yourdomain.com` (main UI)
   - Health Check: `https://meter.yourdomain.com/api/health`
   - API Endpoints:
     - POST `/api/events` - Event ingestion
     - GET `/api/usage/:tenant` - Tenant usage
   - Grafana: Configure subdomain in Coolify (e.g., `grafana.meter.yourdomain.com`)

### Branch Previews

Pull request branches are automatically deployed to:
```
https://pr-{number}.meter.yourdomain.com
```

### Database Migrations

**First Deployment** - Run migrations manually:
```bash
# In Coolify terminal for the dashboard service
cd /app/packages/db
pnpm db:push:force
```

**Optional** - Seed test data:
```bash
# In Coolify terminal for the dashboard service  
cd /app/packages/db
pnpm db:seed
```

### Applying Schema Changes

When deploying schema updates (e.g., integer → bigint conversions), use the automated migration scripts:

#### Option 1: Automated Migration from Local Machine

**For Docker Compose deployments:**
```bash
./deploy-migrate.sh docker
```

**For Coolify deployments:**
```bash
export COOLIFY_SSH_HOST=user@your-server.com
./deploy-migrate.sh coolify
```

**For local development:**
```bash
./deploy-migrate.sh local
```

#### Option 2: Manual Migration in Container

**Docker Compose:**
```bash
# Apply migration
docker exec flagmeter-dashboard sh -c "cd /app/packages/db && npx drizzle-kit push --force"

# Restart worker
docker restart flagmeter-worker
```

**Coolify:**
```bash
# SSH into your server
ssh user@your-server.com

# Find dashboard container
docker ps | grep dashboard

# Apply migration (replace <container-id> with actual ID)
docker exec <container-id> sh -c "cd /app/packages/db && npx drizzle-kit push --force"

# Restart worker from Coolify UI or:
docker ps | grep worker
docker restart <worker-container-id>
```

#### Migration Safety Notes

- **Zero Data Loss**: PostgreSQL safely converts integer → bigint without data loss
- **Downtime**: ~5 seconds during column type change (connections remain open)
- **Automatic Reconnect**: Worker and dashboard automatically reconnect after schema changes
- **Rollback**: Not recommended - if needed, manually ALTER TABLE columns back to integer (only if values are within int32 range)

#### What Gets Updated

Recent migrations include:
- **BigInt Conversion** (fixes error `PostgresError 22003`):
  - `tenants.monthly_quota`: integer → bigint (supports quotas > 2.1B tokens)
  - `events.tokens`: integer → bigint (supports large token counts)
  - `rollups.total_tokens`: integer → bigint (prevents overflow during aggregation)

### Database Backups

Coolify handles daily PostgreSQL backups to S3-compatible storage. Configure this in Coolify's backup settings.

### Monitoring

After deployment:
- Prometheus: Monitor at `https://meter.yourdomain.com:9090`
- Grafana: Dashboard at `https://meter.yourdomain.com:3001`
- Logs: View in Coolify's log viewer or Loki

### Scaling

To scale worker instances, update `WORKER_CONCURRENCY` in environment variables or add more worker service replicas in Coolify.

### Troubleshooting

**Check service health:**
```bash
curl https://meter.yourdomain.com/api/health
```

**View logs in Coolify:**
- Navigate to your project
- Select service (api/worker)
- View real-time logs

**Database connection issues:**
- Verify `DATABASE_URL` is correctly set
- Ensure postgres service is running
- Check network connectivity between services

### Resource Allocation

Optimized for **Hetzner CAX11** (ARM64, 2 vCPU, 4GB RAM, €3.79/month):
- Dashboard: 768MB RAM, 0.75 CPU
- Worker: 512MB RAM, 0.5 CPU
- Postgres: 768MB RAM, 0.5 CPU
- Valkey: 256MB RAM, 0.25 CPU
- Prometheus: 384MB RAM, 0.25 CPU
- Grafana: 384MB RAM, 0.25 CPU
- Loki: 256MB RAM, 0.25 CPU
- **Total: ~3.3GB RAM, ~2.75 CPU shares**
- Leaves ~700MB for OS and buffers

**Current Setup**: Hetzner CAX11 - Perfect fit! 🎯
- All Docker images are ARM64 compatible
- Worker concurrency set to 2 (matches CPU count)
- Can handle ~100 req/s on dashboard
- Can process ~1000 events/minute

### Manual Deployment (Alternative to Coolify)

See [compose.prod.yml](compose.prod.yml) for standalone Docker Compose deployment.

1. Copy `.env.production.example` to `.env.production`
2. Fill in your production values
3. Run: `docker compose -f compose.prod.yml --env-file .env.production up -d`
4. Run migrations: `docker exec flagmeter-dashboard sh -c "cd /app/packages/db && pnpm db:push:force"`
