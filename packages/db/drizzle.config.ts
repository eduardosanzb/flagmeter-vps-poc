import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://flagmeter:flagmeter@localhost:5432/flagmeter',
  },
  verbose: true,
  strict: true,
});
