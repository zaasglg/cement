import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminGetJobs, adminDeleteJob } from "@/lib/api/admin.functions";
import { jobCategories } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/careers/")({
  loader: async () => adminGetJobs(),
  component: AdminCareersList,
});

function AdminCareersList() {
  const router = useRouter();
  const jobs = Route.useLoaderData();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (slug: string) => {
    if (!confirm("Удалить вакансию?")) return;
    setDeleting(slug);
    try {
      await adminDeleteJob({ data: { slug } });
      router.invalidate();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Вакансии</h1>
          <p className="mt-1 text-sm text-muted-foreground">{jobs.length} записей</p>
        </div>
        <Button asChild>
          <Link to="/admin/careers/new">
            <Plus className="h-4 w-4" /> Добавить вакансию
          </Link>
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Должность</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Категория</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Зарплата</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Локация</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((j) => {
              const cat = jobCategories.find((c) => c.id === j.category);
              return (
                <tr key={j.slug} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{j.title.ru}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cat?.label.ru ?? j.category}</td>
                  <td className="px-4 py-3 text-brand font-medium">{j.salary.ru}</td>
                  <td className="px-4 py-3 text-muted-foreground">{j.location.ru}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to="/admin/careers/$slug" params={{ slug: j.slug }}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={deleting === j.slug}
                        onClick={() => handleDelete(j.slug)}
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
        {jobs.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">Вакансий нет</p>
        )}
      </div>
    </div>
  );
}
