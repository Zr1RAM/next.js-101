"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CircleUser } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/marketing", label: "Marketing" },
];

interface NavProps {
  userId?: string;
}

const Nav = ({ userId }: NavProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    router.refresh();
  };

  const isProfileActive = userId ? pathname === `/user/${userId}` : false;

  return (
    <nav className="flex items-center gap-2 md:gap-4 p-4 text-lg font-medium bg-zinc-950 text-white">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-xl backdrop-blur-md transition-colors duration-200 ${
              isActive 
                ? "text-blue-500/80 bg-white/10" 
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <div className="flex items-center gap-2 ml-auto">
        <Link
          href={userId ? `/user/${userId}` : "/login"}
          title="Profile"
          className={`p-2 rounded-xl backdrop-blur-md transition-colors duration-200 flex items-center justify-center ${
            isProfileActive
              ? "text-blue-400 bg-white/20"
              : "text-zinc-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <CircleUser className="w-6 h-6" />
        </Link>

        <div className="px-4 py-2 flex justify-between items-center hover:bg-red-500/20 rounded-xl backdrop-blur-md transition-colors duration-200">
          <button
            onClick={handleLogout}
            className="text-base font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;