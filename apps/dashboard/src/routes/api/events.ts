import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';
import { db, events, tenants } from '@flagmeter/db';
import { getRedis, QUEUE_NAME } from '~/lib/redis';
import { logger } from '~/lib/logger';
import { recordHttpMetrics } from '~/lib/metrics.server';
import { rateLimit, getClientIp, getAllSecurityHeaders, checkRequestSize } from '~/lib/security.server';
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
        const securityHeaders = getAllSecurityHeaders(request);

        try {
          // Check request size
          const sizeCheck = await checkRequestSize(request, 100);
          if (!sizeCheck.valid) {
            statusCode = 413;
            recordHttpMetrics('POST', '/api/events', statusCode, Date.now() - startTime);
            return json({ error: sizeCheck.error }, { status: statusCode, headers: securityHeaders });
          }

          // Rate limiting: 100 requests per minute per IP
          const clientIp = getClientIp(request);
          const rateLimitResult = await rateLimit(`events:${clientIp}`, 100, 60);
          
          if (!rateLimitResult.allowed) {
            statusCode = 429;
            const headers = {
              ...securityHeaders,
              'X-RateLimit-Limit': '100',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
              'Retry-After': Math.ceil((rateLimitResult.resetAt * 1000 - Date.now()) / 1000).toString(),
            };
            recordHttpMetrics('POST', '/api/events', statusCode, Date.now() - startTime);
            return json({ error: 'Rate limit exceeded' }, { status: statusCode, headers });
          }

          const body = await request.json() as CreateEventRequest;

          // Validate input
          const validation = createEventSchema.safeParse(body);
          if (!validation.success) {
            statusCode = 400;
            logger.warn({ 
              errorCount: validation.error.issues.length
            }, 'Invalid event request');
            recordHttpMetrics('POST', '/api/events', statusCode, Date.now() - startTime);
            return json({ error: 'Invalid request body', details: validation.error.issues }, { status: statusCode, headers: securityHeaders });
          }

          const { tenant: tenantName, feature, tokens } = validation.data;

          // Find tenant by name
          const tenantLookupStart = Date.now();
          let [tenant] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.name, tenantName))
            .limit(1);
          const tenantLookupDuration = Date.now() - tenantLookupStart;

          if (!tenant) {
            // lets create the tenant
            // return json({ error: `Tenant '${tenantName}' not found` }, { status: 404 });
            const tenantCreateStart = Date.now();
            const [newTenant] = await db
              .insert(tenants)
              .values({ name: tenantName, monthlyQuota: 1000000000 })
              .returning();
            const tenantCreateDuration = Date.now() - tenantCreateStart;

            logger.info({ 
              tenantId: newTenant.id, 
              tenantName,
              tenantCreateDuration,
              monthlyQuota: 1000000000
            }, 'Created new tenant');
            tenant = newTenant;
          }

          // Insert event via Drizzle
          const eventInsertStart = Date.now();
          const [event] = await db
            .insert(events)
            .values({
              tenantId: tenant.id,
              feature,
              tokens,
            })
            .returning();
          const eventInsertDuration = Date.now() - eventInsertStart;

          // Push job to Valkey queue
          const redis = getRedis();
          const job: EventJob = {
            eventId: event.id,
            tenantId: tenant.id,
            feature: event.feature,
            tokens: event.tokens,
            createdAt: event.createdAt.toISOString(),
          };

          const queuePushStart = Date.now();
          await redis.lpush(QUEUE_NAME, JSON.stringify(job));
          const queuePushDuration = Date.now() - queuePushStart;

          const totalDuration = Date.now() - startTime;
          logger.info({ 
            eventId: event.id, 
            tenantId: tenant.id,
            tenant: tenantName, 
            feature, 
            tokens,
            tenantLookupDuration,
            eventInsertDuration,
            queuePushDuration,
            totalDuration
          }, 'Event created and queued');

          const response: CreateEventResponse = {
            success: true,
            eventId: event.id,
          };

          statusCode = 201;
          const responseHeaders = {
            ...securityHeaders,
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          };
          recordHttpMetrics('POST', '/api/events', statusCode, Date.now() - startTime);
          return json(response, { status: statusCode, headers: responseHeaders });
        } catch (error) {
          const totalDuration = Date.now() - startTime;
          logger.error({ 
            error, 
            totalDuration,
            requestPath: '/api/events'
          }, 'Failed to create event');
          statusCode = 500;
          recordHttpMetrics('POST', '/api/events', statusCode, Date.now() - startTime);
          return json({ error: 'Internal server error' }, { status: statusCode, headers: securityHeaders });
        }
      },
    },
  },
});
