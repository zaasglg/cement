import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  adminGetProducts,
  adminDeleteProduct,
} from "@/lib/api/admin.functions";
import { productCategories } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/products/")({
  loader: async () => adminGetProducts(),
  component: AdminProductsList,
});

function AdminProductsList() {
  const router = useRouter();
  const products = Route.useLoaderData();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (slug: string) => {
    if (!confirm("Удалить продукт?")) return;
    setDeleting(slug);
    try {
      await adminDeleteProduct({ data: { slug } });
      router.invalidate();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Продукция</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} товаров</p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4" /> Добавить продукт
          </Link>
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Продукт</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Категория</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Статус</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Цена</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => {
              const cat = productCategories.find((c) => c.id === p.category);
              return (
                <tr key={p.slug} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.title.ru}
                        className="h-10 w-10 rounded-lg object-cover bg-muted"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div>
                        <p className="font-medium leading-tight">{p.title.ru}</p>
                        <p className="text-xs text-muted-foreground">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{cat?.label.ru ?? p.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs font-medium " +
                        (p.status === "in_stock"
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-amber-500/10 text-amber-700")
                      }
                    >
                      {p.status === "in_stock" ? "В наличии" : "Под заказ"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-brand">{p.price.ru}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to="/admin/products/$slug" params={{ slug: p.slug }}>
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
        {products.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">Продуктов нет</p>
        )}
      </div>
    </div>
  );
}
