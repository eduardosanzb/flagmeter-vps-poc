// Manual HTTP metrics instrumentation
// This module provides utilities to track HTTP request metrics manually,
// avoiding conflicts with OpenTelemetry auto-instrumentation
// This file is server-only (.server.ts) and will not be bundled for the client

// TEMPORARY: Commented out for production build testing
// import { getMeter } from '@flagmeter/telemetry';
// import type { Counter, Histogram } from '@opentelemetry/api';
import type { Counter, Histogram } from '@opentelemetry/api';

// Lazy initialization to ensure SDK is ready
let httpRequestCounter: Counter | null = null;
let httpRequestDuration: Histogram | null = null;

function ensureMetricsInitialized() {
  if (httpRequestCounter && httpRequestDuration) {
    return; // Already initialized
  }

  // TEMPORARY: Disabled for production build testing
  console.log('[Metrics] Metrics disabled for production build');
  return;

  // // Get meter for manual HTTP instrumentation
  // const meter = getMeter('flagmeter-dashboard', '1.0.0');

  // // HTTP request counter - tracks total requests by route, method, and status
  // httpRequestCounter = meter.createCounter('http_server_requests', {
  //   description: 'Total number of HTTP requests',
  //   unit: '{request}',
  // });

  // // HTTP request duration histogram - tracks request latency distribution  
  // httpRequestDuration = meter.createHistogram('http_server_duration', {
  //   description: 'Duration of HTTP requests in milliseconds',
  //   unit: 'ms',
  // });

  // console.log('[Metrics] HTTP metrics instruments created');
  // console.log('[Metrics] Counter:', httpRequestCounter.constructor.name);
  // console.log('[Metrics] Histogram:', httpRequestDuration.constructor.name);
}

/**
 * Helper function to record HTTP metrics for a request/response
 * 
 * @param method HTTP method (GET, POST, etc.)
 * @param route Route pattern (e.g., '/api/events')
 * @param statusCode HTTP status code
 * @param durationMs Request duration in milliseconds
 */
export function recordHttpMetrics(
  method: string,
  route: string,
  statusCode: number,
  durationMs: number,
) {
  // Ensure metrics are initialized
  ensureMetricsInitialized();

  if (!httpRequestCounter || !httpRequestDuration) {
    console.warn('[Metrics] Instruments not initialized, skipping recording');
    return;
  }

  // Use underscore-separated attribute names for Prometheus compatibility
  const attributes = {
    service_name: 'dashboard',
    http_method: method,
    http_route: route,
    http_status_code: statusCode,
  };

  console.log(`[Metrics] Recording: ${method} ${route} ${statusCode} ${durationMs}ms`);
  httpRequestCounter.add(1, attributes);
  httpRequestDuration.record(durationMs, attributes);
  console.log('[Metrics] Recorded successfully');
}
