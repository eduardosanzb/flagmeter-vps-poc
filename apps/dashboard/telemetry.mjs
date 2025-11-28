// Initialize OpenTelemetry for Dashboard
// This file must be loaded BEFORE the main application
import { initializeTelemetry } from '@flagmeter/telemetry';

// Initialize telemetry ONLY ONCE
const sdk = initializeTelemetry({
  serviceName: process.env.SERVICE_NAME || 'flagmeter-dashboard',
  serviceVersion: '1.0.0',
  metricsPort: 9464,
  enableHttpInstrumentation: false, // Disabled to avoid body reading conflicts with TanStack Start/Nitro
  enablePgInstrumentation: true,
  enableIoredisInstrumentation: true,
});

// IMPORTANT: Force eager loading of metrics module to ensure instruments
// are created with the correct MeterProvider before Vite workers start
// This prevents the metrics module from being loaded in a different context
// where it would get a different (or NoopMeterProvider)
console.log('[Telemetry] Pre-loading metrics module...');
import('./src/lib/metrics.ts').catch((err) => {
  console.error('[Telemetry] Failed to pre-load metrics module:', err);
});
