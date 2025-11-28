import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';
import { db, events, tenants } from '@flagmeter/db';
import { getRedis, QUEUE_NAME } from '~/lib/redis';
import { logger } from '~/lib/logger';
import { recordHttpMetrics } from '~/lib/metrics.server';
import { z } from 'zod';
import type { CreateEventRequest, CreateEventResponse, EventJob } from '@flagmeter/types';
import { eq } from 'drizzle-orm';

const createEventSchema = z.object({
  tenant: z.string().min(1),
  feature: z.string().min(1),
  tokens: z.number().int().positive(),
});

export const Route = createFileRoute('/api/events')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const startTime = Date.now();
        let statusCode = 500; // Default to error status

        try {
          const body = await request.json() as CreateEventRequest;

          // Validate input
          const validation = createEventSchema.safeParse(body);
          if (!validation.success) {
            statusCode = 400;
            recordHttpMetrics('POST', '/api/events', statusCode, Date.now() - startTime);
            return json({ error: 'Invalid request body', details: validation.error.issues }, { status: statusCode });
          }

          const { tenant: tenantName, feature, tokens } = validation.data;

          // Find tenant by name
          let [tenant] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.name, tenantName))
            .limit(1);

          if (!tenant) {
            // lets create the tenant
            // return json({ error: `Tenant '${tenantName}' not found` }, { status: 404 });
            const [newTenant] = await db
              .insert(tenants)
              .values({ name: tenantName, monthlyQuota: 1000000000 })
              .returning();

            logger.info({ tenantId: newTenant.id, tenantName }, 'Created new tenant');
            tenant = newTenant;
          }

          // Insert event via Drizzle
          const [event] = await db
            .insert(events)
            .values({
              tenantId: tenant.id,
              feature,
              tokens,
            })
            .returning();

          // Push job to Valkey queue
          const redis = getRedis();
          const job: EventJob = {
            eventId: event.id,
            tenantId: tenant.id,
            feature: event.feature,
            tokens: event.tokens,
            createdAt: event.createdAt.toISOString(),
          };

          await redis.lpush(QUEUE_NAME, JSON.stringify(job));

          logger.info({ eventId: event.id, tenant: tenantName, feature, tokens }, 'Event created');

          const response: CreateEventResponse = {
            success: true,
            eventId: event.id,
          };

          statusCode = 201;
          recordHttpMetrics('POST', '/api/events', statusCode, Date.now() - startTime);
          return json(response, { status: statusCode });
        } catch (error) {
          logger.error({ error }, 'Failed to create event');
          statusCode = 500;
          recordHttpMetrics('POST', '/api/events', statusCode, Date.now() - startTime);
          return json({ error: 'Internal server error' }, { status: statusCode });
        }
      },
    },
  },
});
