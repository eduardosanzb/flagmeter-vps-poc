# HTTP Metrics Fix: Manual Instrumentation

## Problem

The OpenTelemetry HTTP auto-instrumentation (`@opentelemetry/instrumentation-http`) was causing a conflict with TanStack Start/Nitro:

```
TypeError: Response body object should not be disturbed or locked
```

This error occurred because:
1. OpenTelemetry's HTTP instrumentation works at the low-level Node.js `http` module layer
2. TanStack Start/Nitro uses modern Fetch API / Web Standards on top of that
3. When OpenTelemetry intercepted requests at the HTTP layer, it could consume or lock the body stream
4. When your route handlers tried to read the body with `request.json()`, the stream was already consumed

## Solution

Instead of using automatic HTTP instrumentation, we implemented **manual HTTP metrics** that:
- ✅ Avoid all body reading conflicts
- ✅ Provide complete control over what metrics to collect
- ✅ Still track all important HTTP metrics (RPS, duration, status codes, etc.)
- ✅ Keep PostgreSQL and Redis auto-instrumentation working
- ✅ Allow for custom business metrics

## Changes Made

### 1. Disabled HTTP Auto-Instrumentation

**File**: `apps/dashboard/telemetry.mjs`

```diff
  initializeTelemetry({
    serviceName: process.env.SERVICE_NAME || 'flagmeter-dashboard',
    serviceVersion: '1.0.0',
    metricsPort: 9464,
-   enableHttpInstrumentation: true,
+   enableHttpInstrumentation: false, // Disabled to avoid body reading conflicts
    enablePgInstrumentation: true,
    enableIoredisInstrumentation: true,
  });
```

### 2. Created Manual Metrics Module

**File**: `apps/dashboard/src/lib/metrics.ts` (new file)

This module provides a `recordHttpMetrics()` function that:
- Tracks HTTP request count by route, method, and status code
- Records request duration as a histogram
- Initializes OpenTelemetry meters lazily to avoid timing issues

Key metrics:
- **Counter**: `http.server.requests` - Total HTTP requests
- **Histogram**: `http.server.duration` - Request latency distribution in milliseconds

### 3. Added Metrics to All API Routes

Updated three API route handlers to manually record metrics:

#### `/api/events` (POST)
**File**: `apps/dashboard/src/routes/api/events.ts`
- Tracks request start time
- Records metrics on success (201) and error (400, 500)

#### `/api/health` (GET)
**File**: `apps/dashboard/src/routes/api/health.ts`
- Records metrics on healthy (200) and unhealthy (503) responses

#### `/api/usage/:tenant` (GET)
**File**: `apps/dashboard/src/routes/api/usage.$tenant.ts`
- Records metrics on success (200), not found (404), and error (500)

### 4. Cleaned Up Telemetry Package

**File**: `packages/telemetry/src/otel.ts`

Removed failed attempt at configuring HTTP instrumentation hooks that were causing TypeScript errors.

## Metrics Available

After these changes, your Prometheus metrics endpoint (`http://localhost:9464/metrics`) will expose:

```promql
# Request rate (requests per second)
rate(http_server_requests_total[1m])

# Request count by route
http_server_requests_total{http_method="POST",http_route="/api/events"}

# Request duration percentiles
histogram_quantile(0.95, rate(http_server_duration_bucket[5m]))

# Average request duration by route
rate(http_server_duration_sum[5m]) / rate(http_server_duration_count[5m])
```

Plus all your existing metrics:
- PostgreSQL query metrics (from auto-instrumentation)
- Redis/Valkey operation metrics (from auto-instrumentation)
- Node.js runtime metrics (heap, CPU, event loop)

## Testing

To verify the fix works:

1. Start the dashboard:
   ```bash
   cd apps/dashboard
   pnpm dev
   ```

2. Send a request to any API endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/events \
     -H "Content-Type: application/json" \
     -d '{"tenant":"test","feature":"gpt-4-turbo","tokens":100}'
   ```

3. Check metrics endpoint:
   ```bash
   curl http://localhost:9464/metrics | grep http_server
   ```

You should see:
- No more "Response body disturbed" errors
- HTTP metrics being recorded
- Request counts and durations visible in Prometheus

## Benefits

1. **No Breaking Changes**: The app works exactly the same from a user perspective
2. **Better Control**: You decide exactly what to measure
3. **Extensibility**: Easy to add custom attributes (e.g., tenant name, feature flags)
4. **Performance**: Minimal overhead, no stream cloning/buffering
5. **Reliability**: No conflicts with framework internals

## Future Enhancements

You can easily extend the manual metrics:

```typescript
// Add custom business metrics
const tokensProcessed = meter.createCounter('app.tokens.processed');
tokensProcessed.add(tokens, { tenant: tenantName, feature });

// Add custom attributes to HTTP metrics
recordHttpMetrics('POST', '/api/events', 201, duration, {
  tenant: tenantName,
  feature: feature,
});
```

## Notes

- Pre-existing Drizzle ORM TypeScript errors in `apps/dashboard/src/routes/api/events.ts` are unrelated to this fix
- These errors come from version mismatches in Drizzle packages and don't affect runtime behavior
- Consider updating Drizzle to resolve those separately
