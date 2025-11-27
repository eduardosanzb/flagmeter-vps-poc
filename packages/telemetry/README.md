# @flagmeter/telemetry

OpenTelemetry-based observability package for FlagMeter with automatic instrumentation.

## Features

- ✅ **Auto-instrumentation** for HTTP, PostgreSQL, and IORedis
- ✅ **Prometheus metrics** export
- ✅ **Zero code changes** required in your application code
- ✅ **100% Open Source** - no SaaS dependencies

## What Gets Instrumented

### HTTP Requests (Dashboard)
- `http_server_request_duration_seconds` - Request latency histogram
- `http_server_requests_total` - Total requests counter
- `http_server_active_requests` - Active requests gauge

### PostgreSQL Queries
- `db_client_operation_duration_seconds` - Query latency
- `db_client_operation_total` - Query count
- `db_client_connections_usage` - Active connections

### Redis/Valkey Operations
- `redis_command_duration_seconds` - Command latency
- `redis_commands_total` - Command count
- `redis_connection_usage` - Active connections

### Node.js Runtime
- `nodejs_heap_size_used_bytes` - Heap memory usage
- `nodejs_eventloop_lag_seconds` - Event loop lag
- `process_cpu_seconds_total` - CPU usage

## Usage

### Dashboard
The telemetry is automatically loaded via `telemetry.mjs`:

```bash
# Development
pnpm dev

# Production
pnpm start
```

Metrics available at: `http://localhost:9464/metrics`

### Worker
Similarly, telemetry is preloaded:

```bash
# Development
cd apps/worker && pnpm dev

# Production
cd apps/worker && pnpm start
```

Metrics available at: `http://localhost:9465/metrics`

## Configuration

Each app has a `telemetry.mjs` file that can be configured:

```javascript
import { initializeTelemetry } from '@flagmeter/telemetry';

initializeTelemetry({
  serviceName: 'my-service',        // Service name in metrics
  serviceVersion: '1.0.0',          // Service version
  metricsPort: 9464,                // Prometheus metrics port
  enableHttpInstrumentation: true,   // Enable HTTP tracing
  enablePgInstrumentation: true,     // Enable PostgreSQL tracing
  enableIoredisInstrumentation: true,// Enable Redis tracing
});
```

## Viewing Metrics

### Prometheus
1. Open http://localhost:9090
2. Query examples:
   ```promql
   # HTTP request rate
   rate(http_server_requests_total[1m])
   
   # P95 latency
   histogram_quantile(0.95, rate(http_server_request_duration_seconds_bucket[5m]))
   
   # Active DB connections
   db_client_connections_usage
   ```

### Grafana
1. Open http://localhost:3001 (admin/admin)
2. Navigate to existing dashboards
3. Metrics will populate automatically

## Architecture

```
┌─────────────────────────────────────────┐
│     Dashboard / Worker Application      │
│                                         │
│  (Auto-instrumented by OpenTelemetry)   │
└───────────────┬─────────────────────────┘
                │
                │ Metrics exposed on :9464/:9465
                ▼
┌───────────────────────────────────────┐
│           PROMETHEUS                  │
│     (Scrapes metrics every 15s)       │
└───────────────┬───────────────────────┘
                │
                │ Visualized by
                ▼
┌───────────────────────────────────────┐
│            GRAFANA                    │
│   (Dashboards + Queries + Alerts)     │
└───────────────────────────────────────┘
```

## Dependencies

- `@opentelemetry/sdk-node` - Core SDK
- `@opentelemetry/auto-instrumentations-node` - Auto-instrumentation
- `@opentelemetry/exporter-prometheus` - Prometheus exporter
- `@opentelemetry/resources` - Resource management
- `@opentelemetry/semantic-conventions` - Standard attributes

## Development

```bash
# Build the package
pnpm build

# Typecheck
pnpm typecheck
```

## License

MIT
