"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@/app/blog/_data/articles";

interface ArticleModalProps {
  article?: Article;
  slug: string;
}

export default function ArticleModal({ article, slug }: ArticleModalProps) {
  const router = useRouter();

  // Close on Escape key press and prevent body scroll while modal is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [router]);

  const handleDismiss = () => {
    router.back();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/70 backdrop-blur-md cursor-pointer transition-opacity duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/90 shadow-2xl overflow-hidden cursor-default transition-transform duration-200"
      >
        {/* Header Badges & Dismiss Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Intercepted Route
            </span>
            {article && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {article.category}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close modal"
            className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {article ? (
            <>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                  {article.title}
                </h2>

                <div className="mt-4 flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                      {article.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {article.author.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {article.author.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Excerpt Callout */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm italic leading-relaxed">
                &ldquo;{article.excerpt}&rdquo;
              </div>

              {/* Preview Paragraphs */}
              <div className="relative space-y-4 text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
                {article.content.slice(0, 2).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}

                {/* Gradient Fade to indicate full article exists */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent" />
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Article Not Found
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                No blog post matches the slug &quot;{slug}&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Modal Action Bar */}
        <div className="flex items-center justify-between gap-4 p-5 sm:px-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/80">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            ← Close Preview
          </button>

          {/* Hard browser navigation link bypasses route interception and opens the standalone article page */}
          <a
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Read Entire Blog</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
