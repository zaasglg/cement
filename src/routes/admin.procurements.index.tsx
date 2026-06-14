import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  adminGetProcurements,
  adminDeleteProcurement,
} from "@/lib/api/admin.functions";
import { procurementCategories } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/procurements/")({
  loader: async () => adminGetProcurements(),
  component: AdminProcurementsList,
});

function AdminProcurementsList() {
  const router = useRouter();
  const procurements = Route.useLoaderData();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (slug: string) => {
    if (!confirm("Удалить закупку?")) return;
    setDeleting(slug);
    try {
      await adminDeleteProcurement({ data: { slug } });
      router.invalidate();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Закупки</h1>
          <p className="mt-1 text-sm text-muted-foreground">{procurements.length} записей</p>
        </div>
        <Button asChild>
          <Link to="/admin/procurements/new">
            <Plus className="h-4 w-4" /> Добавить закупку
          </Link>
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Название</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Категория</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Срок</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Бюджет</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {procurements.map((p) => {
              const cat = procurementCategories.find((c) => c.id === p.category);
              return (
                <tr key={p.slug} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{p.title.ru}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cat?.label.ru ?? p.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(p.deadline).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.budget.ru}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to="/admin/procurements/$slug" params={{ slug: p.slug }}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={deleting === p.slug}
                        onClick={() => handleDelete(p.slug)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {procurements.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">Закупок нет</p>
        )}
      </div>
    </div>
  );
}
