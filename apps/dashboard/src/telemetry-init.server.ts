// Initialize OpenTelemetry for server-side in DEVELOPMENT mode only
// In production, telemetry is initialized via NODE_OPTIONS --require ./telemetry.mjs
// This approach avoids bundling issues while maintaining good DX in dev mode

// TEMPORARY: Completely disabled to fix Vite bundling issue
// The problem is that Vite analyzes all imports even in conditional/dynamic imports
// TODO: Re-enable after fixing the bundling configuration

// // Use dynamic import to prevent Vite from bundling OpenTelemetry in production
// // Only initialize on server-side in development mode
// if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
//   console.log('[Telemetry] Initializing for development mode...');
//   
//   // Dynamic import prevents Vite from trying to bundle this module
//   import('@flagmeter/telemetry').then(({ initializeTelemetry }) => {
//     initializeTelemetry({
//       serviceName: process.env.SERVICE_NAME || 'flagmeter-dashboard',
//       serviceVersion: '1.0.0',
//       metricsPort: 9464,
//       enableHttpInstrumentation: false, // Disabled to avoid body reading conflicts
//       enablePgInstrumentation: true,
//       enableIoredisInstrumentation: true,
//     });
//     console.log('[Telemetry] Development initialization complete');
//   }).catch((err) => {
//     console.error('[Telemetry] Failed to initialize:', err);
//   });
// } else if (typeof window === 'undefined') {
//   console.log('[Telemetry] Production mode - telemetry should be initialized via NODE_OPTIONS');
// }

console.log('[Telemetry] Telemetry initialization via NODE_OPTIONS --require ./telemetry.mjs');

// Export empty object so this can be imported
export {};
