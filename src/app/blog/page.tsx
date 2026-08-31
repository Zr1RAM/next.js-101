import Link from "next/link";
import SearchBar from "@/app/_components/SearchBar";

export default async function BlogPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams?.q === "string" ? searchParams.q : "";

  // Mock articles for demonstration
  const articles = [
    { id: "hi", title: "Saying Hi to Next.js", excerpt: "A short introduction to Next.js app router." },
    { id: "navigation", title: "Programmatic Navigation", excerpt: "How to use useRouter effectively." },
    { id: "styling", title: "Styling with Tailwind", excerpt: "Making your blog look beautiful." },
  ];

  const filteredArticles = query
    ? articles.filter((article) =>
        article.title.toLowerCase().includes(query.toLowerCase())
      )
    : articles;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black p-8 md:p-16 text-black dark:text-white">
      <main className="w-full max-w-4xl flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">Blog</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Thoughts, tutorials, and insights.
          </p>
        </div>

        <SearchBar />

        {query && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing results for <span className="font-semibold text-black dark:text-white">&quot;{query}&quot;</span>
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/blog/${article.id}`}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <h2 className="mb-2 text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-2">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">No articles found.</p>
          )}
        </div>
      </main>
    </div>
  );
}