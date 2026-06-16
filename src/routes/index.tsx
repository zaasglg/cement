import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Truck, Handshake, Store, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/lib/api/data.functions";
import { useI18n } from "@/lib/i18n";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  loader: async () => getSiteContent(),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.home.metaTitle.ru ?? "ТОО Eurasian Cement" },
      {
        name: "description",
        content: loaderData?.home.metaDescription.ru ?? "",
      },
    ],
  }),
  component: Home,
});

function scrollToFooter() {
  document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
}

function Home() {
  const content = Route.useLoaderData();
  const { tr, ui } = useI18n();
  const benefitIcons = [ShieldCheck, Truck, Handshake];
  const hubMeta = [
    {
      icon: Store,
      emoji: "🏬",
      to: "/products",
      cta: ui("go_catalog"),
    },
    {
      icon: Handshake,
      emoji: "🤝",
      to: "/procurement",
      cta: ui("view_needs"),
    },
    {
      icon: Briefcase,
      emoji: "💼",
      to: "/careers",
      cta: ui("open_vacancies"),
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img
          src={heroImg}
          alt="Цементный завод Eurasian Cement на закате"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-40">
          <span className="inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {tr(content.home.heroBadge)}
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl text-balance">
            {tr(content.home.heroTitle)}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-primary-foreground/75 sm:text-lg">
            {tr(content.home.heroText)}
          </p>
          <div className="mt-9">
            <Button variant="brand" size="xl" onClick={scrollToFooter}>
              {ui("contact_sales")} <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {content.home.benefits.map((b, index) => {
            const Icon = benefitIcons[index] ?? ShieldCheck;
            return (
              <div
                key={index}
                className="group rounded-xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{tr(b.title)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{tr(b.text)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HUBS */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {content.home.hubs.map((h, index) => {
            const meta = hubMeta[index] ?? hubMeta[0];
            const Icon = meta.icon;
            return (
              <Link
                key={meta.to}
                to={meta.to}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:scale-[1.02] hover:border-brand/50 hover:shadow-2xl"
              >
                <div className="absolute -right-10 -top-10 text-[7rem] opacity-5 transition-opacity group-hover:opacity-10">
                  {meta.emoji}
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="mt-6">
                  <h3 className="text-xl font-extrabold tracking-tight">{tr(h.title)}</h3>
                  <p className="text-sm font-medium text-brand">{tr(h.sub)}</p>
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{tr(h.text)}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                  {meta.cta}{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
