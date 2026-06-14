import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors " +
        (active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}
