import { createFileRoute } from "@tanstack/react-router";
import { Package, ShoppingCart, Briefcase, MessageSquare } from "lucide-react";
import { adminGetStats } from "@/lib/api/admin.functions";

export const Route = createFileRoute("/admin/")({
  loader: async () => adminGetStats(),
  component: AdminDashboard,
});

const TYPE_LABELS: Record<string, string> = {
  sales: "Продажа",
  procurement: "Закупка",
  career: "Карьера",
};

function AdminDashboard() {
  const { productsCount, procurementsCount, jobsCount, leadsCount, recentLeads } =
    Route.useLoaderData();

  const stats = [
    { label: "Продуктов", value: productsCount, icon: Package, color: "bg-blue-500/10 text-blue-600" },
    { label: "Закупок", value: procurementsCount, icon: ShoppingCart, color: "bg-orange-500/10 text-orange-600" },
    { label: "Вакансий", value: jobsCount, icon: Briefcase, color: "bg-purple-500/10 text-purple-600" },
    { label: "Заявок", value: leadsCount, icon: MessageSquare, color: "bg-emerald-500/10 text-emerald-600" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Дашборд</h1>
      <p className="mt-1 text-sm text-muted-foreground">Обзор данных сайта</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Последние заявки</h2>
        <div className="mt-3 rounded-xl border border-border bg-card overflow-hidden">
          {recentLeads.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Заявок пока нет</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Имя</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Телефон</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Тип</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.phone}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                        {TYPE_LABELS[lead.type] ?? lead.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
