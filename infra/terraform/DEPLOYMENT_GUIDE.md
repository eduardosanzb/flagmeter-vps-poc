# FlagMeter Deployment Guide

## Why Not Use Coolify's Nixpacks?

**Problem:** Coolify uses Nixpacks by default, which doesn't understand:
- ❌ Monorepo structure (apps/dashboard, apps/worker)
- ❌ pnpm workspaces
- ❌ Custom Dockerfiles in `infra/docker/`
- ❌ Which app to build

**Solution:** Build images locally → Push to registry → Deploy to Swarm

## Complete Deployment Workflow

### Prerequisites

1. ✅ Terraform infrastructure deployed (`terraform apply`)
2. ✅ Swarm initialized (`./scripts/01-init-swarm.sh`)
3. ✅ Docker installed on your local machine
4. ✅ Registry credentials in `terraform.tfvars`

### One-Command Deployment

```bash
cd infra/terraform
./scripts/00-deploy-all.sh
```

This runs:
1. **02-build-and-push.sh** - Builds images locally, pushes to registry
2. **03-configure-registry.sh** - Configures registry login on Swarm nodes
3. **04-deploy-stacks.sh** - Deploys observability + app stacks

### Manual Step-by-Step

#### Step 1: Build Images Locally

```bash
cd infra/terraform
./scripts/02-build-and-push.sh
```

**What it does:**
- Builds dashboard, worker, prometheus, grafana images
- Tags with `registry.raus.cloud/flagmeter/*:latest`
- Pushes all images to registry
- Takes ~5-10 minutes depending on machine

#### Step 2: Configure Registry on Swarm

```bash
./scripts/03-configure-registry.sh
```

**What it does:**
- Logs manager node into registry.raus.cloud
- Logs worker node into registry.raus.cloud
- Verifies credentials are stored in `~/.docker/config.json`

#### Step 3: Deploy to Swarm

```bash
./scripts/04-deploy-stacks.sh
```

**What it does:**
- Copies stack YAMLs to manager
- Deploys observability stack (Prometheus, Grafana, Loki)
- Deploys app stack (Dashboard, Worker, PostgreSQL, Valkey)
- Shows service status

## Updated Stack Files

Your stack files now use registry images:

**coolify.observability.swarm.yaml:**
```yaml
services:
  prometheus:
    image: registry.raus.cloud/flagmeter/prometheus:latest
  grafana:
    image: registry.raus.cloud/flagmeter/grafana:latest
```

**coolify.app.swarm.yaml:**
```yaml
services:
  dashboard:
    image: registry.raus.cloud/flagmeter/dashboard:latest
  worker:
    image: registry.raus.cloud/flagmeter/worker:latest
```

## Image Build Details

### Dashboard Image
- **Dockerfile:** `infra/docker/Dockerfile.dashboard`
- **Context:** Project root
- **App:** `apps/dashboard`
- **Runtime:** Node.js with TanStack Start

### Worker Image
- **Dockerfile:** `infra/docker/Dockerfile.worker`
- **Context:** Project root
- **App:** `apps/worker`
- **Runtime:** Node.js worker process

### Prometheus Image
- **Dockerfile:** `infra/docker/Dockerfile.prometheus`
- **Includes:** Custom prometheus.yml config

### Grafana Image
- **Dockerfile:** `infra/docker/Dockerfile.grafana`
- **Includes:** Pre-configured dashboards

## CI/CD Integration (Future)

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Login to registry
        run: echo "${{ secrets.REGISTRY_PASSWORD }}" | docker login -u "${{ secrets.REGISTRY_USERNAME }}" --password-stdin registry.raus.cloud
      
      - name: Build and push images
        run: |
          docker build -f infra/docker/Dockerfile.dashboard -t registry.raus.cloud/flagmeter/dashboard:${{ github.sha }} .
          docker push registry.raus.cloud/flagmeter/dashboard:${{ github.sha }}
          
      - name: Deploy to Swarm
        run: |
          ssh root@${{ secrets.MANAGER_IP }} "docker service update --image registry.raus.cloud/flagmeter/dashboard:${{ github.sha }} app_dashboard"
```

## Troubleshooting

### Build Fails

```bash
# Check Docker is running
docker ps

# Check you're in project root
pwd  # Should end in /flagmeter

# Check Dockerfiles exist
ls infra/docker/
```

### Push Fails

```bash
# Test registry login
docker login registry.raus.cloud

# Check network connectivity
ping registry.raus.cloud

# Check credentials in terraform.tfvars
grep docker_registry infra/terraform/terraform.tfvars
```

### Deploy Fails

```bash
# Check registry login on manager
ssh root@$(terraform output -raw manager_public_ip) "docker login registry.raus.cloud"

# Test image pull manually
ssh root@$(terraform output -raw manager_public_ip) "docker pull registry.raus.cloud/flagmeter/dashboard:latest"

# Check network exists
ssh root@$(terraform output -raw manager_public_ip) "docker network ls | grep flagmeter"
```

### Services Won't Start

```bash
# Check service logs
ssh root@$(terraform output -raw manager_public_ip) "docker service logs app_dashboard"

# Check service status
ssh root@$(terraform output -raw manager_public_ip) "docker service ps app_dashboard"

# Check resources
ssh root@$(terraform output -raw manager_public_ip) "docker node ls"
ssh root@$(terraform output -raw manager_public_ip) "docker stats --no-stream"
```

## Updating Your Application

### Update Images and Redeploy

```bash
# Build new images
./scripts/02-build-and-push.sh

# Update running services (no downtime)
MANAGER_IP=$(terraform output -raw manager_public_ip)
ssh root@$MANAGER_IP "docker service update --image registry.raus.cloud/flagmeter/dashboard:latest app_dashboard"
ssh root@$MANAGER_IP "docker service update --image registry.raus.cloud/flagmeter/worker:latest app_worker"
```

### Rolling Updates

Swarm does rolling updates automatically:
- Stops old container
- Starts new container
- Verifies health
- Moves to next replica

## Cost Analysis

**Build locally vs. Coolify build:**

| Approach | Build Location | Build Time | Network Cost | Pros |
|----------|---------------|------------|--------------|------|
| **Local build** | Your machine | 5-10 min | Push to registry (~500MB) | Fast, familiar, works with monorepo |
| **Coolify/Nixpacks** | Swarm manager | 10-20 min | None | Automatic, but doesn't work with monorepo |

**Recommendation:** Build locally for monorepos, use Coolify/Nixpacks for simple single-app projects.

## Next Steps

1. **Test deployment:**
   ```bash
   curl http://$(terraform output -raw worker_public_ip):3000/api/health
   ```

2. **Run database migrations:**
   ```bash
   MANAGER_IP=$(terraform output -raw manager_public_ip)
   ssh root@$MANAGER_IP 'docker exec $(docker ps -qf name=app_dashboard) sh -c "cd /app/packages/db && pnpm db:push:force"'
   ```

3. **Add Traefik for SSL** (optional):
   - See `TRAEFIK_GUIDE.md`

4. **Setup monitoring:**
   - Access Grafana: `http://MANAGER_IP:3001`
   - Default: admin/admin

5. **Load test:**
   - See `infra/load-test/README.md`
