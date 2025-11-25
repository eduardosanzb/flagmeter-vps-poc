import { getConnection } from './src/client.js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load .env from root
try {
  const envPath = join(process.cwd(), '../../.env');
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#][^=]*)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (err) {
  console.warn('⚠️  Could not load .env file from root');
}

async function seed() {
  console.log('Getting database connection...');
  console.log(process.env.DATABASE_URL);
  const sql = getConnection();

  console.log('🌱 Seeding database...');

  // Check if tenants already exist
  const existing = await sql`SELECT name FROM tenants WHERE name IN ('acme-corp', 'techstart-io', 'enterprise-llc')`;
  
  if (existing.length === 0) {
    // Create test tenants
    await sql`
      INSERT INTO tenants (name, monthly_quota)
      VALUES 
        ('acme-corp', 1000000),
        ('techstart-io', 500000),
        ('enterprise-llc', 2000000)
    `;
    console.log('✅ Created 3 test tenants');
  } else {
    console.log('✅ Test tenants already exist');
  }

  // Get tenant IDs
  const tenants = await sql`SELECT id, name FROM tenants ORDER BY name`;

  // Create some test events for this month
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  for (const tenant of tenants) {
    // Random usage between 30-90% of quota
    const usagePercent = 30 + Math.random() * 60;
    const tenantQuota = tenant.name === 'acme-corp' ? 1000000 : tenant.name === 'techstart-io' ? 500000 : 2000000;
    const tokensUsed = Math.floor(tenantQuota * (usagePercent / 100));

    // Create events spread across the month
    const eventsCount = Math.floor(Math.random() * 50) + 20;
    const tokensPerEvent = Math.floor(tokensUsed / eventsCount);

    for (let i = 0; i < eventsCount; i++) {
      await sql`
        INSERT INTO events (tenant_id, feature, tokens, created_at)
        VALUES (
          ${tenant.id},
          ${['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'embedding'][Math.floor(Math.random() * 4)]},
          ${tokensPerEvent + Math.floor(Math.random() * 1000)},
          ${new Date(currentMonth.getTime() + Math.random() * (now.getTime() - currentMonth.getTime()))}
        )
      `;
    }

    console.log(`✅ Created ${eventsCount} events for ${tenant.name} (~${usagePercent.toFixed(0)}% usage)`);
  }

  // Create aggregated rollups for each minute bucket
  await sql`
    INSERT INTO rollups (tenant_id, feature, minute, total_tokens)
    SELECT 
      tenant_id,
      feature,
      date_trunc('minute', created_at) as minute,
      SUM(tokens)::int as total_tokens
    FROM events
    WHERE created_at >= date_trunc('month', now())
    GROUP BY tenant_id, feature, date_trunc('minute', created_at)
    ON CONFLICT (tenant_id, feature, minute) 
    DO UPDATE SET
      total_tokens = EXCLUDED.total_tokens
  `;

  console.log('✅ Created rollup aggregates');

  console.log('');
  console.log('🎉 Seeding completed!');
  console.log('');
  console.log('📊 Summary:');
  
  const summary = await sql`
    SELECT 
      t.name,
      t.monthly_quota,
      COALESCE(SUM(r.total_tokens), 0)::int as total_tokens,
      ROUND(COALESCE(SUM(r.total_tokens), 0) * 100.0 / t.monthly_quota, 1) as usage_percent
    FROM tenants t
    LEFT JOIN rollups r ON r.tenant_id = t.id 
      AND r.minute >= date_trunc('month', now())
    GROUP BY t.id, t.name, t.monthly_quota
    ORDER BY t.name
  `;

  for (const row of summary) {
    console.log(`   ${row.name}: ${Number(row.total_tokens).toLocaleString()} / ${Number(row.monthly_quota).toLocaleString()} tokens (${row.usage_percent}%)`);
  }

  await sql.end();
}

seed().catch(console.error);
