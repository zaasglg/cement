import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormModal } from "@/components/LeadFormModal";
import { useI18n } from "@/lib/i18n";
import { getProductData } from "@/lib/api/data.functions";
import type { StockStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/products/$slug")({
  head: ({ loaderData }: { loaderData?: { product?: { title: { ru: string }; description: { ru: string }; image: string } | null } }) => {
    const product = loaderData?.product;
    return {
      meta: [
        { title: product ? `${product.title.ru} | Eurasian Cement` : "Продукт | Eurasian Cement" },
        { name: "description", content: product?.description.ru ?? "Каталог продукции." },
        ...(product ? [{ property: "og:image", content: product.image }] : []),
      ],
    };
  },
  loader: async ({ params }) => getProductData({ data: { slug: params.slug } }),
  component: ProductPage,
  errorComponent: () => <NotFound />,
  notFoundComponent: () => <NotFound />,
});

function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
      <p className="text-muted-foreground">Продукт не найден.</p>
      <Link to="/products" className="mt-4 inline-block text-brand underline-offset-4 hover:underline">
        Вернуться в каталог
      </Link>
    </div>
  );
}

function StatusPill({ status }: { status: StockStatus }) {
  const { ui } = useI18n();
  const inStock = status === "in_stock";
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold " +
        (inStock ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")
      }
    >
      <span className={"h-1.5 w-1.5 rounded-full " + (inStock ? "bg-emerald-500" : "bg-amber-500")} />
      {inStock ? ui("in_stock") : ui("on_order")}
    </span>
  );
}

function ProductPage() {
  const { ui, tr } = useI18n();
  const router = useRouter();
  const { product, productCategories } = Route.useLoaderData();
  const [active, setActive] = useState(0);

  if (!product) return <NotFound />;
  const category = productCategories.find((c) => c.id === product.category);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <button
        onClick={() => router.history.back()}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {ui("back")}
      </button>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* GALLERY */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={product.gallery[active] ?? product.image}
              alt={tr(product.title)}
              width={1024}
              height={768}
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
          {product.gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={
                    "overflow-hidden rounded-lg border transition-all " +
                    (active === i ? "border-brand ring-2 ring-brand/30" : "border-border hover:border-foreground/30")
                  }
                >
                  <img
                    src={img}
                    alt={`${tr(product.title)} — фото ${i + 1}`}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {category && tr(category.label)}
            </span>
            <StatusPill status={product.status} />
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-balance">
            {tr(product.title)}
          </h1>

          <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Цена</p>
            <p className="mt-1 text-2xl font-bold text-brand">{tr(product.price)}</p>
          </div>

          <p className="mt-6 text-muted-foreground">{tr(product.description)}</p>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Область применения
          </h2>
          <p className="mt-2 text-sm">{tr(product.application)}</p>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {ui("specs")}
          </h2>
          <dl className="mt-3 divide-y divide-border rounded-xl border border-border">
            {product.specs.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{tr(s.label)}</dt>
                <dd className="font-medium">{tr(s.value)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <LeadFormModal
              type="sales"
              refSlug={product.slug}
              title={ui("request_quote")}
              nameLabel={ui("form_name")}
              messageLabel={ui("form_message")}
              trigger={
                <Button variant="brand" size="lg">
                  {ui("request_price")}
                </Button>
              }
            />
            <Button variant="outline" size="lg" asChild>
              <a href="tel:+77000000000">
                <Phone className="h-4 w-4" /> +7 (700) 000-00-00
              </a>
            </Button>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            Прямые поставки от производителя без посредников. Гибкие условия для крупных застройщиков
            и оптовых баз.
          </div>
        </div>
      </div>
    </section>
  );
}
