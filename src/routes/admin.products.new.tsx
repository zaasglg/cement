import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminCreateProduct } from "@/lib/api/admin.functions";
import { productCategories } from "@/lib/mock-data";
import type { Product } from "@/lib/mock-data";
import { FormSection } from "@/components/admin/FormSection";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProduct,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(
      /[а-яё]/g,
      (c) =>
        ({
          а: "a",
          б: "b",
          в: "v",
          г: "g",
          д: "d",
          е: "e",
          ё: "yo",
          ж: "zh",
          з: "z",
          и: "i",
          й: "y",
          к: "k",
          л: "l",
          м: "m",
          н: "n",
          о: "o",
          п: "p",
          р: "r",
          с: "s",
          т: "t",
          у: "u",
          ф: "f",
          х: "kh",
          ц: "ts",
          ч: "ch",
          ш: "sh",
          щ: "shch",
          ъ: "",
          ы: "y",
          ь: "",
          э: "e",
          ю: "yu",
          я: "ya",
        })[c] ?? c,
    )
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EMPTY: Product = {
  slug: "",
  title: { ru: "" },
  category: "bulk",
  status: "in_stock",
  price: { ru: "" },
  description: { ru: "" },
  application: { ru: "" },
  specs: [{ label: { ru: "" }, value: { ru: "" } }],
  image: "",
  gallery: [],
};

function NewProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Product>(EMPTY);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminCreateProduct({ data: form });
      navigate({ to: "/admin/products" });
    } finally {
      setSaving(false);
    }
  };

  const setSpec = (i: number, part: "label" | "value", lang: "ru" | "kk" | "en", val: string) =>
    setForm((f) => ({
      ...f,
      specs: f.specs.map((s, idx) =>
        idx === i ? { ...s, [part]: { ...s[part], [lang]: val } } : s,
      ),
    }));

  const addSpec = () =>
    setForm((f) => ({ ...f, specs: [...f.specs, { label: { ru: "" }, value: { ru: "" } }] }));

  const removeSpec = (i: number) =>
    setForm((f) => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }));

  const setGalleryItem = (i: number, val: string) =>
    setForm((f) => ({ ...f, gallery: f.gallery.map((g, idx) => (idx === i ? val : g)) }));

  const addGallery = () => setForm((f) => ({ ...f, gallery: [...f.gallery, ""] }));
  const removeGallery = (i: number) =>
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }));

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/admin/products"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Продукция
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Новый продукт</span>
        </div>
        <Button form="product-form" type="submit" disabled={saving} size="sm">
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      {/* Form */}
      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-2xl space-y-5 px-6 py-8"
      >
        <FormSection title="Идентификатор">
          <div className="space-y-1.5">
            <Label>Slug (URL)</Label>
            <Input required disabled value={form.slug} placeholder="cem-i-425n-m500-bulk" />
          </div>
        </FormSection>

        <FormSection title="Основная информация">
          <div className="space-y-1.5">
            <Label>Название</Label>
            <LocalizedField
              value={form.title}
              onChange={(v) =>
                setForm((f) => {
                  const currentAutoSlug = slugify(f.title.ru);
                  const shouldUpdateSlug = !f.slug || f.slug === currentAutoSlug;

                  return {
                    ...f,
                    title: v,
                    slug: shouldUpdateSlug ? slugify(v.ru) : f.slug,
                  };
                })
              }
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
                {productCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label.ru}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Статус</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as Product["status"] }))
                }
              >
                <option value="in_stock">В наличии</option>
                <option value="on_order">Под заказ</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Цена</Label>
            <LocalizedField
              value={form.price}
              onChange={(v) => setForm((f) => ({ ...f, price: v }))}
              required
              placeholder="от 28 500 ₸ / тонна"
            />
          </div>
        </FormSection>

        <FormSection title="Описание">
          <div className="space-y-1.5">
            <Label>Описание продукта</Label>
            <LocalizedField
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              required
              multiline
            />
          </div>
          <div className="space-y-1.5">
            <Label>Область применения</Label>
            <LocalizedField
              value={form.application}
              onChange={(v) => setForm((f) => ({ ...f, application: v }))}
              required
              multiline
            />
          </div>
        </FormSection>

        <FormSection title="Изображения">
          <div className="space-y-1.5">
            <Label>Главное изображение</Label>
            <ImageUpload
              value={form.image}
              onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Галерея</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addGallery}>
                <Plus className="h-3 w-3" /> Добавить фото
              </Button>
            </div>
            {form.gallery.length === 0 && (
              <p className="text-xs text-muted-foreground">Нет фотографий в галерее</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {form.gallery.map((url, i) => (
                <div key={i} className="relative">
                  <ImageUpload value={url} onChange={(u) => setGalleryItem(i, u)} />
                  <button
                    type="button"
                    onClick={() => removeGallery(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </FormSection>

        <FormSection title="Характеристики">
          <div className="space-y-3">
            {form.specs.map((spec, i) => (
              <div key={i} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Характеристика {i + 1}
                  </span>
                  {form.specs.length > 1 && (
                    <button type="button" onClick={() => removeSpec(i)}>
                      <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Параметр</p>
                  {(["ru", "kk", "en"] as const).map((lang) => (
                    <div key={lang} className="flex items-center gap-3">
                      <span className="w-7 shrink-0 text-xs font-semibold text-muted-foreground">
                        {lang.toUpperCase()}
                      </span>
                      <Input
                        required={lang === "ru"}
                        value={spec.label[lang] ?? ""}
                        onChange={(e) => setSpec(i, "label", lang, e.target.value)}
                        placeholder={lang === "ru" ? "Класс прочности" : ""}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Значение</p>
                  {(["ru", "kk", "en"] as const).map((lang) => (
                    <div key={lang} className="flex items-center gap-3">
                      <span className="w-7 shrink-0 text-xs font-semibold text-muted-foreground">
                        {lang.toUpperCase()}
                      </span>
                      <Input
                        required={lang === "ru"}
                        value={spec.value[lang] ?? ""}
                        onChange={(e) => setSpec(i, "value", lang, e.target.value)}
                        placeholder={lang === "ru" ? "42,5N" : ""}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addSpec} className="w-full">
              <Plus className="h-3 w-3" /> Добавить характеристику
            </Button>
          </div>
        </FormSection>
      </form>
    </div>
  );
}
