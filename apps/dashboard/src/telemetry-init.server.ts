// Initialize OpenTelemetry for server-side in DEVELOPMENT mode only
// In production, telemetry is initialized via NODE_OPTIONS --import ./telemetry-prod.mjs
// This approach avoids bundling issues while maintaining good DX in dev mode

import { logger } from './lib/logger';

// Use dynamic import to prevent Vite from bundling OpenTelemetry in production
// Only initialize on server-side in development mode
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  logger.info('Initializing telemetry for development mode');

  // Dynamic import prevents Vite from trying to bundle this module
  import('@flagmeter/telemetry').then(({ initializeTelemetry }) => {
    initializeTelemetry({
      serviceName: process.env.SERVICE_NAME || 'flagmeter-dashboard',
      serviceVersion: '1.0.0',
      metricsPort: 9464,
      enableHttpInstrumentation: false, // Disabled to avoid body reading conflicts
      enablePgInstrumentation: true,
      enableIoredisInstrumentation: true,
    });
    logger.info('Development telemetry initialization complete');
  }).catch((err) => {
    logger.error({ error: err }, 'Failed to initialize telemetry');
  });
} else if (typeof window === 'undefined') {
  logger.info('Production mode - telemetry initialized via NODE_OPTIONS');
}

// Export empty object so this can be imported
export {};
