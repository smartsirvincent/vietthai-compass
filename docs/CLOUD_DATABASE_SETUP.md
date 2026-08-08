# Cloud Database Setup

The admin CMS is designed to persist content in PostgreSQL for production.

## Recommended Providers

- Supabase Postgres
- Neon Postgres
- Vercel Marketplace Postgres-compatible database

## Environment Variable

Set one of these variables in Vercel Project Settings:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

or:

```text
POSTGRES_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

## Table

The app creates this table automatically on first database read/write:

```sql
create table if not exists cms_documents (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
```

The first row uses:

```text
key = default
```

The `value` column stores articles, cities, and businesses as JSON.

## Production Behavior

- If `DATABASE_URL` or `POSTGRES_URL` exists, admin edits are saved to PostgreSQL.
- If no database URL exists on Vercel, public pages can still render seed content, but admin writes are blocked.
- Local development without a database still uses `data/cms-content.json`.

## Vercel Steps

1. Create a PostgreSQL database in Supabase or Neon.
2. Copy the pooled connection string.
3. Open Vercel project settings for `vietthai-compass`.
4. Add `DATABASE_URL` to Production, Preview, and Development if needed.
5. Redeploy the site.
6. Open `/admin`; the dashboard should show `雲端資料庫保存`.
