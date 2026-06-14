import React from "react";
import { createFileRoute, Outlet, Link, useRouter, redirect, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, Briefcase, MessageSquare, LogOut, Building2 } from "lucide-react";
import { checkAdminAuth, adminLogout } from "@/lib/api/admin.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { authenticated } = await checkAdminAuth();
    if (!authenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NAV: { to: any; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { to: "/admin/", label: "Дашборд", icon: LayoutDashboard },
  { to: "/admin/products", label: "Продукция", icon: Package },
  { to: "/admin/procurements", label: "Закупки", icon: ShoppingCart },
  { to: "/admin/careers", label: "Вакансии", icon: Briefcase },
  { to: "/admin/leads", label: "Заявки", icon: MessageSquare },
];

function AdminLayout() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Login page renders without sidebar
  if (pathname === "/admin/login") {
    return <Outlet />;
  }

  const handleLogout = async () => {
    await adminLogout();
    router.navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Building2 className="h-6 w-6 text-brand" />
          <div>
            <p className="text-sm font-bold leading-none">Eurasian Cement</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Панель управления</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/admin/" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:font-semibold [&.active]:text-foreground"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
          <Link
            to="/"
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            ← На сайт
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
