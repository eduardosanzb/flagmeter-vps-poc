# Issue: No Manual HTTP Metrics in Prometheus

## Current Status

Manual HTTP metrics ARE being recorded but are NOT appearing in the Prometheus `/metrics` endpoint.

### Evidence

From debug logs:
```
[Metrics] HTTP metrics instruments created
[Metrics] Counter: CounterInstrument
[Metrics] Histogram: HistogramInstrument
[Metrics] Recording: POST /api/events 201 11ms
[Metrics] Recorded successfully
```

But `/metrics` endpoint only shows:
- `target_info`
- `http_client_request_duration` (auto-instrumentation)

Missing:
- `http_server_requests_total`
- `http_server_duration_*`

## Root Cause

**The NodeSDK creates separate metric pipelines for auto-instrumentation and manual metrics.**

When you use `NodeSDK` with a `PrometheusExporter`:
1. NodeSDK creates an internal MeterProvider for auto-instrumentation
2. This MeterProvider connects to the PrometheusExporter  
3. Manual metrics use the global `metrics` API which gets a DIFFERENT MeterProvider
4. These two MeterProviders are NOT connected to the same exporter

Result: Auto-instrumented metrics show up, manual metrics don't.

## Attempted Solutions

### ❌ Attempt 1: Using dots in metric names
Changed `http.server.requests` → `http_server_requests`
**Result**: Didn't help, issue persists

### ❌ Attempt 2: Lazy initialization
Added lazy init to ensure SDK is ready before creating metrics
**Result**: Metrics ARE created correctly, but still not exported

### ❌ Attempt 3: Creating separate MeterProvider
Tried creating a new MeterProvider with PrometheusExporter for manual metrics
**Result**: Type error - `PrometheusExporter` is not a `MetricReader`

## The Real Problem

The OpenTelemetry Node SDK architecture has a known limitation:
- `NodeSDK` is designed primarily for **auto-instrumentation**
- Manual metrics via the global API require explicit MeterProvider registration
- The `PrometheusExporter` in v0.54.0 has compatibility issues

## Solutions

### Option 1: Disable Manual Metrics (Quick Fix)
Remove manual HTTP metrics and rely only on auto-instrumentation.

**Pros**:
- No code changes needed
- Works immediately

**Cons**:
- ❌ Lose fine-grained HTTP metrics
- ❌ Can't track custom business metrics
- ❌ No service labels

### Option 2: Use Different Exporter (Recommended)
Use `PeriodicExportingMetricReader` with a different exporter instead of PrometheusExporter.

**Implementation**:
```typescript
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { metrics } from '@opentelemetry/api';

// Create OTLP exporter (sends to Prometheus via OpenTelemetry Collector)
const exporter = new OTLPMetricExporter({
  url: 'http://localhost:4318/v1/metrics', // OTLP endpoint
});

const meterProvider = new MeterProvider({
  resource,
  readers: [
    new PeriodicExportingMetricReader({
      exporter,
      exportIntervalMillis: 60000, // Export every 60s
    }),
  ],
});

metrics.setGlobalMeterProvider(meterProvider);
```

**Pros**:
- ✅ Manual metrics will work
- ✅ Standard OpenTelemetry pattern
- ✅ Better for production

**Cons**:
- Requires OpenTelemetry Collector
- More complex setup

### Option 3: Upgrade OpenTelemetry Packages (Recommended)
Upgrade from v0.54.0 to latest v0.208.0 which has better compatibility.

**Implementation**:
```bash
cd packages/telemetry
# Update package.json
pnpm add @opentelemetry/sdk-node@^0.208.0 \
  @opentelemetry/auto-instrumentations-node@^0.50.0 \
  @opentelemetry/exporter-prometheus@^0.208.0
  
pnpm install
```

**Pros**:
- ✅ May fix the issue automatically
- ✅ Bug fixes and improvements
- ✅ Better Prometheus integration

**Cons**:
- Risk of breaking changes
- Need to test thoroughly

### Option 4: Create Custom Prometheus Endpoint (Workaround)
Manually create metrics endpoint that reads from global MeterProvider.

**Implementation**: Create custom `/metrics` route that collects and formats metrics.

**Pros**:
- ✅ Full control over export
- ✅ Can combine auto + manual metrics

**Cons**:
- Complex to implement
- Maintenance burden

### Option 5: Use Prom-Client Directly (Alternative)
Use `prom-client` library instead of OpenTelemetry for manual metrics.

**Implementation**:
```typescript
import promClient from 'prom-client';

const httpRequestsTotal = new promClient.Counter({
  name: 'http_server_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Record metrics
httpRequestsTotal.inc({ method: 'POST', route: '/api/events', status_code: 201 });

// Serve at /metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

**Pros**:
- ✅ Proven solution
- ✅ Works immediately
- ✅ Simple API

**Cons**:
- Not using OpenTelemetry standard
- Need to maintain two metric systems

## Recommendation

**Short term**: Option 5 (Use `prom-client` directly)
- Fastest to implement
- Proven to work
- Can migrate to OpenTelemetry later

**Long term**: Option 3 (Upgrade OpenTelemetry packages)
- Stay with OpenTelemetry standard
- Better ecosystem support
- Future-proof

## Implementation Plan

### Phase 1: Quick Fix with prom-client
1. Install `prom-client`: `pnpm add prom-client`
2. Replace `apps/dashboard/src/lib/metrics.ts` with prom-client implementation
3. Update route handlers to use new metrics
4. Test and verify metrics appear

### Phase 2: Migrate to Latest OpenTelemetry
1. Upgrade OpenTelemetry packages to v0.208.0
2. Test auto-instrumentation still works
3. Re-implement manual metrics with upgraded SDK
4. Verify both auto and manual metrics export correctly

## Files to Change

For prom-client approach:
- `apps/dashboard/package.json` - Add `prom-client`
- `apps/dashboard/src/lib/metrics.ts` - Rewrite using prom-client
- `apps/dashboard/src/routes/api/*.ts` - No changes needed (same API)

## Testing

```bash
# 1. Start dashboard
cd apps/dashboard
pnpm dev

# 2. Send requests
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"tenant":"test","feature":"gpt-4","tokens":100}'

# 3. Check metrics
curl http://localhost:9464/metrics | grep http_server

# Expected output:
# http_server_requests_total{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201"} 1
```

## References

- [OpenTelemetry Manual Instrumentation](https://opentelemetry.io/docs/languages/js/instrumentation/#creating-metrics)
- [Prometheus Client for Node.js](https://github.com/simmonds/prom-client)
- [OpenTelemetry NodeSDK Issues](https://github.com/open-telemetry/opentelemetry-js/issues)
- [Nitro/TanStack Start Instrumentation Challenges](https://github.com/getsentry/sentry-javascript/issues/13670)
