// app/dashboard/layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, BarChart, Users, Menu, LucideIcon, Server, Computer } from "lucide-react"; // or use your preferred icons

// Define the two possible structures for your array items
type SidebarItem = 
  | { href: string; label: string; icon: LucideIcon; type?: never }
  | { type: "separator"; href?: never; label?: never; icon?: never };

const sidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { type: "separator" }, // Safe way to handle a divider/space instead of {}
  { href: "/dashboard/server-component", label: "Server Component E.g.", icon: Server },
  { href: "/dashboard/client-component", label: "Client Component E.g.", icon: Computer },
//   { href: "/dashboard/route", label: "Route Handler E.g.", icon: Home },
//   { href: "/dashboard/server-action", label: "Server Action E.g.", icon: Home },
//   { href: "/dashboard/layout", label: "Layout E.g.", icon: Home },
//   { href: "/dashboard/loading", label: "Loading E.g.", icon: Home },
//   { href: "/dashboard/not-found", label: "Not Found E.g.", icon: Home },
  { type: "separator" }, // Safe way to handle a divider/space instead of {}
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      {/* Collapsible Sidebar */}
      <aside
        className={`flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Toggle Button Header */}
        <div className="flex items-center h-16 px-4 border-b border-zinc-800">
          {isExpanded && <span className="font-bold text-lg tracking-tight">Dashboard</span>}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
              isExpanded ? "ml-auto" : "mx-auto"
            }`}
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-3 flex-1">
          {sidebarItems.map((item, index) => {
            // Handle the separator/divider case safely
    if ("type" in item && item.type === "separator") {
      return <hr key={index} className="my-2 border-zinc-800" />;
    }
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center py-3 rounded-xl transition-colors duration-200 ${
                  isActive
                    ? "bg-white/10 text-blue-400"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                } ${isExpanded ? "px-3 gap-4" : "justify-center"}`}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isExpanded && <span className="text-sm font-medium truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6">
          <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Welcome back</h2>
        </header>
        <div className="p-6 flex-1">{children}</div>
      </section>
    </div>
  );
}