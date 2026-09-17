import BlogFeed from "@/app/blog/_components/BlogFeed";

// [REVALIDATING DATA FOR A WHOLE ROUTE (ISR)]:
// Revalidates this entire page in the Full Route Cache at most once every 60 seconds.
// Visitors get instantly-cached HTML, and Next.js re-renders fresh blog data in the background after the timer expires.
export const revalidate = 60;

interface BlogPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const query =
    typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";

  return <BlogFeed initialQuery={query} />;
}