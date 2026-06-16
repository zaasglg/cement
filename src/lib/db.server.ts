import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
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
const DB_PATH = join(DB_DIR, "db.json");

type DB = {
  products: Product[];
  procurements: Procurement[];
  jobs: Job[];
  leads: Lead[];
  sessions: Record<string, string>; // token -> expiresAt ISO
  siteContent: SiteContent;
};

function readDB(): DB {
  if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });
  if (!existsSync(DB_PATH)) {
    const initial: DB = {
      products: seedProducts,
      procurements: seedProcurements,
      jobs: seedJobs,
      leads: [],
      sessions: {},
      siteContent: seedSiteContent,
    };
    writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  const db = JSON.parse(readFileSync(DB_PATH, "utf-8")) as Partial<DB>;
  let changed = false;

  if (!db.leads) {
    db.leads = [];
    changed = true;
  }
  if (!db.sessions) {
    db.sessions = {};
    changed = true;
  }
  if (!db.siteContent) {
    db.siteContent = seedSiteContent;
    changed = true;
  }

  if (changed) writeDB(db as DB);
  return db as DB;
}

function writeDB(db: DB): void {
  if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// ── Products ──────────────────────────────────────────────────────────
export function dbGetProducts(): Product[] {
  return readDB().products;
}
export function dbGetProduct(slug: string): Product | undefined {
  return readDB().products.find((p) => p.slug === slug);
}
export function dbCreateProduct(product: Product): void {
  const db = readDB();
  db.products.push(product);
  writeDB(db);
}
export function dbUpdateProduct(slug: string, updates: Product): boolean {
  const db = readDB();
  const idx = db.products.findIndex((p) => p.slug === slug);
  if (idx === -1) return false;
  db.products = db.products.map((p, i) => (i === idx ? { ...p, ...updates } : p));
  writeDB(db);
  return true;
}
export function dbDeleteProduct(slug: string): boolean {
  const db = readDB();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.slug !== slug);
  if (db.products.length === before) return false;
  writeDB(db);
  return true;
}

// ── Procurements ──────────────────────────────────────────────────────
export function dbGetProcurements(): Procurement[] {
  return readDB().procurements;
}
export function dbGetProcurement(slug: string): Procurement | undefined {
  return readDB().procurements.find((p) => p.slug === slug);
}
export function dbCreateProcurement(item: Procurement): void {
  const db = readDB();
  db.procurements.push(item);
  writeDB(db);
}
export function dbUpdateProcurement(slug: string, updates: Procurement): boolean {
  const db = readDB();
  const idx = db.procurements.findIndex((p) => p.slug === slug);
  if (idx === -1) return false;
  db.procurements = db.procurements.map((p, i) => (i === idx ? { ...p, ...updates } : p));
  writeDB(db);
  return true;
}
export function dbDeleteProcurement(slug: string): boolean {
  const db = readDB();
  const before = db.procurements.length;
  db.procurements = db.procurements.filter((p) => p.slug !== slug);
  if (db.procurements.length === before) return false;
  writeDB(db);
  return true;
}

// ── Jobs ──────────────────────────────────────────────────────────────
export function dbGetJobs(): Job[] {
  return readDB().jobs;
}
export function dbGetJob(slug: string): Job | undefined {
  return readDB().jobs.find((j) => j.slug === slug);
}
export function dbCreateJob(job: Job): void {
  const db = readDB();
  db.jobs.push(job);
  writeDB(db);
}
export function dbUpdateJob(slug: string, updates: Job): boolean {
  const db = readDB();
  const idx = db.jobs.findIndex((j) => j.slug === slug);
  if (idx === -1) return false;
  db.jobs = db.jobs.map((j, i) => (i === idx ? { ...j, ...updates } : j));
  writeDB(db);
  return true;
}
export function dbDeleteJob(slug: string): boolean {
  const db = readDB();
  const before = db.jobs.length;
  db.jobs = db.jobs.filter((j) => j.slug !== slug);
  if (db.jobs.length === before) return false;
  writeDB(db);
  return true;
}

// ── Leads ─────────────────────────────────────────────────────────────
export function dbGetLeads(): Lead[] {
  return [...readDB().leads].reverse();
}
export function dbAddLead(lead: Omit<Lead, "id" | "createdAt">): Lead {
  const db = readDB();
  const entry: Lead = {
    ...lead,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
  };
  db.leads.push(entry);
  writeDB(db);
  return entry;
}
export function dbDeleteLead(id: string): boolean {
  const db = readDB();
  const before = db.leads.length;
  db.leads = db.leads.filter((l) => l.id !== id);
  if (db.leads.length === before) return false;
  writeDB(db);
  return true;
}

// ── Site content ─────────────────────────────────────────────────────
export function dbGetSiteContent(): SiteContent {
  return readDB().siteContent;
}
export function dbUpdateSiteContent(siteContent: SiteContent): void {
  const db = readDB();
  db.siteContent = siteContent;
  writeDB(db);
}

// ── Sessions ──────────────────────────────────────────────────────────
export function dbCreateSession(token: string): void {
  const db = readDB();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.sessions = { ...db.sessions, [token]: expiresAt };
  writeDB(db);
}
export function dbValidateSession(token: string): boolean {
  if (!token) return false;
  const db = readDB();
  const expiresAt = db.sessions[token];
  if (!expiresAt) return false;
  return new Date(expiresAt) > new Date();
}
export function dbDeleteSession(token: string): void {
  const db = readDB();
  const { [token]: _, ...rest } = db.sessions;
  db.sessions = rest;
  writeDB(db);
}
