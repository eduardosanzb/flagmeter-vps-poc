# Running Database Migrations in Production (Coolify)

## Quick Start

Once your services are deployed in Coolify, you need to run the initial database migration to create the schema.

## Option 1: Via Coolify UI (Recommended)

### Step 1: Access Container Shell

1. Go to **Coolify Dashboard**: `https://cool.eduardosanzb.dev/`
2. Navigate to your **FlagMeter project**
3. Click on the **dashboard** service
4. Find the "Execute Command" or "Shell" section
5. Click "Open Shell" or "Terminal"

### Step 2: Run Migration

In the container shell, run:

```bash
./migrate-prod.sh
```

**Output should look like:**
```
🗄️  Running FlagMeter database migrations...
📍 Database: postgresql://flagmeter:***@postgres:5432/flagmeter
🔄 Creating database schema...
   (using npx to run drizzle-kit)
[npx will download drizzle-kit temporarily - takes ~30 seconds first time]
✅ Migrations completed successfully!
```

**Note**: The script uses `npx drizzle-kit` which downloads drizzle-kit on-the-fly without needing it as a dependency. This keeps the production image lean.

### Step 3: Verify

Test that tables were created:
```bash
curl http://localhost:3000/api/health
```

## Option 2: Via Coolify CLI (if available)

If Coolify provides a CLI:

```bash
coolify exec dashboard -- /bin/sh -c "./migrate-prod.sh"
```

## Option 3: Manual SQL (Alternative)

If the script doesn't work, you can manually create tables:

### 3.1: Connect to Postgres Container

```bash
# In Coolify UI, open shell for postgres service
psql -U flagmeter -d flagmeter
```

### 3.2: Run Schema SQL

```sql
-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create feature_flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, name)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  feature_flag TEXT NOT NULL,
  user_id TEXT NOT NULL,
  enabled BOOLEAN NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_tenant_id ON events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_tenant_flag ON events(tenant_id, feature_flag);
```

## Option 4: Add to Dockerfile (Future Enhancement)

For automatic migrations on deployment, we could add to the Dockerfile:

```dockerfile
# Add migration as entrypoint
COPY migrate-prod.sh /app/
RUN chmod +x /app/migrate-prod.sh

# Run migration on container start
CMD ["sh", "-c", "./migrate-prod.sh && pnpm start"]
```

**⚠️ Note**: This would run migrations on every container restart, which might not be ideal.

## Option 5: Using Drizzle Kit Directly

If you have `drizzle-kit` available in the container:

```bash
# In dashboard container shell
cd /app/packages/db
pnpm drizzle-kit push
```

## Troubleshooting

### "DATABASE_URL not set"

Check that environment variables are configured in Coolify:
- Go to dashboard service settings
- Verify `DATABASE_URL` is set
- Should be: `postgresql://flagmeter:password@postgres:5432/flagmeter`

### "Connection refused"

- Verify postgres service is running
- Check that services are on the same Docker network
- Confirm postgres is healthy: `docker logs <postgres-container>`

### "Permission denied"

The script might not be executable. Run:
```bash
chmod +x /app/migrate-prod.sh
./migrate-prod.sh
```

### "pnpm: not found"

If pnpm isn't in PATH:
```bash
cd /app/packages/db
npx drizzle-kit push --force
```

### "Tables already exist"

Good! Your migrations have already run. Verify with:
```bash
curl http://localhost:3000/api/health
```

## Seed Test Data (Optional)

After migrations, you can optionally seed test data:

```bash
cd /app/packages/db
pnpm db:seed
```

This will create 3 test tenants with sample usage data.

## Verify Schema

Check that tables were created:

```bash
# Connect to postgres
psql -U flagmeter -d flagmeter

# List tables
\dt

# Should show:
# public | tenants        | table
# public | feature_flags  | table  
# public | events         | table
```

## Next Steps

After migrations complete:

1. ✅ Test health endpoint: `curl http://your-domain/api/health`
2. ✅ Test event ingestion: `POST /api/events`
3. ✅ Test usage query: `GET /api/usage/tenant-1`
4. ✅ Monitor logs for any errors

## Migration Files Location

All migration files are in:
```
packages/db/
├── src/
│   ├── schema.ts         # Database schema
│   └── client.ts         # Database connection
├── drizzle.config.ts     # Drizzle configuration
└── seed.ts               # Test data seeder
```

## Future: Automated Migrations

For production, consider:
- **Migration on deploy**: Run migrations automatically when deploying
- **Migration jobs**: Create a separate "migrate" service in docker-compose
- **Health checks**: Don't start app until migrations complete

Example future setup:
```yaml
services:
  migrate:
    image: flagmeter-dashboard
    command: ./migrate-prod.sh
    restart: "no"
  
  dashboard:
    depends_on:
      migrate:
        condition: service_completed_successfully
```
