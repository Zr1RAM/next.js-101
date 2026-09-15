export default function TestimonialsSlot() {
  const reviews = [
    {
      author: "Elena Rostova",
      role: "VP of Engineering at CloudScale",
      quote: "Migrating to parallel streaming routes cut our core Web Vitals TTFB in half. The modular layouts keep our code clean.",
      avatar: "ER",
      color: "from-purple-500 to-indigo-600",
    },
    {
      author: "Marcus Chen",
      role: "Head of Product, FinPulse",
      quote: "Our marketing and conversion teams can iterate independently without touching complex main layout logic.",
      avatar: "MC",
      color: "from-blue-500 to-cyan-600",
    },
  ];

  return (
    <div className="flex flex-col h-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
      {/* Slot Header */}
      <div className="flex items-center justify-between gap-2 pb-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 text-lg">
            ⭐
          </span>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Customer Validation
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Parallel Slot: <code className="font-mono text-[11px] text-purple-600 dark:text-purple-400">@testimonials/page.tsx</code>
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          4.9 / 5.0 Rating
        </span>
      </div>

      {/* Testimonial Cards */}
      <div className="flex flex-col gap-4 mt-6 flex-1 justify-between">
        {reviews.map((r, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800/70 flex flex-col gap-3 hover:border-purple-500/40 transition-colors"
          >
            <p className="text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
              &ldquo;{r.quote}&rdquo;
            </p>

            <div className="flex items-center gap-3 pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-tr ${r.color} flex items-center justify-center text-xs font-bold text-white shadow-sm`}
              >
                {r.avatar}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {r.author}
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {r.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Footer */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>Trusted by 1,400+ tech leaders</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">99.4% CSAT</span>
      </div>
    </div>
  );
}
