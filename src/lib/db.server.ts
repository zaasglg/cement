import Database from "better-sqlite3";
import { join } from "path";
import { mkdirSync, existsSync, readFileSync, renameSync } from "fs";
import {
  products as seedProducts,
  procurements as seedProcurements,
  jobs as seedJobs,
  siteContent as seedSiteContent,
  type Product,
  type Procurement,
  type Job,
  type Lead,
  type SiteContent,
} from "./mock-data";

const DB_DIR = join(process.cwd(), "data");
const DB_PATH = join(DB_DIR, "db.sqlite");
const LEGACY_JSON_PATH = join(DB_DIR, "db.json");

if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    slug TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS procurements (
    slug TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS jobs (
    slug TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    data TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    expires_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

function isEmptyDB(): boolean {
  const row = db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number };
  return row.c === 0;
}

if (isEmptyDB()) {
  if (existsSync(LEGACY_JSON_PATH)) {
    const legacy = JSON.parse(readFileSync(LEGACY_JSON_PATH, "utf-8")) as {
      products: Product[];
      procurements: Procurement[];
      jobs: Job[];
      leads: Lead[];
      sessions: Record<string, string>;
      siteContent?: SiteContent;
    };

    const migrate = db.transaction(() => {
      const insProduct = db.prepare("INSERT OR IGNORE INTO products (slug, data) VALUES (?, ?)");
      for (const p of legacy.products ?? []) insProduct.run(p.slug, JSON.stringify(p));

      const insProcurement = db.prepare(
        "INSERT OR IGNORE INTO procurements (slug, data) VALUES (?, ?)",
      );
      for (const p of legacy.procurements ?? []) insProcurement.run(p.slug, JSON.stringify(p));

      const insJob = db.prepare("INSERT OR IGNORE INTO jobs (slug, data) VALUES (?, ?)");
      for (const j of legacy.jobs ?? []) insJob.run(j.slug, JSON.stringify(j));

      const insLead = db.prepare(
        "INSERT OR IGNORE INTO leads (id, created_at, data) VALUES (?, ?, ?)",
      );
      for (const l of legacy.leads ?? []) insLead.run(l.id, l.createdAt, JSON.stringify(l));

      const insSession = db.prepare(
        "INSERT OR IGNORE INTO sessions (token, expires_at) VALUES (?, ?)",
      );
      for (const [token, expiresAt] of Object.entries(legacy.sessions ?? {})) {
        insSession.run(token, expiresAt);
      }

      const content = legacy.siteContent ?? seedSiteContent;
      db.prepare("INSERT OR IGNORE INTO kv (key, value) VALUES (?, ?)").run(
        "siteContent",
        JSON.stringify(content),
      );
    });

    migrate();
    renameSync(LEGACY_JSON_PATH, LEGACY_JSON_PATH + ".migrated");
  } else {
    const seed = db.transaction(() => {
      const insProduct = db.prepare("INSERT INTO products (slug, data) VALUES (?, ?)");
      for (const p of seedProducts) insProduct.run(p.slug, JSON.stringify(p));

      const insProcurement = db.prepare("INSERT INTO procurements (slug, data) VALUES (?, ?)");
      for (const p of seedProcurements) insProcurement.run(p.slug, JSON.stringify(p));

      const insJob = db.prepare("INSERT INTO jobs (slug, data) VALUES (?, ?)");
      for (const j of seedJobs) insJob.run(j.slug, JSON.stringify(j));

      db.prepare("INSERT INTO kv (key, value) VALUES (?, ?)").run(
        "siteContent",
        JSON.stringify(seedSiteContent),
      );
    });
    seed();
  }
}

// ── Products ──────────────────────────────────────────────────────────
export function dbGetProducts(): Product[] {
  const rows = db.prepare("SELECT data FROM products").all() as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as Product);
}

export function dbGetProduct(slug: string): Product | undefined {
  const row = db.prepare("SELECT data FROM products WHERE slug = ?").get(slug) as
    | { data: string }
    | undefined;
  return row ? (JSON.parse(row.data) as Product) : undefined;
}

export function dbCreateProduct(product: Product): void {
  db.prepare("INSERT INTO products (slug, data) VALUES (?, ?)").run(
    product.slug,
    JSON.stringify(product),
  );
}

export function dbUpdateProduct(slug: string, updates: Product): boolean {
  const result = db
    .prepare("UPDATE products SET slug = ?, data = ? WHERE slug = ?")
    .run(updates.slug, JSON.stringify(updates), slug);
  return result.changes > 0;
}

export function dbDeleteProduct(slug: string): boolean {
  const result = db.prepare("DELETE FROM products WHERE slug = ?").run(slug);
  return result.changes > 0;
}

// ── Procurements ──────────────────────────────────────────────────────
export function dbGetProcurements(): Procurement[] {
  const rows = db.prepare("SELECT data FROM procurements").all() as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as Procurement);
}

export function dbGetProcurement(slug: string): Procurement | undefined {
  const row = db.prepare("SELECT data FROM procurements WHERE slug = ?").get(slug) as
    | { data: string }
    | undefined;
  return row ? (JSON.parse(row.data) as Procurement) : undefined;
}

export function dbCreateProcurement(item: Procurement): void {
  db.prepare("INSERT INTO procurements (slug, data) VALUES (?, ?)").run(
    item.slug,
    JSON.stringify(item),
  );
}

export function dbUpdateProcurement(slug: string, updates: Procurement): boolean {
  const result = db
    .prepare("UPDATE procurements SET slug = ?, data = ? WHERE slug = ?")
    .run(updates.slug, JSON.stringify(updates), slug);
  return result.changes > 0;
}

export function dbDeleteProcurement(slug: string): boolean {
  const result = db.prepare("DELETE FROM procurements WHERE slug = ?").run(slug);
  return result.changes > 0;
}

// ── Jobs ──────────────────────────────────────────────────────────────
export function dbGetJobs(): Job[] {
  const rows = db.prepare("SELECT data FROM jobs").all() as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as Job);
}

export function dbGetJob(slug: string): Job | undefined {
  const row = db.prepare("SELECT data FROM jobs WHERE slug = ?").get(slug) as
    | { data: string }
    | undefined;
  return row ? (JSON.parse(row.data) as Job) : undefined;
}

export function dbCreateJob(job: Job): void {
  db.prepare("INSERT INTO jobs (slug, data) VALUES (?, ?)").run(job.slug, JSON.stringify(job));
}

export function dbUpdateJob(slug: string, updates: Job): boolean {
  const result = db
    .prepare("UPDATE jobs SET slug = ?, data = ? WHERE slug = ?")
    .run(updates.slug, JSON.stringify(updates), slug);
  return result.changes > 0;
}

export function dbDeleteJob(slug: string): boolean {
  const result = db.prepare("DELETE FROM jobs WHERE slug = ?").run(slug);
  return result.changes > 0;
}

// ── Leads ─────────────────────────────────────────────────────────────
export function dbGetLeads(): Lead[] {
  const rows = db.prepare("SELECT data FROM leads ORDER BY created_at DESC").all() as {
    data: string;
  }[];
  return rows.map((r) => JSON.parse(r.data) as Lead);
}

export function dbAddLead(lead: Omit<Lead, "id" | "createdAt">): Lead {
  const entry: Lead = {
    ...lead,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
  };
  db.prepare("INSERT INTO leads (id, created_at, data) VALUES (?, ?, ?)").run(
    entry.id,
    entry.createdAt,
    JSON.stringify(entry),
  );
  return entry;
}

export function dbDeleteLead(id: string): boolean {
  const result = db.prepare("DELETE FROM leads WHERE id = ?").run(id);
  return result.changes > 0;
}

// ── Site content ──────────────────────────────────────────────────────
export function dbGetSiteContent(): SiteContent {
  const row = db.prepare("SELECT value FROM kv WHERE key = ?").get("siteContent") as
    | { value: string }
    | undefined;
  return row ? (JSON.parse(row.value) as SiteContent) : seedSiteContent;
}

export function dbUpdateSiteContent(siteContent: SiteContent): void {
  db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(
    "siteContent",
    JSON.stringify(siteContent),
  );
}

// ── Sessions ──────────────────────────────────────────────────────────
export function dbCreateSession(token: string): void {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare("INSERT OR REPLACE INTO sessions (token, expires_at) VALUES (?, ?)").run(
    token,
    expiresAt,
  );
}

export function dbValidateSession(token: string): boolean {
  if (!token) return false;
  const row = db.prepare("SELECT expires_at FROM sessions WHERE token = ?").get(token) as
    | { expires_at: string }
    | undefined;
  if (!row) return false;
  return new Date(row.expires_at) > new Date();
}

export function dbDeleteSession(token: string): void {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}
