// Initialize OpenTelemetry for Dashboard (Production)
// This file is loaded via NODE_OPTIONS --import before the application starts

import { initializeTelemetry } from '@flagmeter/telemetry';

initializeTelemetry({
  serviceName: process.env.SERVICE_NAME || 'flagmeter-dashboard',
  serviceVersion: '1.0.0',
  metricsPort: 9464,
  enableHttpInstrumentation: false, // Disabled to avoid body reading conflicts with TanStack Start/Nitro
  enablePgInstrumentation: true,
  enableIoredisInstrumentation: true,
});

console.log('[Telemetry] Production initialization via --import');
