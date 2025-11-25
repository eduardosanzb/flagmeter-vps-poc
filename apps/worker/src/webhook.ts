import { db, slackWebhooks, tenants } from '@flagmeter/db';
import { logger } from './logger.js';
import { eq, and } from 'drizzle-orm';
import type { SlackWebhookPayload } from '@flagmeter/types';

// Track which tenants we've already notified this month to avoid spam
const notifiedThisMonth = new Set<string>();

// Reset notifications at the start of each month
setInterval(() => {
  const now = new Date();
  if (now.getDate() === 1 && now.getHours() === 0) {
    notifiedThisMonth.clear();
    logger.info('Reset monthly webhook notifications');
  }
}, 60 * 60 * 1000); // Check every hour

export async function checkQuotaAndNotify(
  tenantId: string,
  totalTokens: number,
  monthlyQuota: number,
  quotaPercent: number
): Promise<void> {
  // Only notify once per month per tenant
  if (notifiedThisMonth.has(tenantId)) {
    return;
  }

  if (quotaPercent < 80) {
    return;
  }

  try {
    // Fetch tenant name
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1);

    if (!tenant) {
      logger.warn({ tenantId }, 'Tenant not found for webhook notification');
      return;
    }

    // Fetch webhook configuration
    const [webhook] = await db
      .select()
      .from(slackWebhooks)
      .where(and(
        eq(slackWebhooks.tenantId, tenantId),
        eq(slackWebhooks.enabled, true)
      ))
      .limit(1);

    if (!webhook) {
      logger.info({ tenantId, tenantName: tenant.name }, 'No enabled webhook found for tenant');
      return;
    }

    // Prepare payload
    const payload: SlackWebhookPayload = {
      text: `FlagMeter: tenant '${tenant.name}' has hit ${Math.round(quotaPercent)}% of ${monthlyQuota.toLocaleString()} tokens this month.`,
    };

    // Send webhook with retry logic (3 attempts, exponential backoff)
    let attempt = 0;
    const maxAttempts = 3;
    
    while (attempt < maxAttempts) {
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          logger.info({ 
            tenantId, 
            tenantName: tenant.name, 
            quotaPercent: quotaPercent.toFixed(2),
            attempt: attempt + 1 
          }, 'Webhook notification sent successfully');
          
          notifiedThisMonth.add(tenantId);
          return;
        } else {
          throw new Error(`Webhook returned status ${response.status}`);
        }
      } catch (error) {
        attempt++;
        logger.warn({ 
          error, 
          tenantId, 
          attempt, 
          maxAttempts 
        }, 'Webhook notification failed');

        if (attempt < maxAttempts) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    logger.error({ tenantId, tenantName: tenant.name }, 'Failed to send webhook after all retries');
  } catch (error) {
    logger.error({ error, tenantId }, 'Error in webhook notification');
  }
}
