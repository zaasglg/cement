import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function LangSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
      <SelectTrigger className="h-9 w-auto min-w-[72px] gap-1 border-0 bg-transparent px-2 text-xs font-semibold tracking-wide shadow-none transition-colors hover:text-brand focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-[80px] rounded-2xl p-1 shadow-lg">
        {LANGS.map((l) => (
          <SelectItem
            key={l.code}
            value={l.code}
            className="cursor-pointer rounded-full px-3 py-2 text-xs font-semibold tracking-wide data-[state=checked]:bg-brand data-[state=checked]:text-brand-foreground focus:bg-accent"
          >
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Header() {
  const { ui } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { to: "/", label: ui("nav_home") },
    { to: "/products", label: ui("nav_products") },
    { to: "/procurement", label: ui("nav_procurement") },
    { to: "/careers", label: ui("nav_careers") },
  ];

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-black">
            EC
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight">Eurasian Cement</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ТОО</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(l.to)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
              {isActive(l.to) && <span className="mx-auto mt-1 block h-0.5 w-5 rounded-full bg-brand" />}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LangSwitcher />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LangSwitcher />
          <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/70 bg-background px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2.5 text-sm font-medium",
                isActive(l.to) ? "bg-secondary text-foreground" : "text-muted-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
