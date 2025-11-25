# FlagMeter Deployment Checklist

Use this checklist when deploying to production.

## Pre-Deployment

- [ ] All tests passing locally
- [ ] Database schema finalized
- [ ] Environment variables documented
- [ ] Docker images build successfully
  ```bash
  docker compose -f compose.prod.yml build
  ```
- [ ] .gitignore includes sensitive files (.env, .env.production)

## Coolify Setup

- [ ] Coolify instance accessible
- [ ] GitHub repository connected
- [ ] Project created in Coolify
- [ ] Domain name configured (e.g., meter.yourdomain.com)

## Environment Variables

Configure in Coolify dashboard:

### Required
- [ ] `POSTGRES_USER=flagmeter`
- [ ] `POSTGRES_PASSWORD=<strong-password>`
- [ ] `POSTGRES_DB=flagmeter`
- [ ] `DATABASE_URL=postgresql://flagmeter:<password>@postgres:5432/flagmeter`
- [ ] `VALKEY_URL=redis://valkey:6379`
- [ ] `NODE_ENV=production`
- [ ] `QUEUE_NAME=events`

### Optional
- [ ] `LOG_LEVEL=info` (or warn, error)
- [ ] `WORKER_CONCURRENCY=4`
- [ ] `GF_SECURITY_ADMIN_USER=admin`
- [ ] `GF_SECURITY_ADMIN_PASSWORD=<strong-password>`
- [ ] `GF_SERVER_ROOT_URL=https://grafana.meter.yourdomain.com`

## Deployment

- [ ] Push to main branch
  ```bash
  git push origin main
  ```
- [ ] Coolify detects and starts build
- [ ] Build completes successfully
- [ ] All services start (dashboard, worker, postgres, valkey)
- [ ] Health checks pass

## Post-Deployment

### Database Setup
- [ ] Run migrations
  ```bash
  # In Coolify terminal for dashboard service
  cd /app/packages/db && pnpm db:push:force
  ```
- [ ] (Optional) Seed test data
  ```bash
  cd /app/packages/db && pnpm db:seed
  ```

### Verification
- [ ] Dashboard loads: `https://meter.yourdomain.com`
- [ ] Health check returns 200: `https://meter.yourdomain.com/api/health`
- [ ] Can view tenant usage in dashboard
- [ ] Test event ingestion:
  ```bash
  curl -X POST https://meter.yourdomain.com/api/events \
    -H "Content-Type: application/json" \
    -d '{
      "tenant": "test-tenant",
      "feature": "gpt-4",
      "tokens": 1000
    }'
  ```
- [ ] Worker processing events (check logs)

### Monitoring
- [ ] Grafana accessible (if configured)
- [ ] Prometheus metrics available
- [ ] Logs visible in Coolify
- [ ] Alerts configured (optional)

## Security

- [ ] Strong passwords generated (min 32 characters)
- [ ] SSL/TLS configured (Coolify does this automatically)
- [ ] Firewall rules configured (if applicable)
- [ ] Database not publicly accessible
- [ ] Sensitive endpoints protected (if needed)

## Backup Strategy

- [ ] Database backup schedule configured
- [ ] Backup restoration tested
- [ ] Backup retention policy set (e.g., 7 days)

## Documentation

- [ ] Team notified of deployment
- [ ] API documentation updated (if changed)
- [ ] Credentials stored securely (password manager)
- [ ] Runbook created for common operations

## Rollback Plan

- [ ] Previous version tagged in git
- [ ] Rollback procedure documented
- [ ] Database migration rollback tested

## Performance

- [ ] Resource limits appropriate
- [ ] Response times acceptable (<500ms for dashboard)
- [ ] Worker processing queue efficiently
- [ ] Database queries optimized

## Post-Launch Monitoring

### First Hour
- [ ] Check error logs every 15 minutes
- [ ] Monitor resource usage (CPU, RAM)
- [ ] Verify event processing
- [ ] Check health endpoint

### First Day
- [ ] Review logs for errors
- [ ] Check database growth rate
- [ ] Verify backup completed
- [ ] Monitor queue length

### First Week
- [ ] Review performance metrics
- [ ] Adjust resource limits if needed
- [ ] Check for any warnings in logs
- [ ] Verify monitoring and alerts working

## Notes

- Deployment date: _______________
- Deployed by: _______________
- Version/Commit: _______________
- Domain: _______________
- Issues encountered: _______________
