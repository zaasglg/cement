import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, ArrowRight, Banknote } from "lucide-react";
import { PageHeader, FilterChip } from "@/components/PageHeader";
import { useI18n } from "@/lib/i18n";
import { getJobsData } from "@/lib/api/data.functions";

export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: "Карьера — вакансии | Eurasian Cement" },
      {
        name: "description",
        content:
          "Растите вместе с лидером отрасли. Открытые вакансии на производстве, в логистике и коммерческом департаменте ТОО Eurasian Cement.",
      },
    ],
  }),
  loader: async () => getJobsData(),
  component: CareersPage,
});

function CareersPage() {
  const { ui, tr } = useI18n();
  const { jobs, jobCategories } = Route.useLoaderData();
  const [cat, setCat] = useState("all");

  const filtered = useMemo(
    () => jobs.filter((j) => cat === "all" || j.category === cat),
    [jobs, cat],
  );

  return (
    <>
      <PageHeader
        eyebrow={ui("nav_careers")}
        title="Открытые вакансии"
        subtitle="Растите вместе с лидером отрасли. Ищем специалистов на производство, в логистику и коммерцию."
      >
        <div className="flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
            {ui("all")}
          </FilterChip>
          {jobCategories.map((c) => (
            <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {tr(c.label)}
            </FilterChip>
          ))}
        </div>
      </PageHeader>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {filtered.map((j) => {
            const category = jobCategories.find((c) => c.id === j.category);
            return (
              <Link
                key={j.slug}
                to="/careers/$slug"
                params={{ slug: j.slug }}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-brand/50 hover:shadow-xl sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {category && tr(category.label)}
                  </span>
                  <h3 className="mt-3 text-lg font-bold">{tr(j.title)}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Banknote className="h-4 w-4 text-brand" />
                      {tr(j.salary)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-brand" />
                      {tr(j.location)}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
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
