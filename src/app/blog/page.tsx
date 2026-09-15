import BlogFeed from "@/app/blog/_components/BlogFeed";

interface BlogPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const query =
    typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";

  return <BlogFeed initialQuery={query} />;
}