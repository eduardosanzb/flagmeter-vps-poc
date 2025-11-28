# HTTP Metrics Dashboard - FlagMeter

The Grafana dashboard has been updated to include comprehensive HTTP API metrics from our manual instrumentation.

## New Dashboard Panels

### Row 1: Key HTTP Metrics

#### 1. HTTP - Request Rate (RPS)
**Type**: Time Series  
**Position**: Top-left

Shows requests per second (RPS) over time:
- **Total RPS**: Aggregated rate across all endpoints
- **Per-route RPS**: Individual lines for each API route (`/api/events`, `/api/health`, `/api/usage/:tenant`)

**Query**:
```promql
sum(rate(http_server_requests_total[1m]))  # Total
sum(rate(http_server_requests_total[1m])) by (http_route)  # By route
```

#### 2. HTTP - Success Rate
**Type**: Gauge  
**Position**: Top-center

Percentage of successful requests (2xx status codes):
- **Green**: ≥99% success rate
- **Yellow**: 95-99% success rate
- **Red**: <95% success rate

**Query**:
```promql
100 * (sum(rate(http_server_requests_total{http_status_code=~"2.."}[5m])) 
       / sum(rate(http_server_requests_total[5m])))
```

#### 3. HTTP - P95 Latency
**Type**: Gauge  
**Position**: Top-right

95th percentile latency in milliseconds:
- **Green**: <200ms
- **Yellow**: 200-500ms
- **Red**: >500ms

**Query**:
```promql
histogram_quantile(0.95, sum(rate(http_server_duration_bucket[5m])) by (le))
```

### Row 2: Request Details

#### 4. HTTP - Requests by Status Code
**Type**: Time Series  
**Position**: Middle-left

Request rate broken down by HTTP status code:
- **200 OK**: Successful GET requests
- **201 Created**: Successful POST requests
- **400 Bad Request**: Invalid input
- **404 Not Found**: Tenant not found
- **500 Internal Error**: Server errors
- **503 Service Unavailable**: Health check failures

**Queries**: Individual rate queries for each status code

#### 5. HTTP - Latency Percentiles
**Type**: Time Series  
**Position**: Middle-right

Multiple latency percentiles over time:
- **P50 (median)**: Half of requests faster than this
- **P90**: 90% of requests faster than this
- **P95**: 95% of requests faster than this
- **P99**: 99% of requests faster than this

Helps identify latency distribution and outliers.

### Row 3: Endpoint Analysis

#### 6. HTTP - Average Latency by Route
**Type**: Time Series with Table Legend  
**Position**: Bottom-left

Average response time for each API endpoint:
- Shows mean latency and last value in legend
- Useful for identifying slow endpoints
- Grouped by route and HTTP method

#### 7. HTTP - Request Count by Endpoint
**Type**: Stat Panel  
**Position**: Bottom-right

Total number of requests received by each endpoint since startup:
- Color-coded by volume
- Horizontal orientation for easy reading
- Shows both method and route

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Row 1: Key Metrics                                              │
├──────────────────┬──────────────────┬──────────────────┬────────┤
│ Request Rate     │ Success Rate     │ P95 Latency      │        │
│ (RPS)            │ (%)              │ (ms)             │        │
└──────────────────┴──────────────────┴──────────────────┴────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Row 2: Request Details                                          │
├──────────────────────────────────┬──────────────────────────────┤
│ Requests by Status Code          │ Latency Percentiles          │
│                                   │ (P50, P90, P95, P99)         │
└──────────────────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Row 3: Endpoint Analysis                                        │
├──────────────────────────────────┬──────────────────────────────┤
│ Average Latency by Route         │ Request Count by Endpoint    │
│                                   │                              │
└──────────────────────────────────┴──────────────────────────────┘

... (Database and Services panels follow below)
```

## Using the Dashboard

### Monitoring API Health

1. **Check Success Rate gauge**: Should be green (>99%)
2. **Monitor RPS**: Understand traffic patterns
3. **Watch P95 Latency**: Should stay below 200ms for good UX

### Debugging Issues

#### High Error Rate
1. Look at "Requests by Status Code" panel
2. Identify which status codes are spiking (400, 500, 503)
3. Check corresponding service health panels below

#### Slow Responses
1. Check "Latency Percentiles" panel
2. If P99 >> P95, you have outliers
3. Look at "Average Latency by Route" to identify slow endpoints
4. Correlate with database query metrics below

#### Traffic Spikes
1. "Request Rate" shows sudden increases
2. Cross-reference with "Request Count by Endpoint"
3. Check if specific routes are getting hammered

### Setting Up Alerts

You can create Grafana alerts based on these panels:

#### Alert: High Error Rate
```yaml
Condition: HTTP Success Rate < 95%
For: 5 minutes
Severity: Critical
```

#### Alert: High Latency
```yaml
Condition: HTTP P95 Latency > 500ms
For: 3 minutes
Severity: Warning
```

#### Alert: Service Down
```yaml
Condition: HTTP RPS = 0
For: 2 minutes
Severity: Critical
```

## Data Source

All HTTP metrics come from:
- **Metric Source**: Manual OpenTelemetry instrumentation
- **Location**: `apps/dashboard/src/lib/metrics.ts`
- **Exported By**: Dashboard service on port 9464
- **Scraped By**: Prometheus every 15 seconds

## Metrics Reference

| Metric Name | Type | Labels | Description |
|------------|------|--------|-------------|
| `http_server_requests_total` | Counter | `http_method`, `http_route`, `http_status_code` | Total number of HTTP requests |
| `http_server_duration_sum` | Histogram Sum | `http_method`, `http_route`, `http_status_code` | Sum of request durations |
| `http_server_duration_count` | Histogram Count | `http_method`, `http_route`, `http_status_code` | Number of request duration observations |
| `http_server_duration_bucket` | Histogram Bucket | `http_method`, `http_route`, `http_status_code`, `le` | Request duration distribution buckets |

## Accessing the Dashboard

1. Open Grafana: `http://localhost:3001` (default credentials: `admin/admin`)
2. Navigate to **Dashboards**
3. Open **"FlagMeter - API, Database & Services Monitoring"**

The dashboard refreshes every 10 seconds automatically.

## Troubleshooting

### Panels Show "No Data"

**Cause**: HTTP metrics not being exported yet

**Solution**: 
1. Ensure dashboard is running: `cd apps/dashboard && pnpm dev`
2. Send test requests to generate metrics:
   ```bash
   curl -X POST http://localhost:3000/api/events \
     -H "Content-Type: application/json" \
     -d '{"tenant":"test","feature":"gpt-4","tokens":100}'
   ```
3. Wait 15-30 seconds for Prometheus to scrape metrics
4. Refresh Grafana dashboard

### Metrics Incorrect After Restart

**Cause**: Counter metrics reset on service restart

**Solution**: Use `rate()` or `increase()` functions in queries, which handle resets automatically (already configured in dashboard).

### High Cardinality Warning

**Cause**: Too many unique label combinations

**Solution**: Current implementation uses only 3 labels (`http_method`, `http_route`, `http_status_code`) which is safe. Avoid adding high-cardinality labels like tenant IDs or user IDs directly to HTTP metrics.

## Next Steps

Consider adding:
1. **Alerts** based on these metrics (see "Setting Up Alerts" section)
2. **Custom business metrics** (e.g., tokens processed per tenant)
3. **Correlation panels** linking HTTP errors to database/Redis issues
4. **SLO tracking** (e.g., 99.9% uptime, P95 < 200ms)
