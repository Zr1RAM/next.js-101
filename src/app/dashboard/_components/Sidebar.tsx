"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";

export type SidebarItem = 
  | { href: string; label: string; icon: ReactNode; type?: never }
  | { type: "separator"; href?: never; label?: string; icon?: never; isCollapsible?: boolean };

export default function Sidebar({ items }: { items: SidebarItem[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  
  // Track collapse state for any collapsible separators by their index
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});

  const toggleSection = (index: number) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Determine which items are hidden based on preceding collapsible separators
  let activeCollapsibleIndex: number | null = null;

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
      <nav className="flex flex-col gap-2 p-3 flex-1 overflow-y-auto">
        {items.map((item, index) => {
          if ("type" in item && item.type === "separator") {
            const isCollapsible = item.isCollapsible ?? false;
            if (isCollapsible) {
              activeCollapsibleIndex = index;
            } else {
              activeCollapsibleIndex = null;
            }

            const isCollapsed = collapsedSections[index] ?? false;

            return (
              <div key={index} className="my-2">
                {isCollapsible ? (
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex items-center justify-between text-zinc-500 hover:text-zinc-300 text-xs font-semibold uppercase tracking-wider py-1 px-1 transition-colors"
                  >
                    {isExpanded && <span>{item.label}</span>}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isCollapsed ? "-rotate-90" : ""
                      } ${!isExpanded ? "mx-auto" : ""}`}
                    />
                  </button>
                ) : (
                  <hr className="border-zinc-800" />
                )}
              </div>
            );
          }

          // Check if this item belongs to a collapsed section
          const isHidden =
            activeCollapsibleIndex !== null &&
            (collapsedSections[activeCollapsibleIndex] ?? false);

          if (isHidden) return null;

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