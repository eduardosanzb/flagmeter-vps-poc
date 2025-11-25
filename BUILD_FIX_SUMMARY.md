# Monorepo Build Fix - Complete

**Commit**: `549641c`  
**Date**: 2025-11-25 23:34 CET  
**Status**: ✅ All builds passing locally

## The Problem

You correctly identified that the workspace packages weren't being built properly:

### Dashboard Error
```
ERR_PNPM_NO_SCRIPT_OR_SERVER  Missing script start or file server.js
```

### Worker Error
```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" 
for /app/packages/db/src/index.ts
```

## Root Cause

The monorepo was using TypeScript files directly in development (via `tsx`), but in production:
1. Workspace packages (`@flagmeter/db`, `@flagmeter/types`) exported `.ts` files
2. Node.js in production can't execute `.ts` files without a runtime transpiler
3. Dashboard was missing a `start` script to run the built output

## The Fix

### 1. Workspace Package Build Configuration

**packages/db/package.json**:
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc"
  }
}
```

**packages/db/tsconfig.json**:
```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
    // removed "noEmit": true
  }
}
```

Same changes applied to `@flagmeter/types`.

### 2. Dashboard Package

**apps/dashboard/package.json**:
```json
{
  "scripts": {
    "start": "node .output/server/index.mjs"
  }
}
```

### 3. Dockerfile Updates

Both `Dockerfile.dashboard` and `Dockerfile.worker`:

**Build stage**:
```dockerfile
# Build workspace packages first
RUN pnpm --filter "@flagmeter/types" build
RUN pnpm --filter "@flagmeter/db" build

# Then build the app
RUN pnpm build
```

**Production stage**:
```dockerfile
# Copy built workspace packages
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist
```

### 4. Environment Variables

**coolify.yaml** now has default values:
```yaml
environment:
  DATABASE_URL: ${DATABASE_URL:-postgresql://flagmeter:flagmeter123@postgres:5432/flagmeter}
  VALKEY_URL: ${VALKEY_URL:-redis://valkey:6379}
  POSTGRES_USER: ${POSTGRES_USER:-flagmeter}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-flagmeter123}
  POSTGRES_DB: ${POSTGRES_DB:-flagmeter}
```

## Build Verification ✅

Both services build successfully:

```bash
docker build -f infra/docker/Dockerfile.dashboard -t flagmeter-dashboard:test .
# ✅ Success - 593MB

docker build -f infra/docker/Dockerfile.worker -t flagmeter-worker:test .
# ✅ Success - 249MB
```

## What Coolify Will Do Now

1. ✅ Pull commit `549641c`
2. ✅ Parse `coolify.yaml` (syntax fixed)
3. ✅ Build workspace packages (`@flagmeter/types`, `@flagmeter/db`)
4. ✅ Build dashboard (TanStack Start → `.output/`)
5. ✅ Build worker (TypeScript → `dist/`)
6. ✅ Copy built JS files to production images
7. ✅ Start services with compiled JavaScript

## Environment Variables for Coolify

You can override defaults by setting these in Coolify:

**Postgres:**
```env
POSTGRES_USER=flagmeter
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=flagmeter
```

**Dashboard & Worker:**
```env
DATABASE_URL=postgresql://flagmeter:your-secure-password@postgres:5432/flagmeter
VALKEY_URL=redis://valkey:6379
```

Or use the defaults (fine for POC):
- User: `flagmeter`
- Password: `flagmeter123`
- Database: `flagmeter`

## Post-Deployment Checklist

Once Coolify completes deployment:

### 1. Verify Services Started
Check Coolify dashboard - all 4 services should be "Running":
- ✅ dashboard
- ✅ worker
- ✅ postgres
- ✅ valkey

### 2. Run Database Migrations

Option A - Via Coolify UI:
```bash
# Exec into dashboard container
cd /app
./migrate.sh
```

Option B - From your local machine (if Coolify exposes shell):
```bash
coolify exec dashboard -- ./migrate.sh
```

### 3. Test Endpoints

```bash
# Health check
curl http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io/api/health

# Ingest event
curl -X POST http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "tenant-1",
    "featureFlag": "new-ui",
    "userId": "user-123",
    "enabled": true
  }'

# Check usage
curl http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io/api/usage/tenant-1
```

### 4. Monitor Logs

Check for:
- ✅ Dashboard: "Server started on port 3000"
- ✅ Worker: "Worker started, processing events from queue"
- ✅ Postgres: "database system is ready to accept connections"
- ✅ No import errors or module resolution errors

## Previous Issues Resolved

1. ✅ **TanStack Start demo files** - Removed (commit `e8ccb4c`)
2. ✅ **coolify.yaml environment syntax** - Fixed (commit `74a991d`)
3. ✅ **Observability volume mounts** - Disabled (commit `699f207`)
4. ✅ **Monorepo workspace builds** - Fixed (commit `549641c`)

## Files Changed in This Fix

- `.gitignore` - Ignore `packages/*/dist`
- `apps/dashboard/package.json` - Add `start` script
- `packages/db/package.json` - Add `build` script, update exports
- `packages/db/tsconfig.json` - Enable JS emission
- `packages/types/package.json` - Add `build` script, update exports
- `packages/types/tsconfig.json` - Enable JS emission
- `infra/docker/Dockerfile.dashboard` - Build packages, copy dist
- `infra/docker/Dockerfile.worker` - Build packages, copy dist
- `coolify.yaml` - Add default environment values

## Key Learnings

1. **Monorepos need explicit build order** - Workspace packages must be built before apps
2. **Production !== Development** - `tsx` works in dev, but Node.js needs compiled JS in prod
3. **Package exports matter** - Must point to `.js` files, not `.ts` files
4. **Docker multi-stage builds** - Copy both app AND workspace package outputs

## Next Steps

Monitor the Coolify deployment and verify all services start successfully. The POC should now be fully functional! 🎉
