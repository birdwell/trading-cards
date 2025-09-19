import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Edit3, Package, Menu, X } from "lucide-react";
import { useState } from "react";

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
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-8">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {navigationItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(href)
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            {contextualLabel && (
              <div className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <Edit3 className="w-4 h-4" />
                {contextualLabel}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Sports Cards Collection
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Logo/Title */}
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              Sports Cards
            </div>

            {/* Contextual Label for Mobile */}
            {contextualLabel && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">{contextualLabel}</span>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="border-t border-gray-200 dark:border-gray-700 pb-3 pt-4">
              <div className="space-y-1">
                {navigationItems.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive(href)
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
