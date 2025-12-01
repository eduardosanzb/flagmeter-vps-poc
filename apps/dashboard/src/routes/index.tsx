import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSql } from '@flagmeter/db';
import type { TenantUsageData } from '@flagmeter/types';
import { useEffect } from 'react';

// Server function to fetch all tenants usage
const fetchTenantsUsage = createServerFn({ method: 'GET' }).handler(async () => {
  const sql = getSql();
  const result = await sql`
    SELECT
      t.id,
      t.name,
      t.monthly_quota,
      COALESCE(SUM(r.total_tokens), 0)::bigint AS total_tokens
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
    return { tenants, lastUpdated: new Date().toISOString() };
    }catch(e){
      console.error("Error fetching tenant usage:", e);
      return { tenants: [], lastUpdated: new Date().toISOString() };
    }
  },
  // Enable automatic refetching every 5 seconds using TanStack Router's built-in polling
  staleTime: 5000,
});

function Home() {
  const { tenants, lastUpdated } = Route.useLoaderData();
  const router = useRouter();

  // Auto-refresh data every 5 seconds without full page reload
  useEffect(() => {
    const interval = setInterval(() => {
      // Invalidate the route to trigger a refetch of loader data
      router.invalidate();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>FlagMeter Dashboard</h1>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Real-time AI quota monitoring</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/eduardosanzb/flagmeter-vps-poc"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#24292e',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1e22'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#24292e'}
          >
            <svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View Code
          </a>
          <a
            href="https://notes.eduardosanzb.dev/s/aa17de1b-baac-4784-9142-dca089d298a5"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0969da',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0860ca'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0969da'}
          >
            <svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
              <path d="M1.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25H1.75zM0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zm9.22 3.72a.75.75 0 000 1.06L10.69 8 9.22 9.47a.75.75 0 101.06 1.06l2-2a.75.75 0 000-1.06l-2-2a.75.75 0 00-1.06 0zM6.78 6.53a.75.75 0 00-1.06-1.06l-2 2a.75.75 0 000 1.06l2 2a.75.75 0 101.06-1.06L5.31 8l1.47-1.47z" />
            </svg>
            Results
          </a>
        </div>
      </div>

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

      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#999', fontSize: '0.875rem' }}>
        Auto-refreshes every 5 seconds • Last updated: {new Date(lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
}
