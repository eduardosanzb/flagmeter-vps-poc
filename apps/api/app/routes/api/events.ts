import { json } from '@tanstack/start';
import { db, events, tenants } from '@flagmeter/db';
import { redis, QUEUE_NAME } from '~/lib/redis';
import { logger } from '~/lib/logger';
import { z } from 'zod';
import type { CreateEventRequest, CreateEventResponse, EventJob } from '@flagmeter/types';
import { eq } from 'drizzle-orm';

const createEventSchema = z.object({
  tenant: z.string().min(1),
  feature: z.string().min(1),
  tokens: z.number().int().positive(),
});

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json() as CreateEventRequest;
    
    // Validate input
    const validation = createEventSchema.safeParse(body);
    if (!validation.success) {
      return json({ error: 'Invalid request body', details: validation.error.errors }, { status: 400 });
    }

    const { tenant: tenantName, feature, tokens } = validation.data;

    // Find tenant by name
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.name, tenantName))
      .limit(1);

    if (!tenant) {
      return json({ error: `Tenant '${tenantName}' not found` }, { status: 404 });
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

    return json(response, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Failed to create event');
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
