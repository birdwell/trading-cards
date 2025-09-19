import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Edit3, Package, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const navigationItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/import", icon: Plus, label: "Import Set" },
    { href: "/brands", icon: Package, label: "Brands" },
  ];

  const getContextualLabel = () => {
    if (pathname.includes("/set/") && pathname.includes("/edit")) {
      return "Edit Set";
    }
    if (pathname.includes("/set/") && !pathname.includes("/edit") && !pathname.includes("/import")) {
      return "Set Details";
    }
    if (pathname.includes("/brands/") && pathname !== "/brands") {
      return "Brand Details";
    }
    return null;
  };

  const contextualLabel = getContextualLabel();

  return (
    <nav className="bg-card border-b border-border mb-8">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {navigationItems.map(({ href, icon: Icon, label }) => (
              <Button
                key={href}
                asChild
                variant={isActive(href) ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "gap-2",
                  isActive(href) && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <Link href={href}>
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              </Button>
            ))}

            {contextualLabel && (
              <div className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                <Edit3 className="w-4 h-4" />
                {contextualLabel}
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Sports Cards Collection
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Logo/Title */}
            <div className="text-lg font-semibold text-foreground">
              Sports Cards
            </div>

            {/* Contextual Label for Mobile */}
            {contextualLabel && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">{contextualLabel}</span>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="border-t border-border pb-3 pt-4">
              <div className="space-y-1">
                {navigationItems.map(({ href, icon: Icon, label }) => (
                  <Button
                    key={href}
                    asChild
                    variant={isActive(href) ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive(href) && "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={href}>
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
