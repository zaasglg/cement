import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader, FilterChip } from "@/components/PageHeader";
import { useI18n } from "@/lib/i18n";
import { getProductsData } from "@/lib/api/data.functions";
import type { StockStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Реализация — каталог цемента | Eurasian Cement" },
      {
        name: "description",
        content:
          "Продажа цемента различных марок навалом и в тарированном виде: мешки и биг-бэги. Каталог продукции ТОО Eurasian Cement.",
      },
    ],
  }),
  loader: async () => getProductsData(),
  component: ProductsPage,
});

function StatusBadge({ status }: { status: StockStatus }) {
  const { ui } = useI18n();
  const inStock = status === "in_stock";
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold " +
        (inStock ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")
      }
    >
      <span className={"h-1.5 w-1.5 rounded-full " + (inStock ? "bg-emerald-500" : "bg-amber-500")} />
      {inStock ? ui("in_stock") : ui("on_order")}
    </span>
  );
}

function ProductsPage() {
  const { ui, tr } = useI18n();
  const { products, productCategories } = Route.useLoaderData();
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(
    () =>
      products.filter(
        (p) => (cat === "all" || p.category === cat) && (status === "all" || p.status === status),
      ),
    [products, cat, status],
  );

  return (
    <>
      <PageHeader
        eyebrow={ui("nav_products")}
        title="Каталог продукции"
        subtitle="Продажа цемента различных марок навалом и в тарированном виде — мешки и биг-бэги."
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
              {ui("all")}
            </FilterChip>
            {productCategories.map((c) => (
              <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                {tr(c.label)}
              </FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={status === "all"} onClick={() => setStatus("all")}>
              {ui("all")}
            </FilterChip>
            <FilterChip active={status === "in_stock"} onClick={() => setStatus("in_stock")}>
              {ui("in_stock")}
            </FilterChip>
            <FilterChip active={status === "on_order"} onClick={() => setStatus("on_order")}>
              {ui("on_order")}
            </FilterChip>
          </div>
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const category = productCategories.find((c) => c.id === p.category);
            return (
              <Link
                key={p.slug}
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={tr(p.title)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur">
                    {category && tr(category.label)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <StatusBadge status={p.status} />
                  <h3 className="mt-3 flex-1 font-bold leading-snug">{tr(p.title)}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand">{tr(p.price)}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">{ui("not_found")}</p>
        )}
      </section>
    </>
  );
}
