# Known Issues

## 1. TanStack Start Dev Environment Error (ACTIVE)

**Status**: 🔴 Blocking local development  
**Priority**: HIGH  
**Affects**: `pnpm dev` command

### Symptoms

When running `pnpm dev`, the API container fails to start with the following error:

```
SyntaxError: The requested module '@tanstack/router-generator' does not provide an export named 'CONSTANTS'
```

### Root Cause

Version mismatch or module export incompatibility between:
- `@tanstack/start-config@1.120.20`
- `@tanstack/router-generator@1.120.20`

### Attempted Solutions

1. ✅ Updated all TanStack packages to v1.120.20
2. ✅ Added `@tanstack/router-generator` as explicit dependency
3. ✅ Clean reinstall of node_modules
4. ❌ Issue persists

### Workaround

Use production Dockerfiles for testing:

```bash
docker compose up --build
```

This bypasses the dev environment and runs the built application.

### Next Steps to Resolve

1. **Option A**: Downgrade to earlier TanStack Start version
   ```bash
   # Try v1.91.11 which was in original implementation
   cd apps/api
   pnpm add @tanstack/react-router@1.91.11 @tanstack/start@1.91.11
   pnpm remove @tanstack/router-generator
   ```

2. **Option B**: Use latest stable TanStack Start
   ```bash
   # Check latest version at https://tanstack.com/start
   pnpm add @tanstack/react-router@latest @tanstack/start@latest
   ```

3. **Option C**: Switch to alternative framework
   - Consider Next.js App Router
   - Consider Remix
   - Consider Hono + React

### Related Files

- `apps/api/package.json` - Dependency versions
- `apps/api/app.config.ts` - TanStack Start configuration
- `infra/docker/Dockerfile.api.dev` - Dev container setup

---

## 2. Hot Module Reload (HMR) Configuration

**Status**: 🟡 Needs Testing  
**Priority**: MEDIUM  
**Affects**: Developer experience

### Current Setup

The dev environment is configured to:
1. Mount entire workspace as volume (`.:/app`)
2. Exclude `node_modules` directories
3. Run `pnpm install` on container startup
4. Start dev server with watch mode

### Testing Needed

Once TanStack Start error is resolved, verify:

- ✅ File changes in `apps/api/app/routes` trigger reload
- ✅ File changes in `apps/worker/src` trigger reload
- ✅ File changes in `packages/db` trigger reload
- ✅ File changes in `packages/types` trigger reload
- ✅ No full reinstall on every change
- ✅ Fast (<2s) reload time

### Volume Mount Strategy

```yaml
volumes:
  - .:/app                          # Mount entire workspace
  - /app/node_modules               # Exclude root node_modules
  - /app/apps/api/node_modules      # Exclude API node_modules
  - /app/apps/worker/node_modules   # Exclude worker node_modules
  - /app/packages/db/node_modules   # Exclude DB node_modules
  - /app/packages/types/node_modules # Exclude types node_modules
```

This ensures:
- Source files are editable from host
- Dependencies stay in container (faster, no permission issues)
- pnpm workspaces function correctly

---

## 3. PostgreSQL Version Warning

**Status**: 🟢 Informational  
**Priority**: LOW

### Issue

Docker Compose shows warning:
```
the attribute `version` is obsolete, it will be ignored
```

### Resolution

Remove `version: '3.9'` from `compose.dev.yml` and `docker-compose.yml` as it's no longer needed in modern Docker Compose.

---

## 4. pnpm Version Mismatch

**Status**: 🟢 Informational  
**Priority**: LOW

### Issue

Container shows:
```
Update available! 9.15.0 → 10.23.0
```

### Resolution

Update `infra/docker/Dockerfile.*.dev` to use pnpm@10.23.0:

```dockerfile
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate
```

---

## Workarounds Summary

### For Local Development (until TanStack issue fixed):

1. **Use production build**:
   ```bash
   docker compose up --build
   ```

2. **Test API endpoints directly**:
   ```bash
   # Once containers are running
   curl -X POST http://localhost:3000/api/events \
     -H "Content-Type: application/json" \
     -d '{"tenant":"acme-corp","feature":"gpt-4","tokens":1500}'
   ```

3. **Run worker in isolation**:
   ```bash
   cd apps/worker
   pnpm dev  # This should work as worker doesn't use TanStack
   ```

### For Production Deployment:

✅ **No issues** - Production Dockerfiles work correctly. Deploy to Coolify as documented in DEPLOYMENT.md.

---

## Contributing

If you resolve any of these issues, please:

1. Update this document
2. Document the solution
3. Create a pull request
4. Update HANDOVER.md if architecture changes

---

**Last Updated**: 2025-11-25  
**Tracking**: https://github.com/eduardosanzb/flagmeter-vps-poc/issues
