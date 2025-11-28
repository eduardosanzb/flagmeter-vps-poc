import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
// @ts-ignore - resourceFromAttributes exists but TypeScript can't find it in types
import { resourceFromAttributes } from '@opentelemetry/resources';
import { metrics } from '@opentelemetry/api';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';

export interface TelemetryConfig {
  serviceName: string;
  serviceVersion?: string;
  metricsPort?: number;
  enableHttpInstrumentation?: boolean;
  enablePgInstrumentation?: boolean;
  enableIoredisInstrumentation?: boolean;
  enableFsInstrumentation?: boolean;
}

// Use globalThis to prevent multiple initializations across module contexts
declare global {
  var __OTEL_SDK_INSTANCE__: NodeSDK | undefined;
}

export function initializeTelemetry(config: TelemetryConfig): NodeSDK {
  // If already initialized, return the existing instance
  if (globalThis.__OTEL_SDK_INSTANCE__) {
    console.log(`[OpenTelemetry] Already initialized, skipping...`);
    return globalThis.__OTEL_SDK_INSTANCE__;
  }
  const {
    serviceName,
    serviceVersion = '1.0.0',
    metricsPort = 9464,
    enableHttpInstrumentation = true,
    enablePgInstrumentation = true,
    enableIoredisInstrumentation = true,
    enableFsInstrumentation = false, // Disable by default (too noisy)
  } = config;

  // Create resource
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: serviceVersion,
  });

  // Prometheus exporter for metrics
  const prometheusExporter = new PrometheusExporter({
    port: metricsPort,
    endpoint: '/metrics',
  });

  // DON'T create a separate MeterProvider - let NodeSDK create it
  // NodeSDK will create a MeterProvider with the metricReader we pass
  // and register it globally automatically when sdk.start() is called
  
  // Create OpenTelemetry SDK with metricReader parameter
  // NodeSDK will create a MeterProvider with this reader and register it globally
  const sdk = new NodeSDK({
    resource,
    metricReader: prometheusExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // HTTP instrumentation (requests/responses)
        '@opentelemetry/instrumentation-http': {
          enabled: enableHttpInstrumentation,
        },
        // PostgreSQL instrumentation
        '@opentelemetry/instrumentation-pg': {
          enabled: enablePgInstrumentation,
        },
        // IORedis instrumentation (Valkey)
        '@opentelemetry/instrumentation-ioredis': {
          enabled: enableIoredisInstrumentation,
        },
        // Filesystem instrumentation (disabled by default - too noisy)
        '@opentelemetry/instrumentation-fs': {
          enabled: enableFsInstrumentation,
        },
      }),
      // Runtime metrics for Node.js (heap, GC, event loop, CPU, etc.)
      new RuntimeNodeInstrumentation({
        monitoringPrecision: 5000, // Collect metrics every 5 seconds
      }),
    ],
  });

  // Start the SDK
  sdk.start();

  // Initialize host metrics (CPU, memory, network, disk)
  const hostMetrics = new HostMetrics({
    name: `${serviceName}-host-metrics`,
    meterProvider: metrics.getMeterProvider() as any,
  });
  hostMetrics.start();

  console.log(`[OpenTelemetry] Initialized for service: ${serviceName}`);
  console.log(`[OpenTelemetry] Metrics server started on :${metricsPort}/metrics`);
  console.log(`[OpenTelemetry] Host metrics collection enabled`);
  
  // Log the global MeterProvider to verify it's set correctly
  const globalProvider = metrics.getMeterProvider();
  console.log(`[OpenTelemetry] Global MeterProvider:`, globalProvider.constructor.name);

  // Graceful shutdown
  const shutdown = async () => {
    try {
      await sdk.shutdown();
      console.log('[OpenTelemetry] SDK shut down successfully');
    } catch (error) {
      console.error('[OpenTelemetry] Error shutting down SDK:', error);
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Store the instance globally to prevent re-initialization
  globalThis.__OTEL_SDK_INSTANCE__ = sdk;

  return sdk;
}
