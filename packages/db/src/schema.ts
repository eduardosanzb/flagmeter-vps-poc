import { pgTable, uuid, text, integer, timestamp, boolean, primaryKey, unique, uniqueIndex } from 'drizzle-orm/pg-core';

// Tenants table
export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  monthlyQuota: integer('monthly_quota').notNull().default(1_000_000),
  billingDay: integer('billing_day').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
    uniqueIndex('tenants_name_idx').on(t.name)
  ]);

// Events table
export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  feature: text('feature').notNull(),
  tokens: integer('tokens').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Rollups table (aggregated per minute)
export const rollups = pgTable('rollups', {
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  feature: text('feature').notNull(),
  minute: timestamp('minute', { withTimezone: true }).notNull(),
  totalTokens: integer('total_tokens').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.tenantId, table.feature, table.minute] }),
}));

// Slack webhooks table
export const slackWebhooks = pgTable('slack_webhooks', {
  tenantId: uuid('tenant_id').primaryKey().references(() => tenants.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type Rollup = typeof rollups.$inferSelect;
export type NewRollup = typeof rollups.$inferInsert;

export type SlackWebhook = typeof slackWebhooks.$inferSelect;
export type NewSlackWebhook = typeof slackWebhooks.$inferInsert;
