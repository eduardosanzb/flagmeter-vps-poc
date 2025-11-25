import { db } from './client.js';
import { tenants, slackWebhooks } from './schema.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding database...');

  // Create 3 fake tenants
  const seedTenants = [
    { name: 'acme-corp', monthlyQuota: 1_000_000, billingDay: 1 },
    { name: 'globex-inc', monthlyQuota: 1_000_000, billingDay: 1 },
    { name: 'initech-llc', monthlyQuota: 1_000_000, billingDay: 1 },
  ];

  for (const tenant of seedTenants) {
    const [created] = await db
      .insert(tenants)
      .values(tenant)
      .onConflictDoNothing()
      .returning();
    
    if (created) {
      console.log(`Created tenant: ${created.name} (${created.id})`);
      
      // Add optional slack webhook (can be configured later)
      await db
        .insert(slackWebhooks)
        .values({
          tenantId: created.id,
          url: `https://hooks.slack.com/services/EXAMPLE/${created.name}`,
          enabled: false, // Disabled by default in seed
        })
        .onConflictDoNothing();
    }
  }

  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
