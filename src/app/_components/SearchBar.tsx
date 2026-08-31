"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Set up a debounce timer
    const timer = setTimeout(() => {
      if (query.trim()) {
        router.push(`/blog?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push(`/blog`);
      }
    }, 400); // 400ms delay

    // Cleanup the timer if the user types again before it triggers
    return () => clearTimeout(timer);
  }, [query, router]);

  return (
    <div className="flex w-full max-w-md items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-black placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 shadow-sm"
      />
    </div>
  );
}
