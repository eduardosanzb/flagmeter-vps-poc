# Grafana Dashboard Update - Service Labels

## Summary

The Grafana dashboard has been updated to include comprehensive HTTP metrics with service labels, allowing you to monitor each microservice independently.

## Changes Made

### 1. Added Service Label to Metrics

**File**: `apps/dashboard/src/lib/metrics.ts`

All HTTP metrics now include a `service.name` label to identify which service generated the metric:

```typescript
const attributes = {
  'service.name': 'dashboard',  // ← NEW: Service identifier
  'http.method': method,
  'http.route': route,
  'http.status_code': statusCode,
};
```

This allows you to:
- Filter metrics by service in Grafana
- Monitor multiple services on the same dashboard
- Differentiate between dashboard and future API services

### 2. Updated Grafana Dashboard

**File**: `infra/grafana/provisioning/dashboards/flagmeter.json`

#### Title Updated
- **Old**: "FlagMeter - Database & Services Monitoring"
- **New**: "FlagMeter - API, Database & Services Monitoring"

#### Added 7 New HTTP Metrics Panels

All panels are positioned at the top of the dashboard for easy visibility:

| Panel ID | Panel Name | Type | Position | Description |
|----------|-----------|------|----------|-------------|
| 100 | HTTP - Request Rate (RPS) | Time Series | Row 1, Left | Total and per-route requests per second |
| 101 | HTTP - Success Rate | Gauge | Row 1, Center | Percentage of 2xx responses |
| 102 | HTTP - P95 Latency | Gauge | Row 1, Right | 95th percentile latency |
| 103 | HTTP - Requests by Status Code | Time Series | Row 2, Left | Request rate by status (200, 201, 400, 404, 500, 503) |
| 104 | HTTP - Latency Percentiles | Time Series | Row 2, Right | P50, P90, P95, P99 latency over time |
| 105 | HTTP - Average Latency by Route | Time Series | Row 3, Left | Mean latency per endpoint |
| 106 | HTTP - Request Count by Endpoint | Stat | Row 3, Right | Total requests by route/method |

#### Query Filtering

All HTTP metric queries now filter by `service_name="dashboard"`:

```promql
# Before (no service filter)
sum(rate(http_server_requests_total[1m]))

# After (with service filter)
sum(rate(http_server_requests_total{service_name="dashboard"}[1m]))
```

This ensures:
- Only dashboard metrics are shown in HTTP panels
- Future services can be added without conflicts
- You can create service-specific views easily

### 3. Existing Panels Shifted Down

All database and service monitoring panels (PostgreSQL, Valkey, Services) were shifted down by 24 units (3 rows) to make room for HTTP metrics at the top.

## Metric Labels Reference

### HTTP Metrics

All manual HTTP metrics include these labels:

| Label | Description | Example Values |
|-------|-------------|----------------|
| `service.name` | Service identifier | `dashboard` |
| `http.method` | HTTP method | `GET`, `POST` |
| `http.route` | Route pattern | `/api/events`, `/api/health`, `/api/usage/:tenant` |
| `http.status_code` | HTTP status code | `200`, `201`, `400`, `404`, `500`, `503` |

### Available Metrics

| Metric Name | Type | Description |
|------------|------|-------------|
| `http_server_requests_total` | Counter | Total HTTP requests |
| `http_server_duration_sum` | Histogram Sum | Sum of request durations (ms) |
| `http_server_duration_count` | Histogram Count | Number of request duration observations |
| `http_server_duration_bucket` | Histogram Bucket | Request duration distribution buckets |

## Example Queries with Service Filter

### Request Rate for Dashboard Only
```promql
sum(rate(http_server_requests_total{service_name="dashboard"}[1m]))
```

### Success Rate by Service
```promql
100 * (
  sum(rate(http_server_requests_total{service_name="dashboard",http_status_code=~"2.."}[5m]))
  / sum(rate(http_server_requests_total{service_name="dashboard"}[5m]))
)
```

### P95 Latency for Dashboard
```promql
histogram_quantile(0.95, 
  sum(rate(http_server_duration_bucket{service_name="dashboard"}[5m])) by (le)
)
```

### Average Latency by Route (Dashboard Only)
```promql
rate(http_server_duration_sum{service_name="dashboard"}[5m]) 
  / rate(http_server_duration_count{service_name="dashboard"}[5m])
```

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Row 1: HTTP - Key Metrics (Dashboard Service)                  │
├──────────────────┬──────────────────┬──────────────────┬────────┤
│ Request Rate     │ Success Rate     │ P95 Latency      │        │
│ (RPS)            │ (%)              │ (ms)             │        │
└──────────────────┴──────────────────┴──────────────────┴────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Row 2: HTTP - Request Details                                   │
├──────────────────────────────────┬──────────────────────────────┤
│ Requests by Status Code          │ Latency Percentiles          │
└──────────────────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Row 3: HTTP - Endpoint Analysis                                 │
├──────────────────────────────────┬──────────────────────────────┤
│ Average Latency by Route         │ Request Count by Endpoint    │
└──────────────────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PostgreSQL Metrics (starts at row 4)                            │
│ ...                                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Valkey Metrics                                                   │
│ ...                                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Service Status                                                   │
│ ...                                                              │
└─────────────────────────────────────────────────────────────────┘
```

## Benefits of Service Labels

### 1. Multi-Service Monitoring
If you add more services in the future (e.g., `api-gateway`, `auth-service`), you can:
- Monitor all services on the same dashboard
- Create variables to switch between services
- Compare metrics across services

### 2. Service-Specific Dashboards
Create focused dashboards:
```json
{
  "templating": {
    "list": [{
      "name": "service",
      "type": "query",
      "query": "label_values(http_server_requests_total, service_name)"
    }]
  }
}
```

### 3. Aggregated Views
Compare all services at once:
```promql
sum(rate(http_server_requests_total[1m])) by (service_name)
```

### 4. Alert Routing
Create service-specific alerts:
```yaml
alert: DashboardHighErrorRate
expr: |
  100 * (
    sum(rate(http_server_requests_total{service_name="dashboard",http_status_code=~"5.."}[5m]))
    / sum(rate(http_server_requests_total{service_name="dashboard"}[5m]))
  ) > 5
labels:
  service: dashboard
  severity: critical
```

## Testing the Dashboard

### 1. Start the Stack
```bash
# Start all services
docker compose up -d

# Or just dashboard
cd apps/dashboard
pnpm dev
```

### 2. Generate Metrics
```bash
# Create some events
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"tenant":"test","feature":"gpt-4","tokens":100}'

# Check health
curl http://localhost:3000/api/health

# Get usage
curl http://localhost:3000/api/usage/test
```

### 3. View Dashboard
1. Open Grafana: http://localhost:3001 (admin/admin)
2. Go to **Dashboards** → **FlagMeter - API, Database & Services Monitoring**
3. Wait 15-30 seconds for Prometheus to scrape metrics
4. You should see data in all HTTP panels!

### 4. Verify Service Label
Check Prometheus directly:
```bash
# View metrics with service label
curl -s http://localhost:9090/api/v1/query?query=http_server_requests_total | jq

# Should show something like:
# {
#   "metric": {
#     "service_name": "dashboard",
#     "http_method": "POST",
#     "http_route": "/api/events",
#     "http_status_code": "201"
#   },
#   "value": [1234567890, "5"]
# }
```

## Future Enhancements

### Add More Services
When you add new HTTP services:

1. Create similar metrics in the new service:
```typescript
// apps/new-service/src/lib/metrics.ts
const attributes = {
  'service.name': 'new-service',  // ← Change service name
  'http.method': method,
  'http.route': route,
  'http.status_code': statusCode,
};
```

2. Metrics will automatically appear in Prometheus with the new service label

3. Update Grafana queries to include the new service or create a new dashboard

### Service Selector Variable
Add a variable to switch between services:

```json
{
  "templating": {
    "list": [{
      "name": "service",
      "label": "Service",
      "type": "query",
      "query": "label_values(http_server_requests_total, service_name)",
      "current": {
        "value": "dashboard",
        "text": "dashboard"
      }
    }]
  }
}
```

Then use `$service` in queries:
```promql
sum(rate(http_server_requests_total{service_name="$service"}[1m]))
```

## Troubleshooting

### Panels Show "No Data"
- Ensure dashboard is running
- Send test requests to generate metrics
- Wait 15-30 seconds for Prometheus scrape
- Check metrics endpoint: `curl http://localhost:9464/metrics | grep http_server`

### Service Label Not Showing
- Verify metrics code includes `'service.name': 'dashboard'`
- Restart dashboard service to pick up changes
- Check Prometheus targets are healthy: http://localhost:9090/targets

### Wrong Service Metrics
- Double-check dashboard queries include `{service_name="dashboard"}`
- Verify service.name matches between code and queries (case-sensitive)

## Files Changed

- `apps/dashboard/src/lib/metrics.ts` - Added service.name label
- `infra/grafana/provisioning/dashboards/flagmeter.json` - Added HTTP panels with service filters

## Rollback

If you need to rollback:
```bash
cd infra/grafana/provisioning/dashboards
cp flagmeter.json.backup flagmeter.json
docker compose restart grafana
```
