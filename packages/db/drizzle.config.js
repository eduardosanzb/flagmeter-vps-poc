// JavaScript version for production containers (no TypeScript runtime needed)
export default {
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://flagmeter:flagmeter@localhost:5432/flagmeter',
  },
  verbose: true,
  strict: true,
};
