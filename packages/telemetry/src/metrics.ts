// Export utilities for creating manual metrics
import { metrics } from '@opentelemetry/api';
import type { Meter } from '@opentelemetry/api';

/**
 * Get a meter for creating manual metrics
 * This function ensures we get the properly initialized MeterProvider
 */
export function getMeter(name: string, version?: string): Meter {
  const meterProvider = metrics.getMeterProvider();
  const meter = metrics.getMeter(name, version);
  console.log(`[Telemetry] getMeter called for ${name}`);
  console.log(`[Telemetry] MeterProvider:`, meterProvider.constructor.name);
  console.log(`[Telemetry] Meter:`, meter.constructor.name);
  return meter;
}
