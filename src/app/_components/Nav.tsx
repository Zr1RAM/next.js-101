import Link from "next/link";

const Nav = ({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) => {
  return (
    <nav className="flex items-center gap-2 md:gap-4 p-4 text-lg font-medium">
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
              <div className="px-4 py-2 w-full flex justify-between items-center hover:bg-red-500/10 rounded-xl backdrop-blur-md transition-colors duration-200">
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-lg font-medium text-red-500 hover:underline"
                >
                  Logout
                </button>
              </div>
    </nav>
  );
};

export default Nav;