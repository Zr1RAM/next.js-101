// app/dashboard/layout.tsx
import Sidebar, { SidebarItem } from "@/app/dashboard/_components/Sidebar";
import { Home, Settings, BarChart, Users, Server, Computer } from "lucide-react";

const sidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Overview", icon: <Home /> },
  { type: "separator" },
  { href: "/dashboard/server-component", label: "Server Component E.g.", icon: <Server /> },
  { href: "/dashboard/client-component", label: "Client Component E.g.", icon: <Computer /> },
  { type: "separator" },
  { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart /> },
  { href: "/dashboard/users", label: "Users", icon: <Users /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar items={sidebarItems} />

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