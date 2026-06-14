import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, ArrowRight } from "lucide-react";
import { PageHeader, FilterChip } from "@/components/PageHeader";
import { useI18n } from "@/lib/i18n";
import { getProcurementsData } from "@/lib/api/data.functions";

export const Route = createFileRoute("/procurement/")({
  head: () => ({
    meta: [
      { title: "Закупки — тендеры и потребности | Eurasian Cement" },
      {
        name: "description",
        content:
          "Открытый тендерный сектор ТОО Eurasian Cement. Приглашаем поставщиков сырья, упаковки, логистических и ремонтных услуг.",
      },
    ],
  }),
  loader: async () => getProcurementsData(),
  component: ProcurementPage,
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
}

function ProcurementPage() {
  const { ui, tr } = useI18n();
  const { procurements, procurementCategories } = Route.useLoaderData();
  const [cat, setCat] = useState("all");

  const filtered = useMemo(
    () => procurements.filter((p) => cat === "all" || p.category === cat),
    [procurements, cat],
  );

  return (
    <>
      <PageHeader
        eyebrow={ui("nav_procurement")}
        title="Нам требуется"
        subtitle="Открытый тендерный сектор. Приглашаем к сотрудничеству поставщиков и подрядчиков."
      >
        <div className="flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
            {ui("all")}
          </FilterChip>
          {procurementCategories.map((c) => (
            <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {tr(c.label)}
            </FilterChip>
          ))}
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((p) => {
            const category = procurementCategories.find((c) => c.id === p.category);
            return (
              <Link
                key={p.slug}
                to="/procurement/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {category && tr(category.label)}
                  </span>
                </div>
                <h3 className="mt-3 flex-1 text-lg font-bold leading-snug">{tr(p.title)}</h3>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <CalendarClock className="h-4 w-4 text-brand" />
                    {ui("deadline")}: {fmtDate(p.deadline)}
                  </span>
                  <span className="font-semibold text-foreground">
                    {ui("budget")}: {tr(p.budget)}
                  </span>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                  {ui("details")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
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
