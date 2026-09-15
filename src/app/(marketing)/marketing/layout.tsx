import { ReactNode } from "react";
import Link from "next/link";

interface MarketingLayoutProps {
  children: ReactNode;
  metrics: ReactNode;
  testimonials: ReactNode;
}

export default function MarketingLayout({
  children,
  metrics,
  testimonials,
}: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Top Marketing Navigation */}
      <header className="w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-tight">
              <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/20">
                M
              </span>
              <span>Marketing Lab</span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              Parallel Routes Demo
            </span>
          </div>

          <nav className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <Link
              href="/blog"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
            >
              Blog (Intercepting)
            </Link>
            <Link
              href="/dashboard"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Page Slot: {children} */}
      <main className="flex-1 flex flex-col">
        {children}

        {/* Parallel Routes Showcase Container */}
        <section className="w-full max-w-6xl mx-auto px-6 pt-4 pb-20">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Parallel Slots: @metrics &amp; @testimonials
              </h2>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Both slots render independently within this single layout container
            </span>
          </div>

          {/* Grid hosting multiple React.Node slots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Slot 1 */}
            <div className="flex flex-col">{metrics}</div>

            {/* Slot 2 */}
            <div className="flex flex-col">{testimonials}</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white/40 dark:bg-zinc-950/40 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p>© 2026 Next.js 101 Routing Architecture Labs.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/blog" className="hover:underline">Blog Feed</Link>
            <Link href="/marketing" className="hover:underline">Marketing Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
