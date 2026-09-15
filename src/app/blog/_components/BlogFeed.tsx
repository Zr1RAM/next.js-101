"use client";

import Link from "next/link";
import SearchBar from "@/app/_components/SearchBar";
import { ARTICLES } from "@/app/blog/_data/articles";

interface BlogFeedProps {
  initialQuery?: string;
}

export default function BlogFeed({ initialQuery = "" }: BlogFeedProps) {
  const filteredArticles = initialQuery
    ? ARTICLES.filter(
        (article) =>
          article.title.toLowerCase().includes(initialQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(initialQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(initialQuery.toLowerCase())
      )
    : ARTICLES;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black p-6 sm:p-8 md:p-16 text-black dark:text-white">
      <main className="w-full max-w-4xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Tech Blog
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Next.js 16 App Router
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Articles & Insights
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Explore concepts in modern web architecture, routing patterns, and scalable design systems.
            Click any card to preview using <strong className="text-zinc-800 dark:text-zinc-200">Intercepting Routes</strong>.
          </p>
        </div>

        {/* Search */}
        <SearchBar />

        {initialQuery && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing results for{" "}
            <span className="font-semibold text-black dark:text-white">
              &quot;{initialQuery}&quot;
            </span>
          </p>
        )}

        {/* Article Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.id}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-500/40 hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-blue-500/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {article.category}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mt-2.5 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {article.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-zinc-900 dark:text-zinc-200">
                        {article.author.name}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {article.publishedAt}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Preview →
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="sm:col-span-2 py-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                No articles found matching &quot;{initialQuery}&quot;.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
