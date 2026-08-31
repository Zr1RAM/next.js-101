// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 mb-2">
        404
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
      >
        Return Home
      </Link>
    </div>
  );
}