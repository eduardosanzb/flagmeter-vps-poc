// Initialize OpenTelemetry for Dashboard
// This file must be loaded BEFORE the main application
import { initializeTelemetry } from '@flagmeter/telemetry';

initializeTelemetry({
  serviceName: process.env.SERVICE_NAME || 'flagmeter-dashboard',
  serviceVersion: '1.0.0',
  metricsPort: 9464,
  enableHttpInstrumentation: true,
  enablePgInstrumentation: true,
  enableIoredisInstrumentation: true,
});
