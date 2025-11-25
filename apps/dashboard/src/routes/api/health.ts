import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';
import { getRedis } from '~/lib/redis';
import { sql } from '@flagmeter/db';

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Check Valkey connection
          const redis = getRedis();
          await redis.ping();

          // Check Postgres connection
          await sql`SELECT 1`;

          return json({ 
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
              database: 'up',
              redis: 'up',
            }
          });
        } catch (error) {
          return json({ 
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error'
          }, { status: 503 });
        }
      },
    },
  },
});
