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

   ```
   # Database
   POSTGRES_USER=flagmeter
   POSTGRES_PASSWORD=<secure-password>
   POSTGRES_DB=flagmeter
   DATABASE_URL=postgresql://flagmeter:<password>@postgres:5432/flagmeter
   
   # Valkey
   VALKEY_URL=redis://valkey:6379
   
   # Grafana
   GF_SECURITY_ADMIN_USER=admin
   GF_SECURITY_ADMIN_PASSWORD=<secure-password>
   
   # Worker
   WORKER_CONCURRENCY=4
   QUEUE_NAME=events
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
   - Dashboard: `https://meter.yourdomain.com`
   - API: `https://meter.yourdomain.com/api/events`
   - Grafana: `https://meter.yourdomain.com:3001` (configure subdomain in Coolify)

### Branch Previews

Pull request branches are automatically deployed to:
```
https://pr-{number}.meter.yourdomain.com
```

### Database Migrations

Migrations run automatically on container start via the init script.

To manually run migrations:
```bash
# In Coolify terminal for the api service
pnpm db:push
```

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

### Cost Optimization

Current resource allocation targets ≤€45/month:
- API: 512MB RAM, 0.5 CPU
- Worker: 512MB RAM, 0.5 CPU
- Observability: ~768MB RAM total
- Total: ~2GB RAM on single VPS

Recommended VPS: Hetzner CPX21 (2 vCPU, 4GB RAM) ~€7/month
