import Link from "next/link";
import { FOOTER_NAV } from "@/constants/navigation";
import { SITE } from "@/constants/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{SITE.name}</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {SITE.description}
          </p>
        </div>

        <ul className="flex flex-wrap gap-4">
          {FOOTER_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {year} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
