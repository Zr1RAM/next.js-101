"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

export type SidebarItem = 
  | { href: string; label: string; icon: ReactNode; type?: never }
  | { type: "separator"; href?: never; label?: never; icon?: never };

export default function Sidebar({ items }: { items: SidebarItem[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  return (
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
        {items.map((item, index) => {
          if ("type" in item && item.type === "separator") {
            return <hr key={index} className="my-2 border-zinc-800" />;
          }
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
              {React.isValidElement(item.icon) 
                ? React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-5 h-5 shrink-0" }) 
                : item.icon}
              {isExpanded && <span className="text-sm font-medium truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
