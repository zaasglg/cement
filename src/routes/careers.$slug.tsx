import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Banknote, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormModal } from "@/components/LeadFormModal";
import { useI18n, type Localized } from "@/lib/i18n";
import { getJobData } from "@/lib/api/data.functions";

export const Route = createFileRoute("/careers/$slug")({
  head: ({ loaderData }: { loaderData?: { job?: { title: { ru: string }; location: { ru: string } } | null } }) => {
    const job = loaderData?.job;
    return {
      meta: [
        { title: job ? `${job.title.ru} | Карьера Eurasian Cement` : "Вакансия | Eurasian Cement" },
        { name: "description", content: job ? `${job.title.ru}. ${job.location.ru}.` : "Вакансии." },
      ],
    };
  },
  loader: async ({ params }) => getJobData({ data: { slug: params.slug } }),
  component: JobDetail,
  errorComponent: () => <NotFound />,
  notFoundComponent: () => <NotFound />,
});

function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
      <p className="text-muted-foreground">Вакансия не найдена.</p>
      <Link to="/careers" className="mt-4 inline-block text-brand underline-offset-4 hover:underline">
        Вернуться к вакансиям
      </Link>
    </div>
  );
}

function JobDetail() {
  const { ui, tr } = useI18n();
  const router = useRouter();
  const { job, jobCategories } = Route.useLoaderData();

  if (!job) return <NotFound />;
  const category = jobCategories.find((c) => c.id === job.category);

  const Section = ({ title, items }: { title: string; items: Localized[] }) => (
    <div className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>{tr(it)}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <button
        onClick={() => router.history.back()}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {ui("back")}
      </button>

      <span className="mt-8 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
        {category && tr(category.label)}
      </span>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-balance">{tr(job.title)}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
          <Banknote className="h-4 w-4" /> {tr(job.salary)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4" /> {tr(job.location)}
        </span>
      </div>

      <Section title={ui("responsibilities")} items={job.responsibilities} />
      <Section title={ui("requirements")} items={job.requirements} />
      <Section title={ui("conditions")} items={job.conditions} />

      <div className="mt-10">
        <LeadFormModal
          type="career"
          refSlug={job.slug}
          title={ui("respond_vacancy")}
          nameLabel={ui("form_name_short")}
          messageLabel={ui("form_experience")}
          trigger={
            <Button variant="brand" size="lg">
              {ui("respond_vacancy")}
            </Button>
          }
        />
      </div>
    </section>
  );
}
