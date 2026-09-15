import { getArticleById } from "@/app/blog/_data/articles";
import ArticleModal from "@/app/blog/_components/ArticleModal";

interface InterceptedModalPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function InterceptedModalPage({
  params,
}: InterceptedModalPageProps) {
  const { slug } = await params;
  const article = getArticleById(slug);

  return <ArticleModal article={article} slug={slug} />;
}
