# Prometheus Queries for FlagMeter Metrics

## HTTP Metrics (Manual Instrumentation)

### Request Rate (RPS)
```promql
# Total requests per second (all routes)
rate(http_server_requests_total[1m])

# RPS by route
rate(http_server_requests_total{http_route="/api/events"}[1m])

# RPS by status code
rate(http_server_requests_total{http_status_code="200"}[1m])

# Error rate (4xx + 5xx)
rate(http_server_requests_total{http_status_code=~"[45].."}[1m])
```

### Request Duration / Latency
```promql
# P50 (median) latency
histogram_quantile(0.50, rate(http_server_duration_bucket[5m]))

# P95 latency
histogram_quantile(0.95, rate(http_server_duration_bucket[5m]))

# P99 latency
histogram_quantile(0.99, rate(http_server_duration_bucket[5m]))

# Average latency by route
rate(http_server_duration_sum{http_route="/api/events"}[5m]) 
  / rate(http_server_duration_count{http_route="/api/events"}[5m])
```

### Request Counts
```promql
# Total requests by route
sum(http_server_requests_total) by (http_route)

# Total requests by method and status
sum(http_server_requests_total) by (http_method, http_status_code)

# Successful requests (2xx)
sum(http_server_requests_total{http_status_code=~"2.."})

# Failed requests (5xx)
sum(http_server_requests_total{http_status_code=~"5.."})
```

## Database Metrics (Auto-Instrumentation)

### PostgreSQL Query Performance
```promql
# Query rate
rate(db_client_operation_total[1m])

# Query latency P95
histogram_quantile(0.95, rate(db_client_operation_duration_seconds_bucket[5m]))

# Active connections
db_client_connections_usage
```

## Redis/Valkey Metrics (Auto-Instrumentation)

### Redis Operations
```promql
# Redis command rate
rate(redis_commands_total[1m])

# Redis command latency
histogram_quantile(0.95, rate(redis_command_duration_seconds_bucket[5m]))

# Active Redis connections
redis_connection_usage
```

## Node.js Runtime Metrics

### Memory
```promql
# Heap memory usage
nodejs_heap_size_used_bytes

# Heap memory usage percentage
(nodejs_heap_size_used_bytes / nodejs_heap_size_total_bytes) * 100
```

### CPU
```promql
# CPU usage (rate of CPU seconds)
rate(process_cpu_seconds_total[1m])
```

### Event Loop
```promql
# Event loop lag (in seconds)
nodejs_eventloop_lag_seconds

# Event loop lag in milliseconds
nodejs_eventloop_lag_seconds * 1000
```

## Example Grafana Dashboard Queries

### API Health Overview Panel
```promql
# Success rate (percentage of 2xx responses)
(
  sum(rate(http_server_requests_total{http_status_code=~"2.."}[5m]))
  /
  sum(rate(http_server_requests_total[5m]))
) * 100
```

### Top 5 Slowest Endpoints
```promql
topk(5, 
  rate(http_server_duration_sum[5m]) 
  / rate(http_server_duration_count[5m])
)
```

### Error Budget (SLO: 99.9% uptime)
```promql
# Calculate error rate
(
  sum(rate(http_server_requests_total{http_status_code=~"5.."}[30d]))
  /
  sum(rate(http_server_requests_total[30d]))
) * 100
```

## Alerts

### High Error Rate
```promql
# Alert if more than 5% of requests fail
(
  sum(rate(http_server_requests_total{http_status_code=~"5.."}[5m]))
  /
  sum(rate(http_server_requests_total[5m]))
) > 0.05
```

### High Latency
```promql
# Alert if P95 latency exceeds 500ms
histogram_quantile(0.95, rate(http_server_duration_bucket[5m])) > 500
```

### Database Connection Issues
```promql
# Alert if no active DB connections
db_client_connections_usage < 1
```

## Usage Examples

### See metrics for a specific tenant (custom implementation)
You can extend the `recordHttpMetrics()` function to include tenant information:

```typescript
// In your route handler
recordHttpMetrics('POST', '/api/events', 201, duration, {
  tenant: tenantName,
  feature: feature,
});
```

Then query:
```promql
rate(http_server_requests_total{tenant="acme-corp"}[5m])
```
