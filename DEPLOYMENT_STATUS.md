# FlagMeter POC - Deployment Status

**Last Updated**: 2025-11-25 23:16 CET  
**Status**: ✅ Ready for Coolify Deployment

## Recent Fixes Applied

### 1. Removed TanStack Start Demo Files ✅
- **Commit**: `e8ccb4c`
- **Issue**: Demo components referenced non-existent shadcn/ui components
- **Fix**: Deleted all 13 demo files (986 lines)
- **Result**: Docker builds succeed locally

### 2. Fixed coolify.yaml Environment Syntax ✅
- **Commit**: `74a991d`
- **Issue**: `non-string key in services.dashboard.environment: 0`
- **Fix**: Converted from array syntax to object syntax
  ```yaml
  # Before (broken)
  environment:
    - DATABASE_URL
    - NODE_ENV=production
  
  # After (fixed)
  environment:
    DATABASE_URL: ${DATABASE_URL}
    NODE_ENV: production
  ```
- **Result**: docker-compose config validation passes

### 3. Disabled Observability Services for POC ✅
- **Commit**: `699f207`
- **Issue**: Prometheus, Grafana, Loki tried to mount local config files that don't exist on Coolify server
- **Fix**: Commented out all observability services
- **Reason**: Not critical for MVP, can be re-enabled later
- **Result**: No volume mount errors

## Local Build Verification ✅

Both services build successfully:
```bash
docker compose -f coolify.yaml build dashboard worker
```

**Results**:
- ✅ `flagmeter-dashboard:latest` - 593MB (ARM64)
- ✅ `flagmeter-worker:latest` - 249MB (ARM64)

## Coolify Deployment Configuration

### Services Deployed
1. **Dashboard** (TanStack Start + API)
   - Port: 3000
   - Memory: 1024M
   - CPU: 0.75
   - Healthcheck: `/api/health`

2. **Worker** (BullMQ event processor)
   - Memory: 768M
   - CPU: 0.5

3. **Postgres** (18-alpine)
   - Memory: 1024M
   - CPU: 0.5
   - Volume: postgres_data

4. **Valkey** (Redis-compatible)
   - Memory: 384M
   - CPU: 0.25

### Total Resources
- **RAM**: ~3.2GB allocated (leaves ~800MB for OS)
- **CPU**: ~2.0 CPU shares
- **Server**: Hetzner CAX11 (ARM64, 2 vCPU, 4GB RAM)

### Environment Variables Required

Set these in Coolify dashboard:

```env
# Database
DATABASE_URL=postgresql://user:password@postgres:5432/flagmeter
POSTGRES_USER=flagmeter
POSTGRES_PASSWORD=<generate-secure-password>
POSTGRES_DB=flagmeter

# Redis/Valkey
VALKEY_URL=redis://valkey:6379

# Application
NODE_ENV=production
QUEUE_NAME=events
LOG_LEVEL=info
WORKER_CONCURRENCY=2
```

## Deployment URL
- **Coolify Dashboard**: https://cool.eduardosanzb.dev/
- **Service URL**: http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io

## Post-Deployment Steps

Once Coolify completes the build:

### 1. Run Database Migrations
```bash
# SSH into dashboard container or use Coolify exec
./migrate.sh
```

### 2. Seed Test Data (Optional)
```bash
pnpm db:seed
```

### 3. Test Endpoints

**Health Check**:
```bash
curl http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io/api/health
```

**Ingest Event**:
```bash
curl -X POST http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "tenant-1",
    "featureFlag": "new-ui",
    "userId": "user-123",
    "enabled": true
  }'
```

**Check Usage**:
```bash
curl http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io/api/usage/tenant-1
```

### 4. Monitor Resources
- Check RAM usage stays under 3.2GB
- Monitor CPU utilization
- Verify worker is processing events from queue

## Known Limitations (POC)

1. **No Observability Stack** - Prometheus, Grafana, Loki commented out
2. **No SSL/TLS** - Using sslip.io domain (HTTP only)
3. **Basic Health Check** - No advanced monitoring
4. **Single Instance** - No horizontal scaling
5. **In-memory Valkey** - No persistence enabled

## Re-enabling Observability (Future)

Uncomment services in `coolify.yaml`:
- Prometheus (metrics collection)
- Grafana (visualization)
- Loki (log aggregation)

Will need to:
1. Create config files for Prometheus
2. Configure Grafana datasources
3. Add Loki log driver to services

## Troubleshooting

### Build Fails with Cache Issues
Force rebuild without cache in Coolify UI or:
```bash
docker compose -f coolify.yaml build --no-cache
```

### Environment Variables Not Loading
Ensure variables are set in Coolify service configuration, not in project settings.

### Volume Mount Errors
Check that only named volumes are used, not local file mounts.

## Latest Commits
- `699f207` - Disable observability services for POC
- `74a991d` - Fix coolify.yaml environment syntax
- `86c6afc` - Add cache issue documentation
- `e8ccb4c` - Remove TanStack Start demo files

## Next Monitoring

Watch Coolify build logs for:
1. ✅ Git pull succeeds (commit `699f207`)
2. ✅ coolify.yaml parses successfully
3. ✅ Docker build completes (both services)
4. ✅ Containers start and pass health checks
5. ✅ Services are accessible via URL
