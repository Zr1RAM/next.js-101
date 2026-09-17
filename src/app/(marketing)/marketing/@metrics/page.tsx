// [OPTING OUT OF CACHING FOR A WHOLE ROUTE / PARALLEL SLOT]:
// Forces this specific parallel slot to calculate fresh on every request without being statically cached.
// Even if the parent layout or sibling slots are static, @metrics stays 100% realtime.
export const dynamic = "force-dynamic";

export default function MetricsSlot() {
  const metrics = [
    { label: "Active Organizations", value: "48,200+", change: "+24% YoY", trend: "up" },
    { label: "API Requests / Day", value: "1.2B", change: "+41% YoY", trend: "up" },
    { label: "Global Latency (p99)", value: "28ms", change: "-12% drop", trend: "good" },
    { label: "System Uptime SLA", value: "99.99%", change: "Zero incidents", trend: "good" },
  ];

  return (
    <div className="flex flex-col h-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
      {/* Slot Header */}
      <div className="flex items-center justify-between gap-2 pb-5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-lg">
            📊
          </span>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Live Platform Metrics
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Parallel Slot: <code className="font-mono text-[11px] text-blue-600 dark:text-blue-400">@metrics/page.tsx</code>
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Realtime
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800/70 flex flex-col justify-between hover:border-blue-500/40 transition-colors"
          >
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {m.label}
            </span>
            <div className="mt-3">
              <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                {m.value}
              </span>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {m.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Chart Bars Graphic */}
      <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Weekly Traffic Volume</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">14.2M visits</span>
        </div>
        <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex gap-1 p-0.5">
          <div className="h-full rounded-full bg-blue-500 w-[45%]" />
          <div className="h-full rounded-full bg-indigo-500 w-[30%]" />
          <div className="h-full rounded-full bg-purple-500 w-[25%]" />
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
          <span>Direct (45%)</span>
          <span>Referral (30%)</span>
          <span>Organic (25%)</span>
        </div>
      </div>
    </div>
  );
}
