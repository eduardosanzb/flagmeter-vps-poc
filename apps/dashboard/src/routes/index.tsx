import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSql } from '@flagmeter/db';
import type { TenantUsageData } from '@flagmeter/types';

// Server function to fetch all tenants usage
const fetchTenantsUsage = createServerFn({ method: 'GET' }).handler(async () => {
  const sql = getSql();
  const result = await sql`
    SELECT
      t.id,
      t.name,
      t.monthly_quota,
      COALESCE(SUM(r.total_tokens), 0)::int AS total_tokens
    FROM tenants t
    LEFT JOIN rollups r ON r.tenant_id = t.id
      AND r.minute >= date_trunc('month', now())
    GROUP BY t.id, t.name, t.monthly_quota
    ORDER BY t.name
  `;

  return result.map((row) => {
    const totalTokens = Number(row.total_tokens);
    const monthlyQuota = Number(row.monthly_quota);
    const quotaPercent = monthlyQuota > 0 ? Math.round((totalTokens / monthlyQuota) * 100) : 0;

    return {
      id: row.id as string,
      name: row.name as string,
      totalTokens,
      monthlyQuota,
      quotaPercent,
    } satisfies TenantUsageData;
  });
});

export const Route = createFileRoute('/')({
  component: Home,
  notFoundComponent: () => <div>Page Not Found</div>,
  loader: async () => {
    try{

    const tenants = await fetchTenantsUsage()
    return { tenants };
    }catch(e){
      console.error("Error fetching tenant usage:", e);
      return { tenants: [] };
    }
  },
});

function Home() {
  const { tenants } = Route.useLoaderData();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>FlagMeter Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Real-time AI quota monitoring</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {tenants.map((tenant) => (
          <div key={tenant.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: tenant.quotaPercent >= 80 ? '#fee' : '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1.1rem' }}>{tenant.name}</strong>
              <span style={{ color: tenant.quotaPercent >= 80 ? '#c00' : '#666' }}>
                {tenant.quotaPercent}%
              </span>
            </div>
            <div style={{ marginBottom: '0.5rem', color: '#666' }}>
              {tenant.totalTokens.toLocaleString()} / {tenant.monthlyQuota.toLocaleString()} tokens
            </div>
            <div style={{
              height: '24px',
              backgroundColor: '#eee',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(tenant.quotaPercent, 100)}%`,
                backgroundColor: tenant.quotaPercent >= 80 ? '#c00' : '#4CAF50',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ))}
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            setInterval(() => {
              window.location.reload();
            }, 5000);
          `
        }}
      />
    </div>
  );
}
