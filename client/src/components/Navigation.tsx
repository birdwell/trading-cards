import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Edit3 } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive("/")
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link
              href="/import"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive("/import")
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Plus className="w-4 h-4" />
              Import Set
            </Link>

            {pathname.includes("/set/") && pathname.includes("/edit") && (
              <div className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <Edit3 className="w-4 h-4" />
                Edit Set
              </div>
            )}

            {pathname.includes("/set/") && !pathname.includes("/edit") && !pathname.includes("/import") && (
              <div className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <Edit3 className="w-4 h-4" />
                Set Details
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Sports Cards Collection
          </div>
        </div>
      </div>
    </nav>
  );
}
