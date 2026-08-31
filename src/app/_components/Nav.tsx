"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/marketing", label: "Marketing" },
];

const Nav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    router.refresh();
  };

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

      <div className="px-4 py-2 flex justify-between items-center hover:bg-red-500/20 rounded-xl backdrop-blur-md transition-colors duration-200 ml-auto">
        <button
          onClick={handleLogout}
          className="text-base font-medium text-red-400 hover:text-red-300 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Nav;