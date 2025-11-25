# Grafana Dashboards

## Access

After running `pnpm dev` or `docker compose up`, Grafana will be available at:

- **URL**: http://localhost:3001
- **Username**: admin
- **Password**: admin (change on first login)

## Provisioned Dashboards

The FlagMeter dashboard includes:

1. **HTTP Request Latency** - p50/p95/p99 percentiles for API response times
2. **Queue Depth** - Current length of the Valkey event queue
3. **PostgreSQL Connections** - Active database connections
4. **Worker Concurrency** - Number of jobs being processed simultaneously
5. **Memory Usage** - RAM consumption for API and Worker services
6. **CPU Usage** - CPU utilization for API and Worker services
7. **API Request Rate** - Requests per second by endpoint
8. **Worker Job Processing Rate** - Jobs processed per second

## Adding Metrics

To expose metrics from your services:

### API (apps/api)

Add a `/metrics` endpoint that exposes Prometheus metrics.

### Worker (apps/worker)

Use `prom-client` or similar to expose worker metrics on port 9091.

## Custom Dashboards

Place additional dashboard JSON files in `infra/grafana/provisioning/dashboards/` and they will be automatically loaded.
