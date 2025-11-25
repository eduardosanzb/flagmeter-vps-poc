import { json } from '@tanstack/start';
import { redis } from '~/lib/redis';
import { sql } from '@flagmeter/db';

export async function GET() {
  try {
    // Check Valkey connection
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
}
