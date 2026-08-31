"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const Nav = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the auth cookie by setting expiration to a past date
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="flex items-center gap-2 md:gap-4 p-4 text-lg font-medium bg-zinc-950 text-white">
      <Link 
        href="/" 
        className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors duration-200"
      >
        Home
      </Link>
      <Link 
        href="/about" 
        className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors duration-200"
      >
        About
      </Link>
      <Link 
        href="/contact" 
        className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors duration-200"
      >
        Contact
      </Link>
      <Link 
        href="/blog" 
        className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors duration-200"
      >
        Blog
      </Link>
      <Link 
        href="/marketing" 
        className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-md transition-colors duration-200"
      >
        Marketing
      </Link>
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