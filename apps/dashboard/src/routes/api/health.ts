import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';
import { getRedis } from '~/lib/redis';
import { recordHttpMetrics } from '~/lib/metrics.server';
import { getAllSecurityHeaders } from '~/lib/security.server';
import { sql } from '@flagmeter/db';

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const startTime = Date.now();
        let statusCode = 200;
        const securityHeaders = getAllSecurityHeaders(request);

        try {
          // Check Valkey connection
          const redis = getRedis();
          await redis.ping();

          // Check Postgres connection
          await sql`SELECT 1`;

          recordHttpMetrics('GET', '/api/health', statusCode, Date.now() - startTime);
          return json({ 
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
              database: 'up',
              redis: 'up',
            }
          }, { headers: securityHeaders });
        } catch (error) {
          statusCode = 503;
          recordHttpMetrics('GET', '/api/health', statusCode, Date.now() - startTime);
          return json({ 
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error'
          }, { status: statusCode, headers: securityHeaders });
        }
      },
    },
  },
});
