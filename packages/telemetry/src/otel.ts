import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

export interface TelemetryConfig {
  serviceName: string;
  serviceVersion?: string;
  metricsPort?: number;
  enableHttpInstrumentation?: boolean;
  enablePgInstrumentation?: boolean;
  enableIoredisInstrumentation?: boolean;
  enableFsInstrumentation?: boolean;
}

export function initializeTelemetry(config: TelemetryConfig): NodeSDK {
  const {
    serviceName,
    serviceVersion = '1.0.0',
    metricsPort = 9464,
    enableHttpInstrumentation = true,
    enablePgInstrumentation = true,
    enableIoredisInstrumentation = true,
    enableFsInstrumentation = false, // Disable by default (too noisy)
  } = config;

  // Prometheus exporter for metrics
  const prometheusExporter = new PrometheusExporter({
    port: metricsPort,
    endpoint: '/metrics',
  });

  // Create OpenTelemetry SDK
  const sdk = new NodeSDK({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: serviceVersion,
    }),
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
    ],
  });

  // Start the SDK
  sdk.start();

  console.log(`[OpenTelemetry] Initialized for service: ${serviceName}`);
  console.log(`[OpenTelemetry] Metrics server started on :${metricsPort}/metrics`);

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

  return sdk;
}
