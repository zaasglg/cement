import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { FormSection } from "@/components/admin/FormSection";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminGetSiteContent, adminUpdateSiteContent } from "@/lib/api/admin.functions";
import type { Localized } from "@/lib/i18n";
import type { SiteContent } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/site-content")({
  loader: async () => adminGetSiteContent(),
  component: AdminSiteContent,
});

const BENEFIT_LABELS = ["Преимущество 1", "Преимущество 2", "Преимущество 3"];
const HUB_LABELS = ["Реализация", "Закупки", "Карьера"];

function updateLocalized<T extends Record<string, unknown>>(
  list: T[],
  index: number,
  key: keyof T,
  value: Localized,
) {
  return list.map((item, i) => (i === index ? { ...item, [key]: value } : item));
}

function AdminSiteContent() {
  const router = useRouter();
  const initial = Route.useLoaderData();
  const [form, setForm] = useState<SiteContent>(initial);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateSiteContent({ data: form });
      await router.invalidate();
      toast.success("Контент сайта сохранен");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Контент сайта</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Тексты главной страницы и данные футера
          </p>
        </div>
        <Button type="submit" disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      <FormSection title="SEO главной страницы">
        <div>
          <label className="mb-2 block text-sm font-medium">Title</label>
          <LocalizedField
            required
            value={form.home.metaTitle}
            onChange={(metaTitle) => setForm({ ...form, home: { ...form.home, metaTitle } })}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>
          <LocalizedField
            required
            multiline
            value={form.home.metaDescription}
            onChange={(metaDescription) =>
              setForm({ ...form, home: { ...form.home, metaDescription } })
            }
          />
        </div>
      </FormSection>

      <FormSection title="Hero-блок">
        <div>
          <label className="mb-2 block text-sm font-medium">Бейдж</label>
          <LocalizedField
            required
            value={form.home.heroBadge}
            onChange={(heroBadge) => setForm({ ...form, home: { ...form.home, heroBadge } })}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Заголовок</label>
          <LocalizedField
            required
            multiline
            value={form.home.heroTitle}
            onChange={(heroTitle) => setForm({ ...form, home: { ...form.home, heroTitle } })}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Текст</label>
          <LocalizedField
            required
            multiline
            value={form.home.heroText}
            onChange={(heroText) => setForm({ ...form, home: { ...form.home, heroText } })}
          />
        </div>
      </FormSection>

      <FormSection title="Преимущества">
        {form.home.benefits.map((benefit, index) => (
          <div key={index} className="space-y-4 rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold">{BENEFIT_LABELS[index]}</h3>
            <div>
              <label className="mb-2 block text-sm font-medium">Заголовок</label>
              <LocalizedField
                required
                value={benefit.title}
                onChange={(title) =>
                  setForm({
                    ...form,
                    home: {
                      ...form.home,
                      benefits: updateLocalized(form.home.benefits, index, "title", title),
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Текст</label>
              <LocalizedField
                required
                multiline
                value={benefit.text}
                onChange={(text) =>
                  setForm({
                    ...form,
                    home: {
                      ...form.home,
                      benefits: updateLocalized(form.home.benefits, index, "text", text),
                    },
                  })
                }
              />
            </div>
          </div>
        ))}
      </FormSection>

      <FormSection title="Карточки разделов на главной">
        {form.home.hubs.map((hub, index) => (
          <div key={index} className="space-y-4 rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold">{HUB_LABELS[index]}</h3>
            <div>
              <label className="mb-2 block text-sm font-medium">Заголовок</label>
              <LocalizedField
                required
                value={hub.title}
                onChange={(title) =>
                  setForm({
                    ...form,
                    home: {
                      ...form.home,
                      hubs: updateLocalized(form.home.hubs, index, "title", title),
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Подзаголовок</label>
              <LocalizedField
                required
                value={hub.sub}
                onChange={(sub) =>
                  setForm({
                    ...form,
                    home: {
                      ...form.home,
                      hubs: updateLocalized(form.home.hubs, index, "sub", sub),
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Текст</label>
              <LocalizedField
                required
                multiline
                value={hub.text}
                onChange={(text) =>
                  setForm({
                    ...form,
                    home: {
                      ...form.home,
                      hubs: updateLocalized(form.home.hubs, index, "text", text),
                    },
                  })
                }
              />
            </div>
          </div>
        ))}
      </FormSection>

      <FormSection title="Footer сайта">
        <div>
          <label className="mb-2 block text-sm font-medium">Название компании</label>
          <LocalizedField
            required
            value={form.footer.companyName}
            onChange={(companyName) =>
              setForm({ ...form, footer: { ...form.footer, companyName } })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Описание</label>
          <LocalizedField
            required
            multiline
            value={form.footer.description}
            onChange={(description) =>
              setForm({ ...form, footer: { ...form.footer, description } })
            }
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Телефон</label>
            <Input
              value={form.footer.phone}
              onChange={(e) =>
                setForm({ ...form, footer: { ...form.footer, phone: e.target.value } })
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <Input
              type="email"
              value={form.footer.email}
              onChange={(e) =>
                setForm({ ...form, footer: { ...form.footer, email: e.target.value } })
              }
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Адрес</label>
          <LocalizedField
            required
            value={form.footer.address}
            onChange={(address) => setForm({ ...form, footer: { ...form.footer, address } })}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">WhatsApp URL</label>
            <Input
              value={form.footer.whatsappUrl}
              onChange={(e) =>
                setForm({ ...form, footer: { ...form.footer, whatsappUrl: e.target.value } })
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Telegram URL</label>
            <Input
              value={form.footer.telegramUrl}
              onChange={(e) =>
                setForm({ ...form, footer: { ...form.footer, telegramUrl: e.target.value } })
              }
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Текст прав</label>
          <LocalizedField
            required
            value={form.footer.rights}
            onChange={(rights) => setForm({ ...form, footer: { ...form.footer, rights } })}
          />
        </div>
      </FormSection>
    </form>
  );
}
