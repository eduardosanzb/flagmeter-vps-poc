-- FlagMeter Database Schema
-- Run this in the postgres container with: psql -U flagmeter -d flagmeter -f MIGRATION.sql

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  monthly_quota INTEGER NOT NULL DEFAULT 1000000,
  billing_day INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS tenants_name_idx ON tenants(name);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  tokens INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_tenant_id ON events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Create rollups table (aggregated per minute)
CREATE TABLE IF NOT EXISTS rollups (
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  minute TIMESTAMP WITH TIME ZONE NOT NULL,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (tenant_id, feature, minute)
);

CREATE INDEX IF NOT EXISTS idx_rollups_tenant_minute ON rollups(tenant_id, minute);

-- Create slack_webhooks table
CREATE TABLE IF NOT EXISTS slack_webhooks (
  tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Verify tables were created
SELECT 
  table_name, 
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
