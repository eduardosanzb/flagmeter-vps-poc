# Final Metrics Fix - OpenTelemetry API Import

## Issue Found

When load testing the service, the metrics module was logging:
```
[Metrics] OpenTelemetry API not available yet
```

This happened because the metrics module was trying to access `globalThis.opentelemetry.metrics` which doesn't exist in the Node.js OpenTelemetry setup.

## Root Cause

The original implementation attempted to access OpenTelemetry API from a global variable:
```typescript
// ❌ WRONG: Trying to access global API
const metrics = (globalThis as any).opentelemetry?.metrics;
```

This doesn't work because:
1. OpenTelemetry API is not exposed globally in Node.js
2. The API must be imported from the `@opentelemetry/api` package
3. The telemetry initialization happens in a separate module

## Solution Applied

### 1. Fixed Metrics Module

**File**: `apps/dashboard/src/lib/metrics.ts`

Changed to properly import the OpenTelemetry API:

```typescript
// ✅ CORRECT: Import from @opentelemetry/api package
import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('flagmeter-dashboard', '1.0.0');

export const httpRequestCounter = meter.createCounter('http.server.requests', {
  description: 'Total number of HTTP requests',
  unit: '1',
});

export const httpRequestDuration = meter.createHistogram('http.server.duration', {
  description: 'Duration of HTTP requests in milliseconds',
  unit: 'ms',
});
```

### 2. Added Dependency

**File**: `apps/dashboard/package.json`

Added `@opentelemetry/api` as a direct dependency:

```json
{
  "dependencies": {
    "@opentelemetry/api": "^1.9.0",
    // ... other deps
  }
}
```

### 3. Cleared Build Cache

Removed stale build artifacts:
```bash
rm -rf apps/dashboard/node_modules/.vite
rm -rf apps/dashboard/.output
rm -rf apps/dashboard/.nitro
```

## How It Works Now

1. **Initialization Order**:
   ```
   telemetry.mjs (via --import)
   ↓
   @flagmeter/telemetry initializes OpenTelemetry SDK
   ↓
   MeterProvider is registered globally
   ↓
   metrics.ts imports @opentelemetry/api
   ↓
   metrics.getMeter() retrieves the initialized MeterProvider
   ↓
   Metrics are created and work correctly
   ```

2. **API Access**:
   - The `@opentelemetry/api` package provides a stable API interface
   - The actual implementation is provided by `@opentelemetry/sdk-node` (initialized in telemetry.mjs)
   - The API automatically finds the registered MeterProvider

3. **No Global Access Needed**:
   - We don't need `globalThis` or lazy initialization
   - The API package handles the connection to the SDK
   - Metrics are available immediately when routes are loaded

## Testing

To verify the fix works:

```bash
# 1. Start the dashboard
cd apps/dashboard
pnpm dev

# 2. Send load test requests
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/events \
    -H "Content-Type: application/json" \
    -d '{"tenant":"test","feature":"gpt-4","tokens":100}' &
done
wait

# 3. Check metrics endpoint
curl http://localhost:9464/metrics | grep http_server
```

**Expected Output** (no more warnings):
```
# HELP http_server_requests_total Total number of HTTP requests
# TYPE http_server_requests_total counter
http_server_requests_total{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201"} 100

# HELP http_server_duration_milliseconds Duration of HTTP requests in milliseconds
# TYPE http_server_duration_milliseconds histogram
http_server_duration_bucket{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201",le="10"} 50
http_server_duration_bucket{service_name="dashboard",http_method="POST",http_route="/api/events",http_status_code="201",le="50"} 95
...
```

## Files Changed

1. ✅ `apps/dashboard/src/lib/metrics.ts` - Rewritten to import API properly
2. ✅ `apps/dashboard/package.json` - Added @opentelemetry/api dependency
3. ✅ Build cache cleared

## Benefits

1. **Proper Module Loading**: Uses standard ES module imports
2. **Type Safety**: Full TypeScript support from @opentelemetry/api
3. **No Race Conditions**: API is available when modules load
4. **Standards Compliant**: Follows OpenTelemetry best practices
5. **No Console Warnings**: Clean logs during operation

## Previous Attempts

### Attempt 1: Global API Access ❌
```typescript
const metrics = (globalThis as any).opentelemetry?.metrics;
```
**Failed**: OpenTelemetry doesn't expose global API in Node.js

### Attempt 2: Lazy Initialization ❌
```typescript
function initMetrics() {
  if (!httpRequestCounter) {
    const metrics = (globalThis as any).opentelemetry?.metrics;
    // ...
  }
}
```
**Failed**: Still trying to access non-existent global

### Attempt 3: Direct Import ✅
```typescript
import { metrics } from '@opentelemetry/api';
```
**Success**: Proper module import, works immediately

## Why This Approach Works

The OpenTelemetry architecture separates **API** from **SDK**:

- **API** (`@opentelemetry/api`): Stable interface for creating metrics/traces
- **SDK** (`@opentelemetry/sdk-node`): Implementation that powers the API

When you initialize the SDK (in `telemetry.mjs`), it registers itself as the global provider. When you import the API (in `metrics.ts`), it automatically connects to the registered SDK.

This is the official OpenTelemetry pattern and ensures:
- API stability across versions
- SDK can be swapped without code changes
- Multiple packages can use the same telemetry backend
- Zero-dependency API package (small bundle size)

## References

- [OpenTelemetry JS API Documentation](https://opentelemetry.io/docs/languages/js/instrumentation/)
- [Manual Instrumentation Guide](https://opentelemetry.io/docs/languages/js/instrumentation/#creating-metrics)
- [Metrics API Reference](https://open-telemetry.github.io/opentelemetry-js/modules/_opentelemetry_api.metrics.html)
