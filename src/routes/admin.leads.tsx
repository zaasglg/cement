import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminGetLeads, adminDeleteLead } from "@/lib/api/admin.functions";
import type { Lead } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/leads")({
  loader: async () => adminGetLeads(),
  component: AdminLeads,
});

const TYPE_LABELS: Record<Lead["type"], string> = {
  sales: "Продажа",
  procurement: "Закупка",
  career: "Карьера",
};

const TYPE_COLORS: Record<Lead["type"], string> = {
  sales: "bg-blue-500/10 text-blue-700",
  procurement: "bg-orange-500/10 text-orange-700",
  career: "bg-purple-500/10 text-purple-700",
};

function getLeadSourcePath(lead: Lead) {
  if (!lead.ref) return null;
  if (lead.type === "sales") return `/products/${lead.ref}`;
  if (lead.type === "procurement") return `/procurement/${lead.ref}`;
  return `/careers/${lead.ref}`;
}

function AdminLeads() {
  const router = useRouter();
  const leads = Route.useLoaderData();
  const [filter, setFilter] = useState<"all" | Lead["type"]>("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = filter === "all" ? leads : leads.filter((l) => l.type === filter);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    setDeleting(id);
    try {
      await adminDeleteLead({ data: { id } });
      router.invalidate();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Заявки</h1>
          <p className="mt-1 text-sm text-muted-foreground">Все входящие обращения с сайта</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {(["all", "sales", "procurement", "career"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === t
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {t === "all" ? "Все" : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Заявок нет</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Имя / Компания
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Телефон</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Тип</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Источник</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Сообщение</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Дата</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${lead.phone}`} className="text-brand hover:underline">
                      {lead.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[lead.type]}`}
                    >
                      {TYPE_LABELS[lead.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {getLeadSourcePath(lead) ? (
                      <Link
                        to={getLeadSourcePath(lead) ?? "/"}
                        target="_blank"
                        className="text-brand underline-offset-4 hover:underline"
                      >
                        {getLeadSourcePath(lead)}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-muted-foreground">
                    <p className="truncate">{lead.message || "—"}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      disabled={deleting === lead.id}
                      onClick={() => handleDelete(lead.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
