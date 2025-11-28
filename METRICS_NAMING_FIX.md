# Metrics Naming Fix - Prometheus Compatibility

## Issue

The manual HTTP metrics were not appearing in the Prometheus metrics endpoint or Grafana dashboard, showing "No Data" in all panels.

## Root Cause

The metrics were using **dot-separated names and attributes**, which don't work correctly with the Prometheus exporter:

```typescript
// ❌ WRONG: Dots in metric names and attributes
meter.createCounter('http.server.requests', {...});
attributes = {
  'service.name': 'dashboard',
  'http.method': method,
  'http.route': route,
  'http.status_code': statusCode,
};
```

While OpenTelemetry uses dots as the standard convention, the Prometheus exporter expects:
- **Metric names**: underscores (`http_server_requests`)
- **Attribute names**: underscores (`http_method`)

## Solution Applied

Updated `apps/dashboard/src/lib/metrics.ts` to use **underscore-separated names**:

```typescript
// ✅ CORRECT: Underscores for Prometheus compatibility
const httpRequestCounter = meter.createCounter('http_server_requests', {
  description: 'Total number of HTTP requests',
  unit: '{request}',
});

const httpRequestDuration = meter.createHistogram('http_server_duration', {
  description: 'Duration of HTTP requests in milliseconds',
  unit: 'ms',
});

// Attributes also use underscores
const attributes = {
  service_name: 'dashboard',
  http_method: method,
  http_route: route,
  http_status_code: statusCode,
};
```

## Metrics Exported

After the fix, the following metrics will be exported:

### Counter Metric
```promql
# HELP http_server_requests_total Total number of HTTP requests
# TYPE http_server_requests_total counter
http_server_requests_total{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201"} 150
http_server_requests_total{service_name="dashboard",http_method="GET",http_route="/api/health",http_status_code="200"} 50
http_server_requests_total{service_name="dashboard",http_method="GET",http_route="/api/usage/:tenant",http_status_code="200"} 25
```

### Histogram Metric
```promql
# HELP http_server_duration_milliseconds Duration of HTTP requests in milliseconds
# TYPE http_server_duration_milliseconds histogram
http_server_duration_count{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201"} 150
http_server_duration_sum{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201"} 15234.5
http_server_duration_bucket{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201",le="10"} 50
http_server_duration_bucket{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201",le="50"} 120
http_server_duration_bucket{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201",le="100"} 145
http_server_duration_bucket{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201",le="250"} 150
http_server_duration_bucket{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201",le="+Inf"} 150
```

## Testing

### Option 1: Use the Test Script

```bash
# Start the dashboard first
cd apps/dashboard
pnpm dev

# In another terminal, run the test script
cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter
./test-metrics.sh
```

The script will:
1. Check if dashboard is running
2. Send 5 test requests
3. Verify metrics are exported
4. Show sample metrics output

### Option 2: Manual Testing

```bash
# 1. Start the dashboard
cd apps/dashboard
pnpm dev

# 2. Send test requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/events \
    -H "Content-Type: application/json" \
    -d '{"tenant":"test","feature":"gpt-4","tokens":100}'
done

# 3. Check metrics endpoint
curl http://localhost:9464/metrics | grep http_server

# 4. Expected output
http_server_requests_total{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201"} 10
http_server_duration_count{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201"} 10
http_server_duration_sum{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201"} 1234.5
...
```

### Option 3: Check Grafana Dashboard

1. Open Grafana: http://localhost:3001 (admin/admin)
2. Navigate to **Dashboards** → **FlagMeter - API, Database & Services Monitoring**
3. Wait 15-30 seconds for Prometheus to scrape metrics
4. All HTTP panels should now show data!

Expected panels to populate:
- ✅ HTTP - Request Rate (RPS)
- ✅ HTTP - Success Rate
- ✅ HTTP - P95 Latency
- ✅ HTTP - Requests by Status Code
- ✅ HTTP - Latency Percentiles
- ✅ HTTP - Average Latency by Route
- ✅ HTTP - Request Count by Endpoint

## Changes Made

| File | Change |
|------|--------|
| `apps/dashboard/src/lib/metrics.ts` | Changed metric names from `http.server.*` to `http_server_*` |
| `apps/dashboard/src/lib/metrics.ts` | Changed attribute names from `service.name` to `service_name`, etc. |
| `apps/dashboard/src/lib/metrics.ts` | Changed counter unit from `'1'` to `'{request}'` for clarity |
| `test-metrics.sh` | Created new test script to verify metrics |

## Why This Matters

### OpenTelemetry Convention vs. Prometheus Compatibility

**OpenTelemetry Standard**:
- Uses dots: `http.server.requests`
- Semantic conventions specify this format
- Language-agnostic

**Prometheus Format**:
- Uses underscores: `http_server_requests_total`
- Suffix `_total` added for counters
- Suffix `_count`, `_sum`, `_bucket` added for histograms

The Prometheus exporter **should** automatically convert dots to underscores, but there can be edge cases or version-specific bugs where this doesn't work correctly. By using underscores directly, we:
1. Ensure compatibility with the Prometheus exporter
2. Match the format shown in Prometheus/Grafana
3. Avoid any conversion issues
4. Make queries more predictable

## Grafana Dashboard Queries

The dashboard queries should now work correctly:

```promql
# Request rate
sum(rate(http_server_requests_total{service_name="dashboard"}[1m]))

# Success rate
100 * (
  sum(rate(http_server_requests_total{service_name="dashboard",http_status_code=~"2.."}[5m]))
  / sum(rate(http_server_requests_total{service_name="dashboard"}[5m]))
)

# P95 latency
histogram_quantile(0.95, 
  sum(rate(http_server_duration_bucket{service_name="dashboard"}[5m])) by (le)
)

# Average latency by route
rate(http_server_duration_sum{service_name="dashboard"}[5m])
  / rate(http_server_duration_count{service_name="dashboard"}[5m])
```

## Troubleshooting

### Still No Data in Grafana?

1. **Check metrics endpoint**:
   ```bash
   curl http://localhost:9464/metrics | grep http_server
   ```
   If empty, metrics aren't being recorded.

2. **Check dashboard logs** for errors:
   ```bash
   # Look for [Metrics] logs
   ```

3. **Verify Prometheus is scraping**:
   ```bash
   # Check Prometheus targets
   open http://localhost:9090/targets
   ```
   Should show `dashboard` target as `UP`

4. **Check Prometheus has data**:
   ```bash
   # Run query in Prometheus
   open http://localhost:9090/graph
   # Query: http_server_requests_total
   ```

5. **Restart services if needed**:
   ```bash
   # Restart dashboard
   cd apps/dashboard
   # Kill existing process
   pnpm dev

   # Restart Prometheus (if using Docker)
   docker compose restart prometheus
   ```

### Metrics Show Wrong Service Name?

The dashboard queries filter by `service_name="dashboard"`. If you changed the service name in metrics.ts, update the Grafana dashboard queries accordingly.

## References

- [OpenTelemetry Metrics API](https://opentelemetry.io/docs/specs/otel/metrics/api/)
- [Prometheus Naming Conventions](https://prometheus.io/docs/practices/naming/)
- [OpenTelemetry Prometheus Exporter](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/exporter-prometheus)
