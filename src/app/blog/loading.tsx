// Add a loading.tsx next to any page.tsx to show instant loading states
// while the page's data loads — Next.js wraps the page in a React <Suspense>
// boundary automatically.
export default function Loading() {
 return <p>Loading blog(s)…</p>;
}