import Link from "next/link"

const BlogPage = () => {
  return (
    <main>
        <h1>Blog Page</h1>
        <p>This page is rendered from app/blog/page.tsx</p>
        <p>when url has only /blog and not /blog/:slug (params in next js), this default page is loaded</p>
        <Link href="/blog/hi">Go to blog post page</Link>
    </main>
  )
}

export default BlogPage