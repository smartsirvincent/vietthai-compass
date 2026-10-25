import "server-only";
import { createHash, randomUUID } from "crypto";
import type { PoolClient } from "pg";
import { getPool } from "./cms-store";
import { EngagementError, type ResourceRef } from "./engagement-policy";

// A separate, non-API schema keeps counters and moderation away from CMS JSON edits.
const schema = `
  create schema if not exists vt_engagement;
  revoke all on schema vt_engagement from public;
  create table if not exists vt_engagement.settings (
    id boolean primary key default true check(id), enabled boolean not null default false
  );
  insert into vt_engagement.settings(id) values(true) on conflict do nothing;
  create table if not exists vt_engagement.pages (
    kind text not null check(kind in ('article','business')), slug text not null,
    views bigint not null default 0 check(views >= 0), comments_enabled boolean not null default true,
    primary key(kind,slug)
  );
  create table if not exists vt_engagement.view_visitors (
    kind text not null, slug text not null, visitor text not null, day date not null,
    primary key(kind,slug,visitor,day)
  );
  create index if not exists vt_view_expiry on vt_engagement.view_visitors(day);
  create table if not exists vt_engagement.limits (
    key text primary key, hits integer not null, expires_at timestamptz not null
  );
  create index if not exists vt_limit_expiry on vt_engagement.limits(expires_at);
  create table if not exists vt_engagement.comments (
    id uuid primary key, kind text not null check(kind in ('article','business')), slug text not null,
    name text not null check(char_length(name) between 1 and 40),
    body text not null check(char_length(body) between 10 and 2000),
    fingerprint text not null, status text not null default 'pending' check(status in ('pending','approved','hidden','spam')),
    created_at timestamptz not null default now(), moderated_at timestamptz, moderated_by text
  );
  create index if not exists vt_comment_public on vt_engagement.comments(kind,slug,created_at desc,id) where status='approved';
  create index if not exists vt_comment_queue on vt_engagement.comments(status,created_at desc);
  create index if not exists vt_comment_duplicates on vt_engagement.comments(kind,slug,fingerprint,created_at);
  alter table vt_engagement.settings enable row level security;
  alter table vt_engagement.pages enable row level security;
  alter table vt_engagement.view_visitors enable row level security;
  alter table vt_engagement.limits enable row level security;
  alter table vt_engagement.comments enable row level security;
`;

let ready: Promise<void> | undefined;
export async function engagementDatabase() {
  const pool = getPool();
  if (!pool) throw new EngagementError("互動功能尚未連接雲端資料庫。", 503);
  ready ??= (async () => {
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query("select pg_advisory_xact_lock(73419021)");
      const existing = await client.query("select to_regclass('vt_engagement.comments') as relation");
      if (!existing.rows[0].relation) await client.query(schema);
      await client.query("delete from vt_engagement.view_visitors where day < (now() at time zone 'UTC')::date - 2");
      await client.query("delete from vt_engagement.limits where expires_at < now()");
      await client.query("commit");
    } catch (error) {
      await client.query("rollback"); throw error;
    } finally { client.release(); }
  })().catch(error => { ready = undefined; throw error; });
  await ready;
  return pool;
}

export function turnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY && process.env.AUTH_SECRET);
}

export async function articleViewCounts(): Promise<Map<string, number>> {
  const pool = getPool();
  if (!pool) return new Map();
  try {
    const result = await pool.query<{ slug: string; views: string }>(
      "select slug, views::text from vt_engagement.pages where kind = $1 and views > 0",
      ["article"]
    );
    return new Map(result.rows.map(row => [row.slug, Number(row.views)]));
  } catch (error) {
    console.error("Article view counts unavailable", error instanceof Error ? error.name : "Unknown error");
    return new Map();
  }
}

export async function publicEngagement(ref: ResourceRef, offset = 0) {
  const pool = await engagementDatabase();
  const state = await pool.query(`select s.enabled, coalesce(p.views,0)::text as views,
    coalesce(p.comments_enabled,true) as page_enabled from vt_engagement.settings s
    left join vt_engagement.pages p on p.kind=$1 and p.slug=$2 where s.id=true`, [ref.kind, ref.slug]);
  const row = state.rows[0];
  const comments = await pool.query(`select id,name,body,created_at from vt_engagement.comments
    where kind=$1 and slug=$2 and status='approved' order by created_at desc,id limit 21 offset $3`, [ref.kind, ref.slug, offset]);
  return { views: Number(row.views), enabled: row.enabled && row.page_enabled && turnstileConfigured(),
    siteKey: row.enabled && row.page_enabled && turnstileConfigured() ? process.env.TURNSTILE_SITE_KEY : undefined,
    comments: comments.rows.slice(0, 20), hasMore: comments.rows.length > 20 };
}

// UPSERT is atomic across instances; no process-local rate limiter.
export async function takeLimit(key: string, max: number, seconds: number) {
  const pool = await engagementDatabase();
  const result = await pool.query(`insert into vt_engagement.limits(key,hits,expires_at)
    values($1,1,now()+($3 * interval '1 second')) on conflict(key) do update set
    hits=case when vt_engagement.limits.expires_at<=now() then 1 else vt_engagement.limits.hits+1 end,
    expires_at=case when vt_engagement.limits.expires_at<=now() then excluded.expires_at else vt_engagement.limits.expires_at end
    where vt_engagement.limits.expires_at<=now() or vt_engagement.limits.hits<$2 returning key`, [key,max,seconds]);
  if (!result.rowCount) throw new EngagementError("操作太頻繁，請稍後再試。", 429);
}

export async function recordView(ref: ResourceRef, visitor: string) {
  const pool = await engagementDatabase();
  await pool.query(`with visitor as (
    insert into vt_engagement.view_visitors(kind,slug,visitor,day) values($1,$2,$3,(now() at time zone 'UTC')::date)
    on conflict do nothing returning 1
  ) insert into vt_engagement.pages(kind,slug,views) select $1,$2,1 from visitor
    on conflict(kind,slug) do update set views=vt_engagement.pages.views+1`, [ref.kind,ref.slug,visitor]);
}

async function lockOpen(client: PoolClient, ref: ResourceRef) {
  const global = await client.query("select enabled from vt_engagement.settings where id=true for share");
  await client.query("insert into vt_engagement.pages(kind,slug) values($1,$2) on conflict do nothing", [ref.kind,ref.slug]);
  const page = await client.query("select comments_enabled from vt_engagement.pages where kind=$1 and slug=$2 for share", [ref.kind,ref.slug]);
  if (!global.rows[0].enabled || !page.rows[0].comments_enabled || !turnstileConfigured()) {
    throw new EngagementError("目前暫停接受新留言。", 403);
  }
}

export async function submitComment(ref: ResourceRef, name: string, body: string) {
  const pool = await engagementDatabase();
  const client = await pool.connect();
  const fingerprint = createHash("sha256").update(body.replace(/\s/g, "").toLowerCase()).digest("hex");
  try {
    await client.query("begin");
    await lockOpen(client, ref);
    await client.query("select pg_advisory_xact_lock(hashtextextended($1,0))", [`${ref.kind}:${ref.slug}:${fingerprint}`]);
    const duplicate = await client.query(`select 1 from vt_engagement.comments where kind=$1 and slug=$2
      and fingerprint=$3 and created_at>now()-interval '1 day' limit 1`, [ref.kind,ref.slug,fingerprint]);
    if (duplicate.rowCount) throw new EngagementError("相同留言已收到，請勿重複送出。", 409);
    await client.query(`insert into vt_engagement.comments(id,kind,slug,name,body,fingerprint)
      values($1,$2,$3,$4,$5,$6)`, [randomUUID(),ref.kind,ref.slug,name,body,fingerprint]);
    await client.query("commit");
  } catch(error) { await client.query("rollback"); throw error; }
  finally { client.release(); }
}

export async function cleanupEngagement() {
  const pool = await engagementDatabase();
  await pool.query("delete from vt_engagement.view_visitors where day < (now() at time zone 'UTC')::date - 2");
  await pool.query("delete from vt_engagement.limits where expires_at < now()");
}
