import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminGetProcurements,
  adminUpdateProcurement,
} from "@/lib/api/admin.functions";
import { procurementCategories } from "@/lib/mock-data";
import type { Procurement } from "@/lib/mock-data";
import type { Localized } from "@/lib/i18n";
import { FormSection } from "@/components/admin/FormSection";
import { LocalizedField } from "@/components/admin/LocalizedField";

export const Route = createFileRoute("/admin/procurements/$slug")({
  loader: async ({ params }) => {
    const items = await adminGetProcurements();
    const procurement = items.find((p) => p.slug === params.slug);
    if (!procurement) throw new Error("Закупка не найдена");
    return { procurement, originalSlug: params.slug };
  },
  component: EditProcurement,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => ({ а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" }[c] ?? c))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function EditProcurement() {
  const { procurement, originalSlug } = Route.useLoaderData();
  const navigate = useNavigate();
  const [form, setForm] = useState<Procurement>(procurement);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateProcurement({ data: { slug: originalSlug, procurement: form } });
      navigate({ to: "/admin/procurements" });
    } finally {
      setSaving(false);
    }
  };

  const setRequirement = (i: number, lang: "ru" | "kk" | "en", val: string) =>
    setForm((f) => ({
      ...f,
      requirements: f.requirements.map((r, idx) =>
        idx === i ? { ...r, [lang]: val } : r,
      ),
    }));

  const addRequirement = () =>
    setForm((f) => ({ ...f, requirements: [...f.requirements, { ru: "" }] }));

  const removeRequirement = (i: number) =>
    setForm((f) => ({ ...f, requirements: f.requirements.filter((_, idx) => idx !== i) }));

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/admin/procurements"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Закупки
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{procurement.title.ru}</span>
        </div>
        <Button form="proc-form" type="submit" disabled={saving} size="sm">
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      <form
        id="proc-form"
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-2xl space-y-5 px-6 py-8"
      >
        <FormSection title="Идентификатор">
          <div className="space-y-1.5">
            <Label>Slug (URL)</Label>
            <Input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              onBlur={() => setForm((f) => ({ ...f, slug: slugify(f.slug) }))}
            />
          </div>
        </FormSection>

        <FormSection title="Основная информация">
          <div className="space-y-1.5">
            <Label>Название</Label>
            <LocalizedField
              value={form.title}
              onChange={(v) => setForm((f) => ({ ...f, title: v }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Категория</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {procurementCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label.ru}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Срок подачи</Label>
              <Input
                type="date"
                required
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Бюджет</Label>
            <LocalizedField
              value={form.budget}
              onChange={(v) => setForm((f) => ({ ...f, budget: v }))}
              required
            />
          </div>
        </FormSection>

        <FormSection title="Описание">
          <LocalizedField
            value={form.description}
            onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            required
            multiline
          />
        </FormSection>

        <FormSection title="Требования">
          <div className="space-y-3">
            {form.requirements.map((req, i) => (
              <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Требование {i + 1}</span>
                  {form.requirements.length > 1 && (
                    <button type="button" onClick={() => removeRequirement(i)}>
                      <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  )}
                </div>
                {(["ru", "kk", "en"] as const).map((lang) => (
                  <div key={lang} className="flex items-center gap-3">
                    <span className="w-7 shrink-0 text-xs font-semibold text-muted-foreground">{lang.toUpperCase()}</span>
                    <Input
                      required={lang === "ru"}
                      value={(req as Localized)[lang] ?? ""}
                      onChange={(e) => setRequirement(i, lang, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addRequirement} className="w-full">
              <Plus className="h-3 w-3" /> Добавить требование
            </Button>
          </div>
        </FormSection>
      </form>
    </div>
  );
}
