"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: "Collection", index: "01" },
  { href: "/import", label: "Import", index: "02" },
  { href: "/brands", label: "Brands", index: "03" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const getContextualLabel = () => {
    if (pathname.includes("/set/") && pathname.includes("/edit")) return "Editing Set";
    if (pathname.includes("/set/") && !pathname.includes("/import")) return "Set Details";
    if (pathname.includes("/brands/") && pathname !== "/brands") return "Brand";
    return null;
  };

  const contextualLabel = getContextualLabel();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between h-16">
          <Link href="/" className="group flex items-baseline gap-3">
            <span className="font-mono-tight text-[10px] tracking-[0.3em] text-muted-foreground">
              EST. MMXXV
            </span>
            <span className="font-display text-xl font-medium tracking-tight">
              The Almanac
            </span>
          </Link>

          <nav className="flex items-center gap-10">
            {navigationItems.map(({ href, label, index }) => (
              <Link
                key={href}
                href={href}
                className="nav-link text-sm"
                data-active={isActive(href)}
              >
                <span className="font-mono-tight text-[10px] tracking-[0.2em] text-muted-foreground/70">
                  {index}
                </span>
                <span className="font-medium tracking-tight">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {contextualLabel && (
              <>
                <span className="font-mono-tight uppercase tracking-[0.22em]">
                  {contextualLabel}
                </span>
                <span className="h-3 w-px bg-border" />
              </>
            )}
            <span className="font-mono-tight uppercase tracking-[0.22em]">
              Vol. I
            </span>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-mono-tight text-[9px] tracking-[0.28em] text-muted-foreground">
                EST. MMXXV
              </span>
              <span className="font-display text-lg font-medium tracking-tight">
                Almanac
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-expanded={isMobileMenuOpen}
              className="-mr-2 p-2 text-foreground/80 hover:text-foreground"
            >
              <span className="sr-only">Toggle menu</span>
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="border-t border-border/60 pb-4 pt-3">
              <div className="flex flex-col">
                {navigationItems.map(({ href, label, index }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-baseline gap-3 py-3 text-base transition-colors",
                      isActive(href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="font-mono-tight text-[10px] tracking-[0.2em] text-muted-foreground/70">
                      {index}
                    </span>
                    <span className="font-medium tracking-tight">{label}</span>
                    {isActive(href) && (
                      <span className="ml-2 h-px w-8 bg-foreground/60" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
