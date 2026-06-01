import { cn } from "@/lib/utils";

type DashboardCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function DashboardCard({
  children,
  className,
  title,
  subtitle,
  action,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/80",
        "bg-background/70 shadow-sm backdrop-blur-xl",
        "dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-cyan-500/[0.03] via-transparent to-violet-500/[0.04]"
        aria-hidden
      />
      {(title || action) && (
        <div className="relative flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-6 dark:border-white/5">
          <div>
            {title && (
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className="relative p-5 sm:p-6">{children}</div>
    </div>
  );
}
