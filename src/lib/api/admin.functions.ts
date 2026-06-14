import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  dbCreateSession,
  dbValidateSession,
  dbDeleteSession,
  dbGetProducts,
  dbCreateProduct,
  dbUpdateProduct,
  dbDeleteProduct,
  dbGetProcurements,
  dbCreateProcurement,
  dbUpdateProcurement,
  dbDeleteProcurement,
  dbGetJobs,
  dbCreateJob,
  dbUpdateJob,
  dbDeleteJob,
  dbGetLeads,
  dbDeleteLead,
} from "../db.server";
import type { Product, Procurement, Job } from "../mock-data";

const COOKIE_NAME = "admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";

// ── Auth ──────────────────────────────────────────────────────────────
export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string() }))
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) {
      return { ok: false, error: "Неверный пароль" };
    }
    const token = Date.now().toString(36) + Math.random().toString(36).slice(2);
    dbCreateSession(token);
    setCookie(COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const token = getCookie(COOKIE_NAME);
  if (token) dbDeleteSession(token);
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { ok: true };
});

export const checkAdminAuth = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(COOKIE_NAME);
  return { authenticated: !!token && dbValidateSession(token) };
});

// ── Products ──────────────────────────────────────────────────────────
const ProductSchema = z.object({
  slug: z.string().min(1),
  title: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  category: z.string(),
  status: z.enum(["in_stock", "on_order"]),
  price: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  description: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  application: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  specs: z.array(
    z.object({
      label: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
      value: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
    }),
  ),
  image: z.string(),
  gallery: z.array(z.string()),
});

export const adminGetProducts = createServerFn({ method: "GET" }).handler(async () => {
  return dbGetProducts();
});

export const adminCreateProduct = createServerFn({ method: "POST" })
  .inputValidator(ProductSchema)
  .handler(async ({ data }) => {
    dbCreateProduct(data as Product);
    return { ok: true };
  });

export const adminUpdateProduct = createServerFn({ method: "POST" })
  .inputValidator(z.object({ slug: z.string(), product: ProductSchema }))
  .handler(async ({ data }) => {
    const ok = dbUpdateProduct(data.slug, data.product as Product);
    return { ok };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const ok = dbDeleteProduct(data.slug);
    return { ok };
  });

// ── Procurements ──────────────────────────────────────────────────────
const ProcurementSchema = z.object({
  slug: z.string().min(1),
  title: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  category: z.string(),
  deadline: z.string(),
  budget: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  description: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  requirements: z.array(
    z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  ),
});

export const adminGetProcurements = createServerFn({ method: "GET" }).handler(async () => {
  return dbGetProcurements();
});

export const adminCreateProcurement = createServerFn({ method: "POST" })
  .inputValidator(ProcurementSchema)
  .handler(async ({ data }) => {
    dbCreateProcurement(data as Procurement);
    return { ok: true };
  });

export const adminUpdateProcurement = createServerFn({ method: "POST" })
  .inputValidator(z.object({ slug: z.string(), procurement: ProcurementSchema }))
  .handler(async ({ data }) => {
    const ok = dbUpdateProcurement(data.slug, data.procurement as Procurement);
    return { ok };
  });

export const adminDeleteProcurement = createServerFn({ method: "POST" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const ok = dbDeleteProcurement(data.slug);
    return { ok };
  });

// ── Jobs ──────────────────────────────────────────────────────────────
const LocalizedListSchema = z.array(
  z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
);
const JobSchema = z.object({
  slug: z.string().min(1),
  title: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  category: z.string(),
  salary: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  location: z.object({ ru: z.string(), kk: z.string().optional(), en: z.string().optional() }),
  responsibilities: LocalizedListSchema,
  requirements: LocalizedListSchema,
  conditions: LocalizedListSchema,
});

export const adminGetJobs = createServerFn({ method: "GET" }).handler(async () => {
  return dbGetJobs();
});

export const adminCreateJob = createServerFn({ method: "POST" })
  .inputValidator(JobSchema)
  .handler(async ({ data }) => {
    dbCreateJob(data as Job);
    return { ok: true };
  });

export const adminUpdateJob = createServerFn({ method: "POST" })
  .inputValidator(z.object({ slug: z.string(), job: JobSchema }))
  .handler(async ({ data }) => {
    const ok = dbUpdateJob(data.slug, data.job as Job);
    return { ok };
  });

export const adminDeleteJob = createServerFn({ method: "POST" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const ok = dbDeleteJob(data.slug);
    return { ok };
  });

// ── Leads ─────────────────────────────────────────────────────────────
export const adminGetLeads = createServerFn({ method: "GET" }).handler(async () => {
  return dbGetLeads();
});

export const adminDeleteLead = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const ok = dbDeleteLead(data.id);
    return { ok };
  });

// ── Dashboard Stats ───────────────────────────────────────────────────
export const adminGetStats = createServerFn({ method: "GET" }).handler(async () => {
  const leads = dbGetLeads();
  return {
    productsCount: dbGetProducts().length,
    procurementsCount: dbGetProcurements().length,
    jobsCount: dbGetJobs().length,
    leadsCount: leads.length,
    recentLeads: leads.slice(0, 5),
  };
});
