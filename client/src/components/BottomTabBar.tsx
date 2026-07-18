"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Upload, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/",
    label: "Collection",
    icon: Layers,
    match: (pathname: string) =>
      pathname === "/" || pathname.startsWith("/set/"),
  },
  {
    href: "/import",
    label: "Import",
    icon: Upload,
    match: (pathname: string) => pathname.startsWith("/import"),
  },
  {
    href: "/brands",
    label: "Brands",
    icon: Building2,
    match: (pathname: string) => pathname.startsWith("/brands"),
  },
] as const;

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-3">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-16 flex-col items-center justify-center gap-1 px-2 text-xs font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2.25 : 1.75}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
