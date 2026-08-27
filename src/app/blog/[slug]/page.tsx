interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
    const { slug } = await params;
  return (
    <main>
        <h1>Blog Post Page {slug}</h1>
        <p>This page is rendered from app/blog/[slug]/page.tsx</p>
        <p>Path segments: {slug}</p>
    </main>
  )
}

export default BlogPostPage

// app/blog/[slug]/page.tsx
// export default async function BlogPostPage({
//  params,
// }: {
//  params: Promise<{ slug: string }>;
// }) {
//  const { slug } = await params;
//  return <h1>Blog Post: {slug}</h1>;