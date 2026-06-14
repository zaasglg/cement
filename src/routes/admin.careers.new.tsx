import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminCreateJob } from "@/lib/api/admin.functions";
import { jobCategories } from "@/lib/mock-data";
import type { Job } from "@/lib/mock-data";
import type { Localized } from "@/lib/i18n";
import { FormSection } from "@/components/admin/FormSection";
import { LocalizedField } from "@/components/admin/LocalizedField";

export const Route = createFileRoute("/admin/careers/new")({
  component: NewCareer,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => ({ а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" }[c] ?? c))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EMPTY: Job = {
  slug: "",
  title: { ru: "" },
  category: "production",
  salary: { ru: "" },
  location: { ru: "" },
  responsibilities: [{ ru: "" }],
  requirements: [{ ru: "" }],
  conditions: [{ ru: "" }],
};

type ListKey = "responsibilities" | "requirements" | "conditions";
const LIST_LABELS: Record<ListKey, string> = {
  responsibilities: "Обязанности",
  requirements: "Требования",
  conditions: "Условия работы",
};

function LocalizedListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: Localized[];
  onChange: (v: Localized[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
      </div>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Пункт {i + 1}</span>
            {items.length > 1 && (
              <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            )}
          </div>
          {(["ru", "kk", "en"] as const).map((lang) => (
            <div key={lang} className="flex items-center gap-3">
              <span className="w-7 shrink-0 text-xs font-semibold text-muted-foreground">{lang.toUpperCase()}</span>
              <Input
                required={lang === "ru"}
                value={item[lang] ?? ""}
                onChange={(e) =>
                  onChange(items.map((it, idx) => (idx === i ? { ...it, [lang]: e.target.value } : it)))
                }
              />
            </div>
          ))}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, { ru: "" }])}
        className="w-full"
      >
        <Plus className="h-3 w-3" /> Добавить пункт
      </Button>
    </div>
  );
}

function NewCareer() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Job>(EMPTY);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminCreateJob({ data: form });
      navigate({ to: "/admin/careers" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/admin/careers"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Вакансии
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Новая вакансия</span>
        </div>
        <Button form="career-form" type="submit" disabled={saving} size="sm">
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      <form
        id="career-form"
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
              placeholder="voditel-cementovoza"
            />
          </div>
        </FormSection>

        <FormSection title="Основная информация">
          <div className="space-y-1.5">
            <Label>Название вакансии</Label>
            <LocalizedField
              value={form.title}
              onChange={(v) => setForm((f) => ({ ...f, title: v }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Категория</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {jobCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.label.ru}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Зарплата</Label>
            <LocalizedField
              value={form.salary}
              onChange={(v) => setForm((f) => ({ ...f, salary: v }))}
              required
              placeholder="от 300 000 ₸"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Локация</Label>
            <LocalizedField
              value={form.location}
              onChange={(v) => setForm((f) => ({ ...f, location: v }))}
              required
              placeholder="Алматы"
            />
          </div>
        </FormSection>

        {(["responsibilities", "requirements", "conditions"] as ListKey[]).map((key) => (
          <FormSection key={key} title={LIST_LABELS[key]}>
            <LocalizedListEditor
              label=""
              items={form[key]}
              onChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
            />
          </FormSection>
        ))}
      </form>
    </div>
  );
}
