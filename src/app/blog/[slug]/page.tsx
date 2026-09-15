import Link from "next/link";
import { getArticleById, ARTICLES } from "@/app/blog/_data/articles";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = getArticleById(slug);

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-6 text-zinc-900 dark:text-zinc-50">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl text-center space-y-4">
          <span className="text-4xl">🔍</span>
          <h1 className="text-2xl font-bold tracking-tight">Article Not Found</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            We couldn&apos;t find an article matching &quot;{slug}&quot;.
          </p>
          <div className="pt-2">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const otherArticles = ARTICLES.filter((a) => a.id !== article.id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-950 dark:text-zinc-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-10">
        {/* Navigation & Status Badge */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            ← Back to Blog Feed
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300/50 dark:border-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Standalone Full Page View
          </span>
        </div>

        {/* Article Header */}
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {article.category}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {article.publishedAt}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {article.readTime}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-zinc-950 dark:text-zinc-50">
            {article.title}
          </h1>

          {/* Author Card */}
          <div className="flex items-center gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800/80">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-base font-bold text-white shadow-md">
              {article.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {article.author.name}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {article.author.role}
              </p>
            </div>
          </div>
        </header>

        {/* Excerpt Lead */}
        <div className="p-6 sm:p-8 rounded-3xl bg-blue-50/50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800/90 shadow-sm">
          <p className="text-lg sm:text-xl font-medium text-zinc-800 dark:text-zinc-200 italic leading-relaxed">
            &ldquo;{article.excerpt}&rdquo;
          </p>
        </div>

        {/* Full Article Content */}
        <article className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          {article.content.map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Bottom Callout: Routing Explanation */}
        <section className="mt-8 p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Route Architecture Note
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            You are viewing the standalone route at <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">src/app/blog/[slug]/page.tsx</code>.
            When navigating from the main blog list, Next.js intercepted the route using <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">src/app/blog/(.)[slug]/page.tsx</code> to display the preview modal.
            Clicking &quot;Read Entire Blog&quot; or directly entering this URL bypassed interception to serve this complete article.
          </p>
        </section>

        {/* Other Articles Suggestions */}
        <section className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-10 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            More Articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {otherArticles.map((other) => (
              <Link
                key={other.id}
                href={`/blog/${other.id}`}
                className="group p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-blue-500/50 shadow-sm transition-all"
              >
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {other.category}
                </span>
                <h4 className="mt-1 text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {other.title}
                </h4>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {other.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}