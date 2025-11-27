// Initialize OpenTelemetry for Worker
// This file must be loaded BEFORE the main application
import { initializeTelemetry } from '@flagmeter/telemetry';

initializeTelemetry({
  serviceName: process.env.SERVICE_NAME || 'flagmeter-worker',
  serviceVersion: '1.0.0',
  metricsPort: 9465,
  enableHttpInstrumentation: false, // Worker doesn't serve HTTP
  enablePgInstrumentation: true,
  enableIoredisInstrumentation: true,
});
