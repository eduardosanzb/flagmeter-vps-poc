# FlagMeter Migration Guide

## Overview

FlagMeter uses a separate Docker image for database migrations, isolated from the runtime dashboard/worker services. This provides explicit control over when migrations run and enables git-tagged versioning for rollbacks.

## Architecture

```
infra/docker/
  ├── Dockerfile.dashboard     # Production runtime (no devDependencies)
  ├── Dockerfile.migrations    # Migration runner (includes drizzle-kit)
  └── Dockerfile.worker        # Worker service

coolify.migrate.yaml           # Migration stack deployment config
```

## Local Development

### Quick Start
```bash
# Build migration image and run migrations
pnpm migrate

# Or run steps separately:
pnpm migrate:build
pnpm migrate:run
```

### Custom Configuration
```bash
# Use custom network
NETWORK_NAME=my_network pnpm migrate:run

# Use custom database URL
DATABASE_URL=postgresql://user:pass@host:5432/db pnpm migrate:run

# Both
NETWORK_NAME=my_network DATABASE_URL=postgresql://... pnpm migrate
```

## Production Deployment

### Docker Swarm (2-Server Setup)

**Prerequisites:**
- App stack deployed (`docker stack deploy -c coolify.app.yaml app`)
- Overlay network `obs_flagmeter-net` exists

**Steps:**

1. **Build migration image with git tag:**
   ```bash
   docker build -f infra/docker/Dockerfile.migrations -t flagmeter-migrations:v1.2.3 .
   ```

2. **Update coolify.migrate.yaml with git tag:**
   ```yaml
   services:
     migrate:
       image: flagmeter-migrations:v1.2.3  # Use specific version
   ```

3. **Deploy migration stack:**
   ```bash
   docker stack deploy -c coolify.migrate.yaml migrate
   ```

4. **Monitor migration:**
   ```bash
   docker service logs migrate_migrate -f
   ```

5. **Clean up after success:**
   ```bash
   docker stack rm migrate
   ```

### Rollback

If a migration fails or causes issues:

```bash
# Deploy previous migration version
docker build -f infra/docker/Dockerfile.migrations -t flagmeter-migrations:v1.2.2 .
# Update coolify.migrate.yaml to use v1.2.2
docker stack deploy -c coolify.migrate.yaml migrate
```

## CI/CD Integration (Future)

```yaml
# .github/workflows/deploy.yml
- name: Build migration image
  run: docker build -f infra/docker/Dockerfile.migrations -t ghcr.io/${{ github.repository }}/migrations:${{ github.sha }} .

- name: Push to registry
  run: docker push ghcr.io/${{ github.repository }}/migrations:${{ github.sha }}

- name: Run migrations
  run: |
    docker run --rm \
      --network=obs_flagmeter-net \
      -e DATABASE_URL=${{ secrets.DATABASE_URL }} \
      ghcr.io/${{ github.repository }}/migrations:${{ github.sha }}
```

## Troubleshooting

### Network not found
```bash
# Check available networks
docker network ls | grep flagmeter

# Update NETWORK_NAME environment variable
NETWORK_NAME=actual_network_name pnpm migrate:run
```

### Authentication failed
```bash
# Verify DATABASE_URL credentials
DATABASE_URL=postgresql://correct_user:correct_pass@host:5432/db pnpm migrate:run
```

### Schema conflicts
If drizzle-kit tries to drop constraints that are in use:
- This usually means schema is already up-to-date
- Verify by checking database directly
- If needed, manually adjust schema or use drizzle migrations instead of push

## Migration Image Details

**Includes:**
- Node 24 Alpine
- pnpm 9.15.0
- drizzle-orm + drizzle-kit (devDependencies)
- Database schema source files
- Drizzle config files

**Does NOT include:**
- Dashboard runtime code
- Worker runtime code
- Production dependencies

**Command:** `pnpm exec drizzle-kit push --config=drizzle.config.js --force`

## Best Practices

1. **Always use git tags in production** - Never use `:latest` tag for migrations
2. **Test migrations locally first** - Run `pnpm migrate` before deploying to production
3. **One-way migrations** - Design schema changes to be additive when possible
4. **Backup before major changes** - PostgreSQL snapshots before dropping tables/columns
5. **Monitor worker logs after migrations** - Ensure workers reconnect and process events correctly

## Default Configuration

- **Network:** `obs_flagmeter-net` (Swarm overlay network)
- **Database URL:** `postgresql://flagmeter:flagmeter123@postgres:5432/flagmeter`
- **Restart Policy:** `none` (run once, don't restart on exit)
- **Resources:** 256M memory, 0.2 CPU
