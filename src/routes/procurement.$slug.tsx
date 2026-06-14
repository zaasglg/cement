import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, CalendarClock, Wallet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormModal } from "@/components/LeadFormModal";
import { useI18n } from "@/lib/i18n";
import { getProcurementData } from "@/lib/api/data.functions";

export const Route = createFileRoute("/procurement/$slug")({
  head: ({ loaderData }: { loaderData?: { procurement?: { title: { ru: string }; description: { ru: string } } | null } }) => {
    const item = loaderData?.procurement;
    return {
      meta: [
        { title: item ? `${item.title.ru} | Eurasian Cement` : "Закупка | Eurasian Cement" },
        { name: "description", content: item?.description.ru ?? "Тендерный сектор." },
      ],
    };
  },
  loader: async ({ params }) => getProcurementData({ data: { slug: params.slug } }),
  component: ProcurementDetail,
  errorComponent: () => <NotFound />,
  notFoundComponent: () => <NotFound />,
});

function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
      <p className="text-muted-foreground">Потребность не найдена.</p>
      <Link to="/procurement" className="mt-4 inline-block text-brand underline-offset-4 hover:underline">
        Вернуться к закупкам
      </Link>
    </div>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
}

function ProcurementDetail() {
  const { ui, tr } = useI18n();
  const router = useRouter();
  const { procurement: item, procurementCategories } = Route.useLoaderData();

  if (!item) return <NotFound />;
  const category = procurementCategories.find((c) => c.id === item.category);

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
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-balance">{tr(item.title)}</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-border p-4">
          <CalendarClock className="h-5 w-5 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">{ui("deadline")}</p>
            <p className="font-semibold">{fmtDate(item.deadline)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border p-4">
          <Wallet className="h-5 w-5 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">{ui("budget")}</p>
            <p className="font-semibold">{tr(item.budget)}</p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-muted-foreground">{tr(item.description)}</p>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {ui("requirements")}
      </h2>
      <ul className="mt-3 space-y-2">
        {item.requirements.map((r, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>{tr(r)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <LeadFormModal
          type="procurement"
          refSlug={item.slug}
          title={ui("respond_task")}
          nameLabel={ui("form_name")}
          messageLabel={ui("form_message")}
          trigger={
            <Button variant="brand" size="lg">
              {ui("respond_task")}
            </Button>
          }
        />
      </div>
    </section>
  );
}
