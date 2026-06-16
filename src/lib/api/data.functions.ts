import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  dbGetProducts,
  dbGetProduct,
  dbGetProcurements,
  dbGetProcurement,
  dbGetJobs,
  dbGetJob,
  dbAddLead,
  dbGetSiteContent,
} from "../db.server";
import { productCategories, procurementCategories, jobCategories, type Lead } from "../mock-data";

export const getProductsData = createServerFn({ method: "GET" }).handler(async () => ({
  products: dbGetProducts(),
  productCategories,
}));

export const getProductData = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => ({
    product: dbGetProduct(data.slug) ?? null,
    productCategories,
  }));

export const getProcurementsData = createServerFn({ method: "GET" }).handler(async () => ({
  procurements: dbGetProcurements(),
  procurementCategories,
}));

export const getProcurementData = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => ({
    procurement: dbGetProcurement(data.slug) ?? null,
    procurementCategories,
  }));

export const getJobsData = createServerFn({ method: "GET" }).handler(async () => ({
  jobs: dbGetJobs(),
  jobCategories,
}));

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  return dbGetSiteContent();
});

export const getJobData = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => ({
    job: dbGetJob(data.slug) ?? null,
    jobCategories,
  }));

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      type: z.enum(["sales", "procurement", "career"]),
      ref: z.string().optional(),
      name: z.string().min(1),
      phone: z.string().min(1),
      message: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const lead = dbAddLead(data as Omit<Lead, "id" | "createdAt">);
    return { ok: true, id: lead.id };
  });
