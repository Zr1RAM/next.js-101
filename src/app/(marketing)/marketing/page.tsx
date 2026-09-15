import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-16 pb-8 text-center flex flex-col items-center">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 shadow-sm mb-6">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span>Main Children Slot (`marketing/page.tsx`)</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 max-w-4xl leading-[1.1]">
        Scale Your Product With <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Next-Gen Architecture</span>
      </h1>

      {/* Subhead */}
      <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
        Discover the power of Next.js parallel routing: modular layouts that load independent data streams in parallel without blocking your main page content.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Explore Live Dashboard →
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700/60 transition-all"
        >
          Read Blog Feed (Intercepting)
        </Link>
      </div>

      {/* Feature Pills */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
        {[
          { label: "Zero Waterfall", icon: "⚡" },
          { label: "Independent Slots", icon: "🧩" },
          { label: "Isolated Errors", icon: "🛡️" },
          { label: "Parallel Streaming", icon: "🚀" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 shadow-sm"
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}