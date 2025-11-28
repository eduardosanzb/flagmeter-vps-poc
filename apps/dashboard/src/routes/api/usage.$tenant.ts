import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';
import { sql } from '@flagmeter/db';
import { logger } from '~/lib/logger';
import { recordHttpMetrics } from '~/lib/metrics.server';
import type { UsageResponse } from '@flagmeter/types';

export const Route = createFileRoute('/api/usage/$tenant')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const startTime = Date.now();
        let statusCode = 200;

        try {
          const tenantName = params.tenant;

          // Use raw SQL for hot path performance
          const result = await sql`
            SELECT 
              t.id,
              t.name,
              t.monthly_quota,
              COALESCE(SUM(r.total_tokens), 0)::int AS total_tokens
            FROM tenants t
            LEFT JOIN rollups r ON r.tenant_id = t.id 
              AND r.minute >= date_trunc('month', now())
            WHERE t.name = ${tenantName}
            GROUP BY t.id, t.name, t.monthly_quota
            LIMIT 1
          `;

          if (result.length === 0) {
            statusCode = 404;
            recordHttpMetrics('GET', '/api/usage/:tenant', statusCode, Date.now() - startTime);
            return json({ error: `Tenant '${tenantName}' not found` }, { status: statusCode });
          }

          const row = result[0];
          const totalTokens = Number(row.total_tokens);
          const monthlyQuota = Number(row.monthly_quota);
          const quotaPercent = monthlyQuota > 0 ? Math.round((totalTokens / monthlyQuota) * 100) : 0;

          // Calculate period start/end
          const now = new Date();
          const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

          const response: UsageResponse = {
            tenant: row.id as string,
            tenantName: row.name as string,
            totalTokens,
            monthlyQuota,
            quotaPercent,
            periodStart: periodStart.toISOString(),
            periodEnd: periodEnd.toISOString(),
          };

          logger.info({ tenant: tenantName, quotaPercent }, 'Usage retrieved');

          recordHttpMetrics('GET', '/api/usage/:tenant', statusCode, Date.now() - startTime);
          return json(response);
        } catch (error) {
          logger.error({ error, tenant: params.tenant }, 'Failed to retrieve usage');
          statusCode = 500;
          recordHttpMetrics('GET', '/api/usage/:tenant', statusCode, Date.now() - startTime);
          return json({ error: 'Internal server error' }, { status: statusCode });
        }
      },
    },
  },
});
