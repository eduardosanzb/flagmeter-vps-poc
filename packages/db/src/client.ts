import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema.js';

let _connection: ReturnType<typeof postgres> | null = null;
let _db: PostgresJsDatabase<typeof schema> | null = null;
let _sql: ReturnType<typeof postgres> | null = null;

export function getConnection() {
  console.log('Getting database connection...');
  console.log(process.env.DATABASE_URL);
  if (!_connection) {
    const DATABASE_URL = process.env.DATABASE_URL;

    if (!DATABASE_URL) {
      throw new Error(`DATABASE_URL environment variable is not set. Available env vars: ${Object.keys(process.env).filter(k => k.includes('DATA') || k.includes('VAL')).join(', ')}`);
    }

    _connection = postgres(DATABASE_URL, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  return _connection;
}

export function getDb() {
  if (!_db) {
    _db = drizzle(getConnection(), { schema });
  }

  return _db;
}

export function getSql() {
  if (!_sql) {
    _sql = getConnection();
  }

  return _sql;
}

// For backwards compatibility
export const connection = getConnection;
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(target, prop) {
    return getDb()[prop as keyof PostgresJsDatabase<typeof schema>];
  },
});

// Raw SQL client for hot paths
export const sql = new Proxy(function() {} as any, {
  get(target, prop) {
    const sqlClient = getSql();
    const value = sqlClient[prop as keyof typeof sqlClient];
    return typeof value === 'function' ? value.bind(sqlClient) : value;
  },
  apply(target, thisArg, argArray) {
    return getSql()(...argArray);
  },
});
